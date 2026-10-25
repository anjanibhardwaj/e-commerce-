import express from 'express';
import { registerCustomer, login, getMe, refreshAccessToken } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

router.post('/register', authRateLimiter, registerCustomer);
router.post('/login', authRateLimiter, login);
router.post('/refresh', refreshAccessToken);
router.get('/me', requireAuth, getMe);

export default router;
