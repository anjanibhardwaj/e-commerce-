import express from 'express';
import { getProducts, getCategories, getProductById } from '../controllers/product.controller.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

export default router;
