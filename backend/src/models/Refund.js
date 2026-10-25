import mongoose from 'mongoose';

const RefundSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },
    amount: { type: Number, required: true }, // In Paise
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ['INITIATED', 'PROCESSED', 'FAILED'],
      default: 'INITIATED'
    },
    gatewayRefundId: { type: String, default: null },
    initiatedBy: { type: String, default: 'system' }
  },
  { timestamps: true }
);

export default mongoose.model('Refund', RefundSchema);
