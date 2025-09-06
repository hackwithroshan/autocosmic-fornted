import { Request, Response, NextFunction } from 'express';
import prisma from '../../prisma';
// FIX: Corrected import path.
import { AuthRequest } from '../../middlewares/auth.middleware';
import { logAdminAction } from '../../services/audit.service';
import bcrypt from 'bcryptjs';

const isMongoDbId = (id: string): boolean => {
    if(!id) return false;
    return /^[0-9a-fA-F]{24}$/.test(id);
};

// Product Controllers
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { id, variants: initialVariants, category, subCategory, ...productData } = req.body;
    
    const hasVariants = initialVariants && Array.isArray(initialVariants) && initialVariants.length > 0;

    // --- Validation Logic ---
    if (!productData.name || productData.mrp === undefined || !productData.sku || !category) {
        return res.status(400).json({ message: 'Name, MRP, SKU, and Category are required fields.' });
    }

    if (!hasVariants) {
        if (productData.price === undefined) {
             return res.status(400).json({ message: 'A base Selling Price is required for a product without variants.' });
        }
    } else { // It has variants
        if (!initialVariants.every((v: any) => v.price !== undefined && v.sku)) {
            return res.status(400).json({ message: 'All variants must have a price and a SKU.' });
        }
        // If the base price wasn't sent (because UI hides it), we must assign one.
        if (productData.price === undefined) {
            productData.price = initialVariants[0].price || productData.mrp || 0;
        }
    }
    // --- End Validation Logic ---

    const variantsToCreate = hasVariants ? initialVariants.map(({ id, ...vData }: any) => vData) : [];

    try {
        const product = await prisma.product.create({
            data: {
                ...productData,
                categoryName: category,
                subCategoryName: subCategory,
                variants: {
                    create: variantsToCreate
                }
            },
            include: { variants: true },
        });
        await logAdminAction(req, `Created product: ${product.name}`, `ID: ${product.id}`);
        res.status(201).json(product);
    } catch (error) {
        console.error("Error creating product:", error);
        next(error);
    }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { id: reqBodyId, variants, category, subCategory, ...productData } = req.body;

    const hasVariants = variants && Array.isArray(variants) && variants.length > 0;

    // --- Validation Logic ---
    if (!productData.name || productData.mrp === undefined || !productData.sku || !category) {
        return res.status(400).json({ message: 'Name, MRP, SKU, and Category are required fields.' });
    }
    
    if (!hasVariants) {
        if (productData.price === undefined) {
             return res.status(400).json({ message: 'A base Selling Price is required for a product without variants.' });
        }
    } else { // It has variants
        if (!variants.every((v: any) => v.price !== undefined && v.sku)) {
            return res.status(400).json({ message: 'All variants must have a price and a SKU.' });
        }
        if (productData.price === undefined) {
            productData.price = variants[0].price || productData.mrp || 0;
        }
    }
    // --- End Validation Logic ---

    try {
        const dataToUpdate: any = {
            ...productData,
            categoryName: category,
            subCategoryName: subCategory,
        };

        await prisma.$transaction(async (tx) => {
            // 1. Update the base product
            await tx.product.update({ where: { id }, data: dataToUpdate });
            
            // 2. Handle variants (syncing)
            if (variants && Array.isArray(variants)) {
                const existingVariants = await tx.productVariant.findMany({ where: { productId: id } });
                const existingVariantIds = new Set(existingVariants.map(v => v.id));
                
                const incomingVariants = variants.map((v: any) => ({ ...v, id: isMongoDbId(v.id) ? v.id : undefined }));
                const incomingVariantIds = new Set(incomingVariants.map((v: any) => v.id).filter(Boolean));
                
                // Delete variants that are no longer present
                const variantsToDelete = existingVariants.filter(v => !incomingVariantIds.has(v.id));
                if (variantsToDelete.length > 0) {
                    await tx.productVariant.deleteMany({ where: { id: { in: variantsToDelete.map(v => v.id) } } });
                }

                // Update existing and create new variants
                for (const variantData of incomingVariants) {
                    const { id: variantId, ...data } = variantData;
                    if (variantId && existingVariantIds.has(variantId)) {
                        await tx.productVariant.update({ where: { id: variantId }, data });
                    } else {
                        await tx.productVariant.create({ data: { ...data, productId: id } });
                    }
                }
            } else if (variants === null || (Array.isArray(variants) && variants.length === 0)) {
                // If an empty array or null is passed, delete all variants
                await tx.productVariant.deleteMany({ where: { productId: id } });
            }
        });

        await logAdminAction(req, `Updated product: ${productData.name}`, `ID: ${id}`);
        const finalProduct = await prisma.product.findUnique({ where: { id }, include: { variants: true }});
        res.json(finalProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        next(error);
    }
};


