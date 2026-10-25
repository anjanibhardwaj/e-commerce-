import express from 'express';
import { getCart, addItem, updateItemQuantity, removeItem } from '../controllers/cart.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', getCart);
router.post('/items', addItem);
router.put('/items/:productId', updateItemQuantity);
router.delete('/items/:productId', removeItem);

export default router;
