


import express, { RequestHandler } from 'express';
import { addItemToCart, getCart, removeItemFromCart, updateCartItem } from '../controllers/cart.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';

const router = express.Router();

// All cart routes are protected
router.use(isAuthenticated as RequestHandler);

router.get('/', getCart as RequestHandler);
router.post('/', addItemToCart as RequestHandler);
router.put('/:variantId', updateCartItem as RequestHandler);
router.delete('/:variantId', removeItemFromCart as RequestHandler);

export default router;