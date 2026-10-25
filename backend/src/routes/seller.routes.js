import express from 'express';
import {
  getSellerDashboard,
  getSellerProducts,
  addSellerProduct,
  updateInventoryStock,
  getSellerOrders,
  acceptOrder,
  rejectOrder,
  packOrder,
  dispatchOrder,
  deliverOrder
} from '../controllers/seller.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireRole('seller'));

router.get('/dashboard', getSellerDashboard);
router.get('/products', getSellerProducts);
router.post('/products/add', addSellerProduct);
router.put('/inventory/:productId', updateInventoryStock);
router.get('/orders', getSellerOrders);
router.post('/orders/:id/accept', acceptOrder);
router.post('/orders/:id/reject', rejectOrder);
router.post('/orders/:id/pack', packOrder);
router.post('/orders/:id/dispatch', dispatchOrder);
router.post('/orders/:id/deliver', deliverOrder);

export default router;
