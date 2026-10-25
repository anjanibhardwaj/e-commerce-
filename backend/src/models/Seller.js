import mongoose from 'mongoose';

const SellerSchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    phone: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    licenseNumber: { type: String, required: true, unique: true, uppercase: true, index: true },
    gstin: { type: String, uppercase: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending',
      index: true
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvalDate: { type: Date },
    rating: { type: Number, default: 5.0 }
  },
  { timestamps: true }
);

export default mongoose.model('Seller', SellerSchema);
