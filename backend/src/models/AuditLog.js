import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema(
  {
    entityType: { type: String, required: true, uppercase: true, index: true }, // PRESCRIPTION, SELLER, PRODUCT, ORDER, INVENTORY
    entityId: { type: String, required: true, index: true },
    action: { type: String, required: true, uppercase: true }, // APPROVED, REJECTED, STOCK_CHANGED, STATUS_UPDATED
    actorId: { type: String, default: 'SYSTEM' },
    actorRole: { type: String, default: 'SYSTEM' },
    actorEmail: { type: String, default: null },
    ipAddress: { type: String, default: null },
    details: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

AuditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });

export default mongoose.model('AuditLog', AuditLogSchema);
