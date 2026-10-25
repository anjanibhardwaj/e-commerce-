import express from 'express';
import { createPayment, verifyPayment, handleWebhook } from '../controllers/payment.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Webhook endpoint (unauthenticated - verified via HMAC signature header)
router.post('/webhook', handleWebhook);

// Protected endpoints
router.post('/create', requireAuth, createPayment);
router.post('/verify', requireAuth, verifyPayment);

export default router;
