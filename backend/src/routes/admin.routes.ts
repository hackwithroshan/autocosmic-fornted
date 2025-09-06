
import express, { Request, Response, RequestHandler } from 'express';
import { isAdmin, isAuthenticated } from '../middlewares/auth.middleware';
import * as contentController from '../controllers/admin/content.controller';
import prisma from '../prisma';
import { createProduct, deleteProduct, getAllCustomers, getAllOrders, updateOrderStatus, updateProduct, getCoupons, createCoupon, updateCoupon, deleteCoupon, getMediaLibrary, createCategory, updateCategory, deleteCategory, getCategories, createTestimonial, getTestimonials, updateTestimonial, deleteTestimonial, getDashboardData, getAdminChatSessions, getChatMessages, sendAdminMessage, getReviews, updateReview, deleteReview, getFaqs, createFaq, updateFaq, deleteFaq, updateStock, getWishlistAnalytics, toggleCustomerBlock, deleteMediaFile, getPaymentGateways, updatePaymentGateway, getVariantAttributes, createVariantAttribute, updateVariantAttribute, deleteVariantAttribute, getShippingZones, createShippingZone, updateShippingZone, deleteShippingZone, getShippingProviders, updateShippingProvider, getSiteSettings, updateSiteSettings, createAdminUser, updateAdminUser, deleteAdminUser, getDashboardStats, getNotifications, getIntegrations, updateIntegration, getTags, deleteTagFromAllProducts, updateSupportTicket, getTicketById, markTicketAsRead } from '../controllers/admin/admin.controller';

const router = express.Router();

// All routes in this file are protected and require admin privileges
router.use(isAuthenticated as RequestHandler, isAdmin as RequestHandler);

// Dashboard
router.get('/dashboard-stats', getDashboardStats as RequestHandler);
router.get('/dashboard-all', getDashboardData as RequestHandler);

// Notifications
router.get('/notifications', getNotifications as RequestHandler);
router.post('/notifications/mark-all-read', (async (req: Request, res: Response) => {
    // This is a mock implementation as notifications are not stored in the DB yet
    res.status(200).json({ message: 'All notifications marked as read (simulated).' });
}) as RequestHandler);


// Product Management
router.post('/products', createProduct as RequestHandler);
router.put('/products/:id', updateProduct as RequestHandler);
router.delete('/products/:id', deleteProduct as RequestHandler);
router.get('/products/all', (async (req: Request, res: Response) => {
    const products = await prisma.product.findMany({ include: { variants: true }, orderBy: {name: 'asc'} });
    res.json(products);
}) as RequestHandler);
router.put('/products/:id/status', (async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await prisma.product.update({ where: {id}, data: { publishStatus: status }, include: { variants: true }});
    res.json(updated);
}) as RequestHandler);

// Inventory Management
router.put('/inventory/stock', updateStock as RequestHandler);


// Order Management
router.get('/orders', getAllOrders as RequestHandler);
router.put('/orders/:id/status', updateOrderStatus as RequestHandler);

// Coupon Management
router.get('/coupons', getCoupons as RequestHandler);
router.post('/coupons', createCoupon as RequestHandler);
router.put('/coupons/:id', updateCoupon as RequestHandler);
router.delete('/coupons/:id', deleteCoupon as RequestHandler);

// Media Management
router.get('/media', getMediaLibrary as RequestHandler);
router.delete('/media/:id', deleteMediaFile as RequestHandler);


// Category Management
router.get('/categories', getCategories as RequestHandler);
router.post('/categories', createCategory as RequestHandler);
router.put('/categories/:id', updateCategory as RequestHandler);
router.delete('/categories/:id', deleteCategory as RequestHandler);

// Tag Management
router.get('/tags', getTags as RequestHandler);
router.delete('/tags/:tagName', deleteTagFromAllProducts as RequestHandler);

