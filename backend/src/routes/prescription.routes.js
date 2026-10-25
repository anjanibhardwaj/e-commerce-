import express from 'express';
import {
  uploadPrescription,
  getMyPrescriptions,
  previewPrescription,
  reviewPrescription
} from '../controllers/prescription.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { uploadPrescriptionFile } from '../middleware/upload.js';

const router = express.Router();

// Preview link uses signed HMAC query tokens so images can be loaded securely in browser
router.get('/preview/:fileKey', previewPrescription);

// Protected routes
router.use(requireAuth);

router.post('/', uploadPrescriptionFile, uploadPrescription);
router.get('/my', getMyPrescriptions);
router.put('/:id/review', requireRole('admin', 'pharmacist'), reviewPrescription);

export default router;
