


import express, { RequestHandler } from 'express';
import authRouter from './auth.routes';
import productRouter from './product.routes';
import orderRouter from './order.routes';
import mediaRouter from './media.routes';
import userRouter from './user.routes';
import cartRouter from './cart.routes';
import adminRouter from './admin.routes';
import { getSiteData, getPublicHomepageLayout } from '../controllers/content.controller';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/products', productRouter);
router.use('/orders', orderRouter);
router.use('/media', mediaRouter);
router.use('/user', userRouter);
router.use('/cart', cartRouter);
router.use('/admin', adminRouter);

// Public content route
router.get('/site-data', getSiteData as RequestHandler);
router.get('/content/homepage-layout', getPublicHomepageLayout as RequestHandler);


export default router;