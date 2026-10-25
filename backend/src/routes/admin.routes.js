import express from 'express';
import {
  getAdminDashboard,
  getSellers,
  reviewSeller,
  reviewProduct,
  getAllOrders,
  getAuditLogs,
  getAdminProducts,
  getAdminPrescriptions,
  deleteProduct
} from '../controllers/admin.controller.js';
import { reviewPrescription } from '../controllers/prescription.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireRole('admin'));

router.get('/dashboard', getAdminDashboard);
router.get('/sellers', getSellers);
router.put('/sellers/:id/review', reviewSeller);
router.get('/products', getAdminProducts);
router.put('/products/:id/review', reviewProduct);
router.delete('/products/:id', deleteProduct);
router.get('/orders', getAllOrders);
router.get('/prescriptions', getAdminPrescriptions);
router.put('/prescriptions/:id/review', reviewPrescription);
router.get('/audit-logs', getAuditLogs);

export default router;
