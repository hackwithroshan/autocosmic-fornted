
import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';

// FIX: Add explicit types for req, res, next
export const getPublicHomepageLayout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const layoutDoc = await prisma.homepageLayout.findUnique({
            where: { name: 'default' }
        });
        if (layoutDoc) {
            res.json(layoutDoc.layout);
        } else {
            // If no layout is in the DB, send null so frontend uses its default
            res.json(null);
        }
    } catch (error) {
        next(error);
    }
};

// FIX: Add explicit types for req, res, next
export const getSiteData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const [
            products, 
            categories,
            heroSlides,
            occasions,
            looks,
            emotions,
            shoppableVideos,
            testimonials,
            activityFeed,
            floatingInfo,
            fashionGalleryImages,
            blogPosts,
            guidedDiscoveryPaths,
            siteSettings,
            faqs,
            paymentGateways,
            homepageLayoutDoc,
            teamMembers,
            stats,
            pricingPlans
        ] = await Promise.all([
            prisma.product.findMany({ 
                where: { publishStatus: 'Published' },
                include: { variants: true }
            }),
            prisma.category.findMany({ include: { subCategories: true } }),
            prisma.heroSlide.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
            prisma.occasionContent.findMany(),
            prisma.curatedLook.findMany(),
            prisma.emotionCategory.findMany(),
            prisma.shoppableVideo.findMany(),
            prisma.testimonial.findMany({ where: { approved: true } }),
            prisma.activityLog.findMany({ orderBy: { timestamp: 'desc' }, take: 10 }),
            prisma.floatingInfo.findMany(),
            prisma.fashionGalleryImage.findMany({ where: { isActive: true }, orderBy: { order: 'asc' }}),
            // FIX: Added missing comma in 'where' clause.
            prisma.cmsPage.findMany({ where: { status: 'Published', type: 'post' } }),
            prisma.guidedDiscoveryPath.findMany(),
            prisma.siteSettings.findFirst({ where: { singleton: 'global_settings' }}),
            prisma.faq.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
            prisma.paymentGateway.findMany({where: { enabled: true }}),
            prisma.homepageLayout.findUnique({ where: { name: 'default' } }),
            prisma.teamMember.findMany({ orderBy: { order: 'asc' } }),
            prisma.statItem.findMany({ orderBy: { order: 'asc' } }),
            prisma.pricingPlan.findMany({ orderBy: { order: 'asc' } })
        ]);

        res.json({
            products,
            categories,
            heroSlides,
            occasions,
            looks,
            emotions,
            shoppableVideos,
            testimonials,
            activityFeed,
            floatingInfo,
            fashionGalleryImages: fashionGalleryImages.map(img => img.imageUrl),
            cmsPages: blogPosts,
            guidedDiscoveryPaths,
            siteSettings,
            faqs,
            paymentGateways,
            homepageLayout: homepageLayoutDoc?.layout,
            teamMembers,
            stats,
            pricingPlans,
            // Extract grid/category items from siteSettings if they exist
            categoryGridItems: (siteSettings?.categoryGridItems as any) || [],
            promoGridItems: (siteSettings?.promoGridItems as any) || [],
            topCategories: (siteSettings?.topCategories as any) || [],
        });
    } catch (error) {
        next(error);
    }
};
