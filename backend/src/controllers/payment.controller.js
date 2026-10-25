import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import { PaymentService } from '../services/payment.service.js';
import { config } from '../config/env.js';

export const createPayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found.' } });
    }

    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Unauthorized.' } });
    }

    const gatewayData = await PaymentService.createGatewayOrder({
      orderId: order._id,
      userId: req.user.id,
      amountPaise: order.pricing.grandTotal
    });

    return res.status(200).json({ success: true, data: gatewayData });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const isValid = PaymentService.verifyClientPaymentSignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_SIGNATURE', message: 'Gateway payment signature verification failed.' }
      });
    }

    const payment = await Payment.findOneAndUpdate(
      { gatewayOrderId: razorpayOrderId },
      {
        gatewayPaymentId: razorpayPaymentId,
        status: 'CAPTURED',
        signatureVerified: true
      },
      { new: true }
    );

    if (payment) {
      const order = await Order.findById(payment.orderId);
      if (order) {
        order.paymentStatus = 'COMPLETED';
        const hasRx = order.items.some((i) => i.prescriptionRequired);
        order.status = hasRx ? 'AWAITING_PRESCRIPTION_REVIEW' : 'ORDER_CONFIRMED';
        await order.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified and order confirmed successfully.'
    });
  } catch (error) {
    next(error);
  }
};

export const handleWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const secret = config.razorpay.webhookSecret;

    // In production, enforce raw body HMAC check
    if (config.nodeEnv === 'production') {
      const isValid = PaymentService.verifyWebhookSignature(req.rawBody, signature, secret);
      if (!isValid) {
        return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
      }
    }

    const event = req.body;
    if (event?.event === 'payment.captured') {
      await PaymentService.handlePaymentCaptured(event);
    }

    return res.status(200).json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    next(error);
  }
};
