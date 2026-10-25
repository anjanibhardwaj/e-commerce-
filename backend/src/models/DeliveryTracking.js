import mongoose from 'mongoose';

const TrackingEventSchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    location: { type: String, default: null },
    note: { type: String, default: null },
    actor: { type: String, default: 'system' },
    at: { type: Date, default: Date.now }
  },
  { _id: false }
);

const DeliveryTrackingSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true, index: true },
    currentStatus: { type: String, required: true },
    carrier: { type: String, default: null },
    awbNumber: { type: String, default: null, index: true },
    estimatedDelivery: { type: Date, default: null },
    events: [TrackingEventSchema]
  },
  { timestamps: true }
);

export default mongoose.model('DeliveryTracking', DeliveryTrackingSchema);
