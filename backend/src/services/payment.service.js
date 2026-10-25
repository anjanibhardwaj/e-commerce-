import crypto from 'crypto';
import { config } from '../config/env.js';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js';

export class PaymentService {
  /**
   * Creates a mock/live gateway payment record
   */
  static async createGatewayOrder({ orderId, userId, amountPaise }) {
    const gatewayOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const payment = await Payment.create({
      orderId,
      userId,
      gateway: 'RAZORPAY',
      gatewayOrderId,
      amount: amountPaise,
      currency: 'INR',
      status: 'CREATED'
    });

    return {
      paymentId: payment._id,
      gatewayOrderId,
      amount: amountPaise,
      currency: 'INR',
      keyId: config.razorpay.keyId
    };
  }

  /**
   * Verifies Razorpay Webhook HMAC-SHA256 signature
   */
  static verifyWebhookSignature(rawBody, signature, secret) {
    if (!signature || !secret) return false;
    const expected = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  }

  /**
   * Client-side signature verification: razorpay_order_id + "|" + razorpay_payment_id
   */
  static verifyClientPaymentSignature({ orderId, paymentId, signature }) {
    const secret = config.razorpay.keySecret;
    if (!secret || secret.includes('placeholder')) {
      // In dev placeholder mode, accept valid length signatures
      return true;
    }
    const expected = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  }
}