export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.findUnique({ where: { id } });
        await prisma.product.delete({ where: { id } });
        await logAdminAction(req, `Deleted product: ${product?.name || 'Unknown'}`, `ID: ${id}`);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

// Inventory Controller
export const updateStock = async (req: Request, res: Response, next: NextFunction) => {
    const { productId, variantSku, newStock } = req.body;
    try {
        if (variantSku) {
            // Find the specific variant to update its stock
            const variant = await prisma.productVariant.findFirst({
                where: { productId, sku: variantSku },
            });
            if (variant) {
                await prisma.productVariant.update({
                    where: { id: variant.id },
                    data: { stockQuantity: newStock },
                });
            } else {
                return res.status(404).json({ message: 'Product variant not found.' });
            }
        } else {
            // Update stock for a base product (without variants)
            await prisma.product.update({
                where: { id: productId },
                data: { stockQuantity: newStock },
            });
        }
        await logAdminAction(req, 'Updated stock', `Product ID: ${productId}, SKU: ${variantSku || 'base'}, New Stock: ${newStock}`);
        res.status(200).json({ success: true, message: 'Stock updated successfully.' });
    } catch (error) {
        next(error);
    }
};

// Order Controllers
export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { orderDate: 'desc' },
            include: {
                user: { select: { name: true, email: true } },
                items: {
                    include: {
                        product: true,
                        variant: true,
                    },
                },
            }
        });
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status },
            include: { 
                items: {
                    include: {
                        product: true,
                        variant: true,
                    },
                },
            }
        });
        await logAdminAction(req, `Updated order status`, `Order ID: ${id}, New Status: ${status}`);
        res.json(updatedOrder);
    } catch (error) {
        next(error);
    }
};

// Customer Controllers
export const getAllCustomers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customersData = await prisma.user.findMany({
            where: { role: 'USER' },
            orderBy: { joinDate: 'desc' },
            include: {
                _count: { select: { orders: true }},
                orders: {
                    select: { totalAmount: true, orderDate: true },
                    orderBy: { orderDate: 'desc' },
                }
            }
        });

        const customersWithStats = customersData.map(c => ({
            id: c.id,
            name: c.name,
            email: c.email,
            phone: c.phone,
            joinDate: c.joinDate,
            totalOrders: c._count.orders,
            totalSpent: c.orders.reduce((sum, order) => sum + order.totalAmount, 0),
            lastOrderDate: c.orders.length > 0 ? c.orders[0].orderDate : undefined,
            profilePictureUrl: c.profilePictureUrl,
            isBlocked: c.isBlocked,
        }));

        res.json(customersWithStats);
    } catch (error) {
        next(error);
    }
};

export const toggleCustomerBlock = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { isBlocked: !user.isBlocked },
        });
        await logAdminAction(req, `Toggled block status for user ${user.name}`, `New status: ${updatedUser.isBlocked ? 'Blocked' : 'Active'}`);
        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
};


// Coupon Controllers
export const getCoupons = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const coupons = await prisma.coupon.findMany({ orderBy: { id: 'desc' } });
        res.json(coupons);
    } catch (error) {
        next(error);
    }
};

export const createCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const couponData = req.body;
        const coupon = await prisma.coupon.create({ data: couponData });
        await logAdminAction(req, 'Created coupon', `Code: ${coupon.code}`);
        res.status(201).json(coupon);
    } catch (error) {
        next(error);
    }
};

