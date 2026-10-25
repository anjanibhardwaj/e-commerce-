import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, index: true },
    type: { type: String, enum: ['PERCENT', 'FLAT'], default: 'PERCENT' },
    value: { type: Number, required: true }, // e.g. 20 (for 20%) or 10000 (for ₹100 flat)
    maxDiscount: { type: Number, default: 10000 }, // In Paise (e.g. ₹100 = 10000)
    minOrderValue: { type: Number, default: 0 },   // In Paise (e.g. ₹499 = 49900)
    usageLimitPerUser: { type: Number, default: 1 },
    totalUsageLimit: { type: Number, default: 1000 },
    validFrom: { type: Date, default: Date.now },
    validUntil: { type: Date, required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('Coupon', CouponSchema);
