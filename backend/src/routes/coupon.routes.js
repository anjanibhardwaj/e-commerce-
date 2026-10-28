import express from 'express';
import { getCoupons, verifyCoupon } from '../controllers/coupon.controller.js';

const router = express.Router();

router.get('/', getCoupons);
router.post('/verify', verifyCoupon);

export default router;