export const updateCoupon = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const couponData = req.body;
    try {
        const coupon = await prisma.coupon.update({ where: { id }, data: couponData });
        await logAdminAction(req, 'Updated coupon', `Code: ${coupon.code}`);
        res.json(coupon);
    } catch (error) {
        next(error);
    }
};

export const deleteCoupon = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const coupon = await prisma.coupon.findUnique({ where: { id } });
        await prisma.coupon.delete({ where: { id } });
        await logAdminAction(req, 'Deleted coupon', `Code: ${coupon?.code}`);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

// Media Library Controller
export const getMediaLibrary = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const media = await prisma.mediaFile.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(media);
    } catch (error) {
        next(error);
    }
};

export const deleteMediaFile = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const mediaFile = await prisma.mediaFile.findUnique({ where: { id } });
        // In a real app, you would also delete the file from Cloudinary here
        await prisma.mediaFile.delete({ where: { id } });
        await logAdminAction(req, 'Deleted media file', `Name: ${mediaFile?.name}`);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};


// Category Controllers
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await prisma.category.findMany({
            where: { parentId: null },
            include: { subCategories: true },
            orderBy: { name: 'asc' }
        });
        res.json(categories);
    } catch (error) {
        next(error);
    }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = await prisma.category.create({ data: req.body });
        await logAdminAction(req, 'Created category', `Name: ${category.name}`);
        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const category = await prisma.category.update({ where: { id }, data: req.body });
        await logAdminAction(req, 'Updated category', `Name: ${category.name}`);
        res.json(category);
    } catch (error) {
        next(error);
    }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const categoryToDelete = await prisma.category.findUnique({ where: { id } });
        if (!categoryToDelete) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        // 1. Gather all category and sub-category names and IDs
        const allCategoryNames: string[] = [];
        const queue: string[] = [id];
        
        while (queue.length > 0) {
            const currentId = queue.shift()!;
            const category = await prisma.category.findUnique({ where: { id: currentId }, include: { subCategories: true } });
            if (category) {
                allCategoryNames.push(category.name);
                category.subCategories.forEach(sub => queue.push(sub.id));
            }
        }
        
        // 2. Check if any products are using these categories
        const productsUsingCategory = await prisma.product.count({
            where: {
                OR: [
                    { categoryName: { in: allCategoryNames, mode: 'insensitive' } },
                    { subCategoryName: { in: allCategoryNames, mode: 'insensitive' } }
                ]
            }
        });

        if (productsUsingCategory > 0) {
            return res.status(400).json({ message: `Cannot delete. ${productsUsingCategory} product(s) are assigned to this category or its subcategories. Please reassign them first.` });
        }
        
        // 3. Delete categories from bottom up.
        const deleteSubCategories = async (parentId: string) => {
            const subCategories = await prisma.category.findMany({ where: { parentId } });
            for (const sub of subCategories) {
                await deleteSubCategories(sub.id);
                await prisma.category.delete({ where: { id: sub.id } });
            }
        };
        await deleteSubCategories(id);
        const deletedCategory = await prisma.category.delete({ where: { id } });
        
        await logAdminAction(req, 'Deleted category and its subcategories', `Name: ${deletedCategory?.name}`);
        res.status(204).send();

    } catch (error) {
        next(error);
    }
};


