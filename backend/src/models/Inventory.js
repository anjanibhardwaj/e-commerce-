import mongoose from 'mongoose';

const InventorySchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true, index: true },
    sku: { type: String, required: true, uppercase: true },
    batchNumber: { type: String, required: true, uppercase: true },
    expiryDate: { type: Date, required: true, index: true },
    availableQty: { type: Number, required: true, min: 0 },
    reservedQty: { type: Number, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 15 },
    version: { type: Number, default: 0 }
  },
  { timestamps: true }
);

InventorySchema.index({ productId: 1, sellerId: 1, batchNumber: 1 }, { unique: true });

export default mongoose.model('Inventory', InventorySchema);
