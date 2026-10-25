import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    label: { type: String, default: 'Home' }, // Home, Office, Other
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    line1: { type: String, required: true, trim: true },
    line2: { type: String, trim: true },
    landmark: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    country: { type: String, default: 'IN' },
    isDefault: { type: Boolean, default: false }
  },
  { timestamps: true }
);

AddressSchema.index({ userId: 1, isDefault: 1 });

export default mongoose.model('Address', AddressSchema);