// Tag Controllers
export const getTags = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productsWithTags = await prisma.product.findMany({
            where: { tags: { isEmpty: false } },
            select: { tags: true }
        });
        const tagCounts: Record<string, number> = {};
        productsWithTags.forEach(p => {
            p.tags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });
        const result = Object.entries(tagCounts).map(([name, count]) => ({ name, count }));
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const deleteTagFromAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    const { tagName } = req.params;
    try {
        const productsToUpdate = await prisma.product.findMany({
            where: { tags: { has: tagName } },
            select: { id: true, tags: true }
        });

        const updatePromises = productsToUpdate.map(p => {
            return prisma.product.update({
                where: { id: p.id },
                data: { tags: { set: p.tags.filter(t => t !== tagName) } }
            });
        });

        await prisma.$transaction(updatePromises);
        await logAdminAction(req, 'Deleted tag from all products', `Tag: ${tagName}`);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

// Variant Attribute Controllers
export const getVariantAttributes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const attributes = await prisma.variantAttribute.findMany({ orderBy: { name: 'asc' }});
        res.json(attributes);
    } catch (error) { next(error); }
};
export const createVariantAttribute = async (req: Request, res: Response, next: NextFunction) => {
    const { name, values } = req.body;
    try {
        const existing = await prisma.variantAttribute.findFirst({
            where: { name: { equals: name, mode: 'insensitive' } }
        });
        if (existing) {
            return res.status(409).json({ message: `Attribute "${name}" already exists.` });
        }
        const attribute = await prisma.variantAttribute.create({ data: { name, values } });
        await logAdminAction(req, 'Created Variant Attribute', `Name: ${attribute.name}`);
        res.status(201).json(attribute);
    } catch (error) {
        next(error);
    }
};
export const updateVariantAttribute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Exclude 'id' from the data being sent to prisma, as it's the identifier
        const { id, ...dataToUpdate } = req.body;
        const attribute = await prisma.variantAttribute.update({ 
            where: { id: req.params.id }, 
            data: dataToUpdate 
        });
        await logAdminAction(req, 'Updated Variant Attribute', `Name: ${attribute.name}`);
        res.json(attribute);
    } catch (error) { next(error); }
};
export const deleteVariantAttribute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const attr = await prisma.variantAttribute.findUnique({ where: { id: req.params.id } });
        // TODO: Check if this attribute is in use by any product variant before deleting.
        await prisma.variantAttribute.delete({ where: { id: req.params.id } });
        await logAdminAction(req, 'Deleted Variant Attribute', `Name: ${attr?.name}`);
        res.status(204).send();
    } catch (error) { next(error); }
};


// Testimonial Controllers
export const getTestimonials = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const testimonials = await prisma.testimonial.findMany({ orderBy: { id: 'desc' } });
        res.json(testimonials);
    } catch (error) { next(error); }
};
export const createTestimonial = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const testimonial = await prisma.testimonial.create({ data: req.body });
        res.status(201).json(testimonial);
    } catch (error) { next(error); }
};
export const updateTestimonial = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const testimonial = await prisma.testimonial.update({ where: { id: req.params.id }, data: req.body });
        res.json(testimonial);
    } catch (error) { next(error); }
};
export const deleteTestimonial = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await prisma.testimonial.delete({ where: { id: req.params.id } });
        res.status(204).send();
    } catch (error) { next(error); }
};

// Review Controllers
export const getReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviews = await prisma.productReview.findMany({
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true } }, product: { select: { name: true, imageUrl: true } } }
        });
        res.json(reviews);
    } catch (error) { next(error); }
};

export const updateReview = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { approved } = req.body;
    try {
        const review = await prisma.productReview.update({ where: { id }, data: { approved } });
        res.json(review);
    } catch (error) { next(error); }
};

export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        await prisma.productReview.delete({ where: { id } });
        res.status(204).send();
    } catch (error) { next(error); }
};

export const getTicketById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const ticket = await prisma.supportTicket.findUnique({ where: { id } });
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json(ticket);
    } catch (error) { next(error); }
};

export const markTicketAsRead = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        await prisma.supportTicket.update({
            where: { id },
            data: { seenByAdmin: true }
        });
        res.status(200).json({ success: true });
    } catch (error) { next(error); }
};

// Support Ticket Controller
export const updateSupportTicket = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status, messages } = req.body;

    try {
        const dataToUpdate: any = {
            lastUpdated: new Date().toISOString(),
        };

        if (status) {
            dataToUpdate.status = status;
        }

        if (messages) {
            dataToUpdate.messages = messages;
            // When an admin sends a message, it means they've seen the ticket.
            dataToUpdate.seenByAdmin = true;
        }

        const ticket = await prisma.supportTicket.update({
            where: { id },
            data: dataToUpdate,
        });

        await logAdminAction(req, 'Updated support ticket', `Ticket ID: ${id}`);
        res.json(ticket);
    } catch (error) {
        next(error);
    }
};

