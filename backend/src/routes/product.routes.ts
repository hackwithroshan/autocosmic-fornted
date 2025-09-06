


import express, { RequestHandler } from 'express';
import { getProducts, getProductBySlug } from '../controllers/product.controller';

const router = express.Router();

router.get('/', getProducts as RequestHandler);
router.get('/:slug', getProductBySlug as RequestHandler);

export default router;