// Variant Attribute Management
router.get('/variant-attributes', getVariantAttributes as RequestHandler);
router.post('/variant-attributes', createVariantAttribute as RequestHandler);
router.put('/variant-attributes/:id', updateVariantAttribute as RequestHandler);
router.delete('/variant-attributes/:id', deleteVariantAttribute as RequestHandler);

// Testimonial Management (now part of generic CMS)
router.get('/testimonials', getTestimonials as RequestHandler);
router.post('/testimonials', createTestimonial as RequestHandler);
router.put('/testimonials/:id', updateTestimonial as RequestHandler);
router.delete('/testimonials/:id', deleteTestimonial as RequestHandler);

// Review Management
router.get('/reviews', getReviews as RequestHandler);
router.put('/reviews/:id', updateReview as RequestHandler);
router.delete('/reviews/:id', deleteReview as RequestHandler);

// FAQ Management
router.get('/faqs', getFaqs as RequestHandler);
router.post('/faqs', createFaq as RequestHandler);
router.put('/faqs/:id', updateFaq as RequestHandler);
router.delete('/faqs/:id', deleteFaq as RequestHandler);

// Customer Management
router.get('/customers', getAllCustomers as RequestHandler);
router.put('/customers/:id/toggle-block', toggleCustomerBlock as RequestHandler);

// User & Role Management
router.post('/users', createAdminUser as RequestHandler);
router.put('/users/:id', updateAdminUser as RequestHandler);
router.delete('/users/:id', deleteAdminUser as RequestHandler);

// Site Settings
router.get('/settings/site', getSiteSettings as RequestHandler);
router.put('/settings/site', updateSiteSettings as RequestHandler);

// Payment Gateways
router.get('/payments/gateways', getPaymentGateways as RequestHandler);
router.put('/payments/gateways/:id', updatePaymentGateway as RequestHandler);

// Shipping
router.get('/shipping/zones', getShippingZones as RequestHandler);
router.post('/shipping/zones', createShippingZone as RequestHandler);
router.put('/shipping/zones/:id', updateShippingZone as RequestHandler);
router.delete('/shipping/zones/:id', deleteShippingZone as RequestHandler);
router.get('/shipping/providers', getShippingProviders as RequestHandler);
router.put('/shipping/providers/:id', updateShippingProvider as RequestHandler);

// Support
router.put('/support-tickets/:id', updateSupportTicket as RequestHandler);
router.get('/support-tickets/:id', getTicketById as RequestHandler);
router.post('/support-tickets/:id/read', markTicketAsRead as RequestHandler);


// Analytics
router.get('/analytics/wishlist', getWishlistAnalytics as RequestHandler);

// Chat
router.get('/chats', getAdminChatSessions as RequestHandler);
router.get('/chats/:sessionId/messages', getChatMessages as RequestHandler);
router.post('/chats/:sessionId/messages', sendAdminMessage as RequestHandler);

// Integrations
router.get('/integrations', getIntegrations as RequestHandler);
router.put('/integrations/:id', updateIntegration as RequestHandler);

// Activity Logs
router.get('/logs', (async (req: Request, res: Response) => {
    const logs = await prisma.adminActivityLog.findMany({
        take: 50,
        orderBy: { timestamp: 'desc' }
    });
    res.json(logs);
}) as RequestHandler);


// --- Generic Content Routes ---
// Hero Slides
router.get('/content/hero-slides', contentController.getHeroSlides as RequestHandler);
router.post('/content/hero-slides', contentController.createHeroSlide as RequestHandler);
router.put('/content/hero-slides/:id', contentController.updateHeroSlide as RequestHandler);
router.delete('/content/hero-slides/:id', contentController.deleteHeroSlide as RequestHandler);

// Shoppable Videos
router.get('/content/shoppable-videos', contentController.getShoppableVideos as RequestHandler);
router.post('/content/shoppable-videos', contentController.createShoppableVideo as RequestHandler);
router.put('/content/shoppable-videos/:id', contentController.updateShoppableVideo as RequestHandler);
router.delete('/content/shoppable-videos/:id', contentController.deleteShoppableVideo as RequestHandler);

