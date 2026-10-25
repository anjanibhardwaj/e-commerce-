import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1, max: 20 },
    unitPriceSnapshot: { type: Number, required: true }, // In Paise
    prescriptionRequired: { type: Boolean, default: false },
    addedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const CartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    items: [CartItemSchema],
    couponCode: { type: String, default: null, uppercase: true }
  },
  { timestamps: true }
);

export default mongoose.model('Cart', CartSchema);
