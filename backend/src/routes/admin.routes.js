import express from 'express';
import {
  getAdminDashboard,
  getSellers,
  reviewSeller,
  reviewProduct,
  getAllOrders,
  getAuditLogs
} from '../controllers/admin.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireRole('admin'));

router.get('/dashboard', getAdminDashboard);
router.get('/sellers', getSellers);
router.put('/sellers/:id/review', reviewSeller);
router.put('/products/:id/review', reviewProduct);
router.get('/orders', getAllOrders);
router.get('/audit-logs', getAuditLogs);

export default router;