// Occasions
router.get('/content/occasions', contentController.getOccasions as RequestHandler);
router.post('/content/occasions', contentController.createOccasion as RequestHandler);
router.put('/content/occasions/:id', contentController.updateOccasion as RequestHandler);
router.delete('/content/occasions/:id', contentController.deleteOccasion as RequestHandler);

// Looks
router.get('/content/looks', contentController.getLooks as RequestHandler);
router.post('/content/looks', contentController.createLook as RequestHandler);
router.put('/content/looks/:id', contentController.updateLook as RequestHandler);
router.delete('/content/looks/:id', contentController.deleteLook as RequestHandler);

// Emotions
router.get('/content/emotions', contentController.getEmotions as RequestHandler);
router.post('/content/emotions', contentController.createEmotion as RequestHandler);
router.put('/content/emotions/:id', contentController.updateEmotion as RequestHandler);
router.delete('/content/emotions/:id', contentController.deleteEmotion as RequestHandler);

// CMS Pages
router.get('/content/cms-pages', contentController.getCmsPages as RequestHandler);
router.post('/content/cms-pages', contentController.createCmsPage as RequestHandler);
router.put('/content/cms-pages/:id', contentController.updateCmsPage as RequestHandler);
router.delete('/content/cms-pages/:id', contentController.deleteCmsPage as RequestHandler);

// Floating Info
router.get('/content/floating-info', contentController.getFloatingInfo as RequestHandler);
router.post('/content/floating-info', contentController.createFloatingInfo as RequestHandler);
router.put('/content/floating-info/:id', contentController.updateFloatingInfo as RequestHandler);
router.delete('/content/floating-info/:id', contentController.deleteFloatingInfo as RequestHandler);

// Fashion Gallery
router.get('/content/fashion-gallery', contentController.getFashionGalleryImages as RequestHandler);
router.post('/content/fashion-gallery', contentController.createFashionGalleryImage as RequestHandler);
router.put('/content/fashion-gallery/:id', contentController.updateFashionGalleryImage as RequestHandler);
router.delete('/content/fashion-gallery/:id', contentController.deleteFashionGalleryImage as RequestHandler);

// Guided Discovery
router.get('/content/guided-discovery', contentController.getGuidedDiscoveryPaths as RequestHandler);
router.post('/content/guided-discovery', contentController.createGuidedDiscoveryPath as RequestHandler);
router.put('/content/guided-discovery/:id', contentController.updateGuidedDiscoveryPath as RequestHandler);
router.delete('/content/guided-discovery/:id', contentController.deleteGuidedDiscoveryPath as RequestHandler);

// Homepage Layout (special case without :id)
router.get('/content/homepage-layout', contentController.getHomepageLayout as RequestHandler);
router.put('/content/homepage-layout', contentController.updateHomepageLayout as RequestHandler);

// Team Members
router.get('/content/team-members', contentController.getTeamMembers as RequestHandler);
router.post('/content/team-members', contentController.createTeamMember as RequestHandler);
router.put('/content/team-members/:id', contentController.updateTeamMember as RequestHandler);
router.delete('/content/team-members/:id', contentController.deleteTeamMember as RequestHandler);

// Stats Items
router.get('/content/stats-items', contentController.getStatItems as RequestHandler);
router.post('/content/stats-items', contentController.createStatItem as RequestHandler);
router.put('/content/stats-items/:id', contentController.updateStatItem as RequestHandler);
router.delete('/content/stats-items/:id', contentController.deleteStatItem as RequestHandler);

// Pricing Plans
router.get('/content/pricing-plans', contentController.getPricingPlans as RequestHandler);
router.post('/content/pricing-plans', contentController.createPricingPlan as RequestHandler);
router.put('/content/pricing-plans/:id', contentController.updatePricingPlan as RequestHandler);
router.delete('/content/pricing-plans/:id', contentController.deletePricingPlan as RequestHandler);


export default router;