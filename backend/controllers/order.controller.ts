
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import prisma from '../prisma';
import { getRazorpayInstance } from '../services/razorpay.service';
import { AuthRequest } from '../middlewares/auth.middleware';

// FIX: Add explicit types for req, res, next
export const createRazorpayOrder = async (req: Request, res: Response, next: NextFunction) => {
    const { totalAmount, gatewayId } = req.body;

    if (typeof totalAmount !== 'number' || totalAmount < 1) { // Razorpay minimum is ₹1.00
        return res.status(400).json({ message: 'Invalid total amount. The minimum transaction value is ₹1.00.' });
    }
    if (!gatewayId) {
        return res.status(400).json({ message: 'Gateway ID is required.' });
    }

    try {
        const gatewaySettings = await prisma.paymentGateway.findUnique({
            where: {
                id: gatewayId,
                enabled: true,
            },
        });

        if (!gatewaySettings) {
            return res.status(503).json({ message: `Selected payment gateway is not enabled or configured.` });
        }

        const settings: any = gatewaySettings.settings;
        const keyId = settings?.apiKey;
        const keySecret = settings?.apiSecret;

        if (!keyId || !keySecret) {
            return res.status(503).json({ message: `API keys for '${gatewaySettings.name}' are not configured in the Admin Panel.` });
        }
        
        const razorpay = getRazorpayInstance(keyId, keySecret);

        if (!razorpay) {
            return res.status(500).json({ message: 'Failed to initialize payment service.' });
        }

        const options = {
            amount: Math.round(totalAmount * 100),
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        res.json({ orderId: order.id, keyId: keyId });
        
    } catch (error: any) {
        console.error("Razorpay order creation error:", error);
        
        const razorpayError = error.error; 

        if (razorpayError && razorpayError.description) {
            let userMessage = `Razorpay Error: ${razorpayError.description}`;
            if (razorpayError.description.includes('Authentication failed')) {
                userMessage = "Razorpay authentication failed. Please check your Key ID and Key Secret in the Admin Panel.";
            } else if (razorpayError.description.includes('does not seem to be a valid')) {
                userMessage = `Razorpay Error: Invalid API Key ID. Please verify your keys in the Admin Panel.`;
            }
            return res.status(error.statusCode || 400).json({ message: userMessage });
        }
        
        next(error);
    }
};

// FIX: Add explicit types for req, res, next
export const placeOrder = async (req: Request, res: Response, next: NextFunction) => {
    const { order: orderData, guestDetails, paymentDetails } = req.body;
    const userId = (req as AuthRequest).user?.id;

    if (!userId && !guestDetails?.email) {
        return res.status(401).json({ message: 'Authentication is required to place an order.' });
    }

    try {
        const paymentType = orderData.paymentType;
        if (paymentType === 'razorpay' || paymentType === 'phonepe') {
            if (!paymentDetails || !paymentDetails.razorpay_order_id || !paymentDetails.razorpay_payment_id || !paymentDetails.razorpay_signature) {
                return res.status(400).json({ message: 'Payment verification details are required for online payments.' });
            }

            const gatewayName = paymentType === 'phonepe' ? 'PhonePe' : 'Razorpay';
            const gateway = await prisma.paymentGateway.findFirst({ where: { name: gatewayName }});
            const keySecret = (gateway?.settings as any)?.apiSecret;
            if (!keySecret) {
                return res.status(500).json({ message: `${gatewayName} secret key not configured.` });
            }

            const body = paymentDetails.razorpay_order_id + "|" + paymentDetails.razorpay_payment_id;
            const expectedSignature = crypto
                .createHmac('sha256', keySecret)
                .update(body.toString())
                .digest('hex');
            
            if (expectedSignature !== paymentDetails.razorpay_signature) {
                return res.status(400).json({ message: 'Invalid payment signature. Transaction failed.' });
            }
            
            orderData.transactionId = paymentDetails.razorpay_payment_id;
            orderData.paymentStatus = 'Success';
        }


        // FIX: Correctly map from the frontend's OrderItem structure (which contains nested product/variant objects)
        // to the structure Prisma expects for a nested create.
        const orderItems = orderData.items.map((item: any) => ({
            productId: item.product.id,
            variantId: item.variant.id,
            quantity: item.quantity,
            priceAtPurchase: item.priceAtPurchase,
            variantSnapshot: item.variant.attributes,
        }));
        
        const newOrder = await prisma.order.create({
            data: {
                totalAmount: orderData.totalAmount,
                status: 'Processing',
                shippingAddress: orderData.shippingAddress,
                paymentType: orderData.paymentType,
                deliveryType: orderData.deliveryType,
                deliveryCharge: orderData.deliveryCharge,
                appliedCouponCode: orderData.appliedCouponCode,
                discountAmount: orderData.discountAmount,
                userId: userId,
                customerName: orderData.customerName,
                paymentStatus: orderData.paymentType === 'cod' ? 'Pending' : 'Success',
                items: {
                    create: orderItems,
                },
                transactionId: orderData.transactionId,
            },
        });
        
        // FIX: Correctly access the nested product name for the activity log.
        const firstItemName = orderData.items[0]?.product.name || 'an item';
        await prisma.activityLog.create({
            data: {
                message: `Someone in ${orderData.shippingAddress.city} just purchased a "${firstItemName}".`
            }
        });
        
        res.status(201).json({ success: true, order: newOrder });

    } catch (error) {
        next(error);
    }
};
