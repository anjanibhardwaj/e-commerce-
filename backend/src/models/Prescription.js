import mongoose from 'mongoose';

const PrescriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
    fileKey: { type: String, required: true },
    mimeType: { type: String, required: true },
    fileSizeBytes: { type: Number, required: true },
    patientName: { type: String, default: null },
    patientAge: { type: Number, default: null },
    doctorName: { type: String, default: null },
    hospitalClinic: { type: String, default: null },
    status: {
      type: String,
      enum: ['PENDING_REVIEW', 'APPROVED', 'REJECTED', 'NEEDS_CLARIFICATION'],
      default: 'PENDING_REVIEW',
      index: true
    },
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewNotes: { type: String, default: null },
    reviewedAt: { type: Date, default: null },
    validUntil: { type: Date, required: true }
  },
  { timestamps: true }
);

PrescriptionSchema.index({ userId: 1, status: 1 });
PrescriptionSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Prescription', PrescriptionSchema);
