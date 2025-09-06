
import express, { RequestHandler } from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { 
    getDashboardData, 
    updateProfile, 
    changePassword,
    getAddresses, 
    addAddress, 
    updateAddress, 
    deleteAddress, 
    getUserOrders, 
    validateCoupon, 
    toggleWishlist, 
    addRecentlyViewed,
    getSupportTickets,
    createSupportTicket,
    addMessageToTicket,
    getUserChatSession,
    sendUserMessage,
    getChatMessagesForUser,
    uploadChatAttachment,
    getTicketById,
} from '../controllers/user.controller';
import upload from '../services/cloudinary';

const router = express.Router();

// All routes in this file are protected
router.use(isAuthenticated as RequestHandler);

// New Dashboard Route to get all data at once
router.get('/dashboard-data', getDashboardData as RequestHandler);

// Profile
router.put('/profile', updateProfile as RequestHandler);
router.put('/change-password', changePassword as RequestHandler);

// Addresses
router.get('/addresses', getAddresses as RequestHandler);
router.post('/addresses', addAddress as RequestHandler);
router.put('/addresses/:id', updateAddress as RequestHandler);
router.delete('/addresses/:id', deleteAddress as RequestHandler);

// Orders
router.get('/orders', getUserOrders as RequestHandler);

// Wishlist & Recently Viewed
router.post('/wishlist/toggle', toggleWishlist as RequestHandler);
router.post('/recently-viewed', addRecentlyViewed as RequestHandler);

// Coupons
router.post('/coupons/validate', validateCoupon as RequestHandler);

// Support
router.get('/support-tickets', getSupportTickets as RequestHandler);
router.post('/support-tickets', createSupportTicket as RequestHandler);
router.put('/support-tickets/:id/message', addMessageToTicket as RequestHandler);
router.get('/support-tickets/:id', getTicketById as RequestHandler);

// Live Chat
router.get('/chat/session', getUserChatSession as RequestHandler);
router.get('/chat/messages', getChatMessagesForUser as RequestHandler);
router.post('/chat/messages', sendUserMessage as RequestHandler);
router.post('/chat/upload', upload.single('file'), uploadChatAttachment as RequestHandler);


export default router;