// Chat Controllers
export const getAdminChatSessions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sessions = await prisma.chatSession.findMany({
            orderBy: { lastUpdated: 'desc' },
            include: {
                user: { select: { name: true }},
                messages: { orderBy: { timestamp: 'desc' }, take: 1, select: { text: true }}
            }
        });
        res.json(sessions);
    } catch (error) { next(error); }
};

export const getChatMessages = async (req: Request, res: Response, next: NextFunction) => {
    const { sessionId } = req.params;
    try {
        const messages = await prisma.chatMessage.findMany({
            where: { sessionId },
            orderBy: { timestamp: 'asc' }
        });
        res.json(messages);
    } catch (error) { next(error); }
};

export const sendAdminMessage = async (req: Request, res: Response, next: NextFunction) => {
    const { sessionId } = req.params;
    const { text, attachmentUrl, attachmentType } = req.body;
    try {
        const message = await prisma.chatMessage.create({
            data: {
                sessionId,
                text,
                attachmentUrl,
                attachmentType,
                sender: 'admin'
            }
        });
        await prisma.chatSession.update({
            where: { id: sessionId },
            data: { lastUpdated: new Date() }
        });
        await logAdminAction(req, 'Sent chat message', `Session ID: ${sessionId}`);
        res.status(201).json(message);
    } catch (error) {
        next(error);
    }
};

// FAQ Controllers
export const getFaqs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const faqs = await prisma.faq.findMany({ orderBy: { order: 'asc' } });
        res.json(faqs);
    } catch (error) { next(error); }
};
export const createFaq = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const faq = await prisma.faq.create({ data: req.body });
        res.status(201).json(faq);
    } catch (error) { next(error); }
};
export const updateFaq = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const faq = await prisma.faq.update({ where: { id: req.params.id }, data: req.body });
        res.json(faq);
    } catch (error) { next(error); }
};
export const deleteFaq = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await prisma.faq.delete({ where: { id: req.params.id } });
        res.status(204).send();
    } catch (error) { next(error); }
};

// User & Role Management
export const createAdminUser = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, role, isActive } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Name, email, password, and role are required.' });
    }
    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword, role, isActive },
        });
        await logAdminAction(req, 'Created admin user', `Name: ${user.name}`);
        const { password: _, ...userResponse } = user;
        res.status(201).json(userResponse);
    } catch (error) { next(error); }
};

export const updateAdminUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, email, role, isActive, password } = req.body;
    try {
        const dataToUpdate: any = { name, email, role, isActive };
        if (password && password.length > 0) {
            dataToUpdate.password = await bcrypt.hash(password, 10);
        }
        const user = await prisma.user.update({ where: { id }, data: dataToUpdate });
        await logAdminAction(req, 'Updated admin user', `Name: ${user.name}`);
        const { password: _, ...userResponse } = user;
        res.json(userResponse);
    } catch (error) { next(error); }
};

export const deleteAdminUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return res.status(404).json({ message: 'User not found' });
        await prisma.user.delete({ where: { id } });
        await logAdminAction(req, 'Deleted admin user', `Name: ${user.name}`);
        res.status(204).send();
    } catch (error) { next(error); }
};

// Payment Gateway Controllers
export const getPaymentGateways = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const defaultGateways = [
            { name: 'Razorpay', enabled: true, settings: {} },
            { name: 'Cash on Delivery', enabled: true, settings: {} }
        ];
        
        for (const gateway of defaultGateways) {
            await prisma.paymentGateway.upsert({
                where: { name: gateway.name },
                update: {},
                create: gateway,
            });
        }
        
        const gateways = await prisma.paymentGateway.findMany();
        res.json(gateways);
    } catch (error) { next(error); }
};
export const updatePaymentGateway = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { id: reqBodyId, ...dataToUpdate } = req.body;

    try {
        const gateway = await prisma.paymentGateway.update({
            where: { id },
            data: dataToUpdate,
        });
        res.json(gateway);
    } catch (error) {
        console.error("Failed to update payment gateway:", error);
        next(error);
    }
};


