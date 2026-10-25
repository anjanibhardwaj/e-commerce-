import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    brand: { type: String, required: true, trim: true, index: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    categoryName: { type: String, required: true },
    manufacturer: { type: String, default: 'Certified Pharma Ltd' },
    composition: [{ type: String, trim: true }],
    prescriptionRequired: { type: Boolean, default: false, index: true },
    scheduleType: {
      type: String,
      enum: ['OTC', 'SCHEDULE_H', 'SCHEDULE_H1', 'SCHEDULE_X'],
      default: 'OTC'
    },
    images: [{ type: String, required: true }],
    description: { type: String, required: true },
    packSize: { type: String, default: 'Standard Pack' },
    dosage: { type: String, default: 'As directed by physician' },
    mrp: { type: Number, required: true, min: 0 }, // In Paise (e.g. ₹35 = 3500)
    sellingPrice: { type: Number, required: true, min: 0 }, // In Paise (e.g. ₹28 = 2800)
    discountPercent: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'DISCONTINUED'],
      default: 'ACTIVE',
      index: true
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
      index: true
    },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', index: true },
    sellerName: { type: String },
    tags: [{ type: String, index: true }],
    rating: { type: Number, default: 4.8 },
    reviewCount: { type: Number, default: 120 }
  },
  { timestamps: true }
);

ProductSchema.index({ name: 'text', brand: 'text', composition: 'text', tags: 'text' });
ProductSchema.index({ status: 1, categoryId: 1, sellingPrice: 1 });

export default mongoose.model('Product', ProductSchema);
