import express from 'express';
import { createOrder, getMyOrders, getOrderById, cancelOrder, trackOrder } from '../controllers/order.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Public track order endpoint (accessible by orderNumber or trackingNumber)
router.get('/track/:identifier', trackOrder);

// Authenticated customer endpoints
router.use(requireAuth);

router.post('/', createOrder);
router.get('/my', getMyOrders);
router.get('/:id', getOrderById);
router.post('/:id/cancel', cancelOrder);

export default router;