// Shipping Controllers
export const getShippingZones = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const zones = await prisma.shippingZone.findMany({ include: { rates: true } });
        res.json(zones);
    } catch (error) { next(error); }
};
export const createShippingZone = async (req: Request, res: Response, next: NextFunction) => {
    const { rates, ...zoneData } = req.body;
    try {
        const data: any = { ...zoneData };
        if (rates && Array.isArray(rates) && rates.length > 0) {
            data.rates = {
                create: rates.map((rate: any) => ({
                    name: rate.name,
                    price: rate.price,
                    condition: rate.condition,
                    conditionValue: rate.conditionValue
                }))
            };
        }
        const zone = await prisma.shippingZone.create({ data });
        res.status(201).json(zone);
    } catch (error) { next(error); }
};
export const updateShippingZone = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const zone = await prisma.shippingZone.update({ where: { id: req.params.id }, data: req.body });
        res.json(zone);
    } catch (error) { next(error); }
};
export const deleteShippingZone = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await prisma.shippingZone.delete({ where: { id: req.params.id } });
        res.status(204).send();
    } catch (error) { next(error); }
};
export const getShippingProviders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const providers = await prisma.shippingProvider.findMany();
        res.json(providers);
    } catch (error) { next(error); }
};
export const updateShippingProvider = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const provider = await prisma.shippingProvider.update({ where: { id: req.params.id }, data: req.body });
        res.json(provider);
    } catch (error) { next(error); }
};

// Site Settings
export const getSiteSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const settings = await prisma.siteSettings.findFirst({ where: { singleton: 'global_settings' } });
        res.json(settings);
    } catch (error) { next(error); }
};

export const updateSiteSettings = async (req: Request, res: Response, next: NextFunction) => {
    const { id, ...settingsData } = req.body;
    try {
        const settings = await prisma.siteSettings.upsert({
            where: { singleton: 'global_settings' },
            update: settingsData,
            create: { ...settingsData, singleton: 'global_settings' }
        });
        await logAdminAction(req, 'Updated site settings');
        res.json(settings);
    } catch (error) {
        next(error);
    }
};

// Admin Dashboard
export const getDashboardData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const getCustomerDataPromise = prisma.user.findMany({
            where: { role: 'USER' },
            orderBy: { joinDate: 'desc' },
            include: {
                _count: { select: { orders: true }},
                orders: {
                    select: { totalAmount: true, orderDate: true },
                    orderBy: { orderDate: 'desc' },
                }
            }
        });

        const [orders, customersData, coupons, adminUsers, mediaLibrary, marketingCampaigns, siteSettings, paymentGateways, variantAttributes] = await Promise.all([
            prisma.order.findMany({ 
                orderBy: { orderDate: 'desc' }, 
                include: { 
                    user: { select: { name: true }},
                    items: {
                        include: {
                            product: true,
                            variant: true,
                        },
                    },
                } 
            }),
            getCustomerDataPromise,
            prisma.coupon.findMany(),
            prisma.user.findMany({ where: { role: 'ADMIN' } }),
            prisma.mediaFile.findMany(),
            prisma.marketingCampaign.findMany(),
            prisma.siteSettings.findFirst(),
            prisma.paymentGateway.findMany(),
            prisma.variantAttribute.findMany(),
        ]);
        
        const customers = customersData.map(c => ({
            id: c.id,
            name: c.name,
            email: c.email,
            phone: c.phone,
            joinDate: c.joinDate,
            totalOrders: c._count.orders,
            totalSpent: c.orders.reduce((sum, order) => sum + order.totalAmount, 0),
            lastOrderDate: c.orders.length > 0 ? c.orders[0].orderDate : undefined,
            profilePictureUrl: c.profilePictureUrl,
            isBlocked: c.isBlocked,
        }));
        
        res.json({ allOrders: orders, allCustomers: customers, allCoupons: coupons, adminUsers, mediaLibrary, marketingCampaigns, siteSettings, paymentGateways, variantAttributes });
    } catch (error) {
        next(error);
    }
};

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const [totalSalesData, newOrders, totalCustomers, lowStockItems, recentOrders, topProductsData] = await prisma.$transaction([
            prisma.order.aggregate({ _sum: { totalAmount: true } }),
            prisma.order.count({ where: { status: 'Processing' } }),
            prisma.user.count({ where: { role: 'USER' } }),
            prisma.productVariant.count({ where: { stockQuantity: { lt: 10 } } }),
            prisma.order.findMany({
                take: 5,
                orderBy: { orderDate: 'desc' },
            }),
            prisma.orderItem.groupBy({
                by: ['productId'],
                _sum: {
                    quantity: true,
                },
                orderBy: {
                    _sum: {
                        quantity: 'desc',
                    },
                },
                take: 5,
            }),
        ]);

        const topProductIds = topProductsData.map(p => p.productId);
        const topProductsDetails = await prisma.product.findMany({
            where: {
                id: { in: topProductIds }
            },
            select: {
                id: true,
                name: true,
                imageUrl: true,
            }
        });

        const topSellingProducts = topProductsData.map(p => {
            const details = topProductsDetails.find(pd => pd.id === p.productId);
            return {
                ...details,
                totalSold: p._sum.quantity || 0,
            };
        }).sort((a, b) => (b.totalSold || 0) - (a.totalSold || 0));


        const stats = {
            totalSales: totalSalesData._sum.totalAmount || 0,
            newOrders: newOrders || 0,
            totalCustomers: totalCustomers || 0,
            lowStockItems: lowStockItems || 0,
            recentOrders: recentOrders || [],
            topSellingProducts: topSellingProducts || [],
        };

        res.json(stats);
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        next(error);
    }
};

