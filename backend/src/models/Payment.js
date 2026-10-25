import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    gateway: { type: String, enum: ['RAZORPAY', 'COD_VERIFIED'], default: 'RAZORPAY' },
    gatewayOrderId: { type: String, required: true, unique: true, index: true },
    gatewayPaymentId: { type: String, default: null, index: true },
    amount: { type: Number, required: true }, // In Paise
    currency: { type: String, default: 'INR' },
    method: { type: String, default: null }, // UPI, card, netbanking
    status: {
      type: String,
      enum: ['CREATED', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED'],
      default: 'CREATED'
    },
    signatureVerified: { type: Boolean, default: false },
    webhookEventId: { type: String, default: null, index: true }
  },
  { timestamps: true }
);

export default mongoose.model('Payment', PaymentSchema);
