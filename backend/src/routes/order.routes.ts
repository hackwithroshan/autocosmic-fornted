


import express, { RequestHandler } from 'express';
import { createRazorpayOrder, placeOrder } from '../controllers/order.controller';
import { attachUserIfAuthenticated } from '../middlewares/auth.middleware';

const router = express.Router();

// This route can be accessed by guests or authenticated users.
// The middleware will attach user data if a valid token is provided.
router.post('/payment/create', attachUserIfAuthenticated as RequestHandler, createRazorpayOrder as RequestHandler);

// Placing the final order can be done by guests or authenticated users.
// The controller will handle the logic based on presence of user data.
router.post('/', attachUserIfAuthenticated as RequestHandler, placeOrder as RequestHandler);

export default router;