// Analytics
export const getWishlistAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allUsers = await prisma.user.findMany({
            select: { wishlistProductIds: true }
        });
        const wishlistCounts: Record<string, number> = {};
        allUsers.forEach(user => {
            user.wishlistProductIds.forEach(productId => {
                wishlistCounts[productId] = (wishlistCounts[productId] || 0) + 1;
            });
        });
        const productIds = Object.keys(wishlistCounts);
        const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
        const analytics = products.map(product => ({
            product,
            count: wishlistCounts[product.id]
        })).sort((a, b) => b.count - a.count);

        res.json(analytics);
    } catch (error) {
        next(error);
    }
};

// Notifications Controller
export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const unreadTickets = await prisma.supportTicket.findMany({
            where: { seenByAdmin: false },
            orderBy: { lastUpdated: 'desc' },
            take: 5
        });

        const notifications = unreadTickets.map(ticket => ({
            id: `ticket_${ticket.id}`,
            title: 'New Support Message',
            message: `New message in ticket #${ticket.id.slice(-6)}: "${ticket.subject}"`,
            type: 'support' as const,
            seen: false,
            timestamp: ticket.lastUpdated.toISOString(),
            link: {
                page: 'adminDashboard' as const,
                data: { section: 'support_tickets' }
            }
        }));

        res.json(notifications);
    } catch (error) {
        next(error);
    }
};

// Integrations
const DEFAULT_INTEGRATIONS = [
    { name: 'Facebook Pixel', category: 'Marketing', enabled: false, settings: {} },
    { name: 'Razorpay', category: 'Payments', enabled: false, settings: {} },
    { name: 'Shiprocket', category: 'Shipping', enabled: false, settings: {} },
    { name: 'Mailchimp', category: 'Marketing', enabled: false, settings: {} }
];

export const getIntegrations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Use upsert to be idempotent: create if not exists, do nothing if it does.
        for (const defaultInteg of DEFAULT_INTEGRATIONS) {
            await prisma.integration.upsert({
                where: { name: defaultInteg.name },
                update: {}, // Do nothing if it already exists
                create: defaultInteg,
            });
        }

        const integrations = await prisma.integration.findMany();
        res.json(integrations);
    } catch (error) {
        next(error);
    }
};

export const updateIntegration = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const dataToUpdate = { ...req.body };
    delete dataToUpdate.id;

    try {
        const integration = await prisma.integration.update({
            where: { id },
            data: dataToUpdate,
        });
        await logAdminAction(req, 'Updated integration', `Name: ${integration.name}`);
        res.json(integration);
    } catch (error) {
        next(error);
    }
};