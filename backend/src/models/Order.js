import mongoose from 'mongoose';

const OrderItemSnapshotSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
    inventoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
    name: { type: String, required: true },
    sku: { type: String },
    batchNumber: { type: String },
    expiryDate: { type: Date },
    unitPrice: { type: Number, required: true }, // In Paise (e.g. ₹28 = 2800)
    quantity: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true }, // unitPrice * quantity
    prescriptionRequired: { type: Boolean, default: false }
  },
  { _id: true }
);

const AddressSnapshotSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    landmark: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'IN' }
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userPhone: { type: String },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', index: true },
    sellerName: { type: String },
    idempotencyKey: { type: String, required: true, unique: true, index: true },
    status: {
      type: String,
      enum: [
        'PAYMENT_PENDING',
        'PAYMENT_CONFIRMED',
        'ORDER_CONFIRMED',
        'AWAITING_PRESCRIPTION_REVIEW',
        'PRESCRIPTION_APPROVED',
        'PROCESSING_PHARMACY',
        'PACKED',
        'DISPATCHED',
        'OUT_FOR_DELIVERY',
        'DELIVERED',
        'CANCELLED',
        'REJECTED',
        'REFUNDED'
      ],
      default: 'PAYMENT_PENDING',
      index: true
    },
    items: [OrderItemSnapshotSchema],
    pricing: {
      itemsTotal: { type: Number, required: true }, // In Paise
      discount: { type: Number, default: 0 },       // In Paise
      deliveryFee: { type: Number, default: 0 },    // In Paise
      taxTotal: { type: Number, default: 0 },       // In Paise
      grandTotal: { type: Number, required: true }, // In Paise
      currency: { type: String, default: 'INR' }
    },
    addressSnapshot: AddressSnapshotSchema,
    prescriptionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' }],
    couponId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', default: null },
    paymentMethod: { type: String, enum: ['ONLINE', 'COD'], required: true },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
      default: 'PENDING'
    },
    courierPartner: { type: String, default: null },
    trackingNumber: { type: String, default: null },
    cancellationReason: { type: String, default: null },
    cancelledBy: { type: String, default: null }
  },
  { timestamps: true }
);

OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Order', OrderSchema);
