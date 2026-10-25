import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MapPin, 
  ShieldCheck,
  Building2,
  Calendar
} from 'lucide-react';
import apiClient from '../services/apiClient';
import { formatCurrency, formatDateTime } from '../utils/formatters';

export default function OrderTrackingModal({ isOpen, onClose, initialOrderNumber = '' }) {
  const [query, setQuery] = useState(initialOrderNumber);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trackingData, setTrackingData] = useState(null);

  React.useEffect(() => {
    if (initialOrderNumber) {
      setQuery(initialOrderNumber);
      handleTrack(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  if (!isOpen) return null;

  const handleTrack = async (searchId) => {
    const term = (searchId || query).trim();
    if (!term) return;

    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(`/orders/track/${encodeURIComponent(term)}`);
      if (res && res.success && res.data) {
        setTrackingData(res.data);
      } else {
        setError('No tracking information found for this ID.');
      }
    } catch (err) {
      setError(err.message || 'Order not found. Please verify your Order Number or Tracking AWB.');
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAYMENT_PENDING':
      case 'placed':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold">Placed</span>;
      case 'AWAITING_PRESCRIPTION_REVIEW':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold">Awaiting Rx Review</span>;
      case 'ORDER_CONFIRMED':
      case 'PRESCRIPTION_APPROVED':
      case 'verified':
        return <span className="bg-teal-50 text-teal-700 border border-teal-200 px-3 py-1 rounded-full text-xs font-bold">Rx Verified & Confirmed</span>;
      case 'PROCESSING_PHARMACY':
        return <span className="bg-cyan-50 text-cyan-800 border border-cyan-200 px-3 py-1 rounded-full text-xs font-bold">Dispensing at Pharmacy</span>;
      case 'PACKED':
      case 'packed':
        return <span className="bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold">Packed & Sealed</span>;
      case 'DISPATCHED':
      case 'dispatched':
        return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full text-xs font-bold">Dispatched</span>;
      case 'DELIVERED':
      case 'delivered':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">Delivered</span>;
      case 'REJECTED':
      case 'CANCELLED':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full text-xs font-bold">Rejected / Cancelled</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-teal-700 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xs">
              <Truck className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Live Order &amp; Delivery Tracking</h3>
              <p className="text-teal-200 text-xs mt-0.5">Real-time status direct from certified dispensing pharmacy</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleTrack(); }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Order # (e.g. PE-2026-978242) or AWB Tracking #..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white rounded-2xl text-xs font-bold transition flex items-center space-x-1.5"
            >
              {loading ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>Track</span>
            </button>
          </form>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-bold">Tracking Lookup Failed</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {!trackingData && !error && !loading && (
            <div className="text-center py-10 text-gray-400 space-y-2">
              <Package className="w-12 h-12 mx-auto stroke-1" />
              <p className="text-xs font-medium">Enter your Order Number or AWB above to view live milestones</p>
            </div>
          )}

          {trackingData && (
            <div className="space-y-6">
              {/* Order Info Card */}
              <div className="bg-teal-50/50 border border-teal-100 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm font-black text-gray-900">
                      Order #{trackingData.orderNumber}
                    </span>
                    {getStatusBadge(trackingData.status)}
                  </div>
                  <div className="flex items-center space-x-3 mt-1 text-[11px] text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-teal-600" />
                      <span>{formatDateTime(trackingData.createdAt)}</span>
                    </span>
                    <span>•</span>
                    <span className="font-bold text-gray-800">
                      Amount: {formatCurrency(trackingData.totalAmount)}
                    </span>
                    <span>•</span>
                    <span>Payment: {trackingData.paymentMethod}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Courier &amp; AWB</div>
                  <div className="font-bold text-xs text-gray-800">{trackingData.courierPartner}</div>
                  <div className="font-mono text-[11px] font-black text-teal-700">{trackingData.trackingNumber}</div>
                </div>
              </div>

              {/* Delivery Address */}
              {trackingData.shippingAddress && (
                <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-2xl flex items-start space-x-3 text-xs">
                  <MapPin className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-800">Delivery Destination: </span>
                    <span className="text-gray-600">
                      {trackingData.shippingAddress.fullName}, {trackingData.shippingAddress.line1}, {trackingData.shippingAddress.city}, {trackingData.shippingAddress.state} - {trackingData.shippingAddress.pincode} (Ph: {trackingData.shippingAddress.phone})
                    </span>
                  </div>
                </div>
              )}

              {/* Milestone Timeline */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Verified Tracking Timeline</span>
                </h4>

                <div className="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-200">
                  {trackingData.events?.map((evt, idx) => {
                    const isLatest = idx === trackingData.events.length - 1;
                    const isRejected = evt.status === 'REJECTED' || evt.status === 'CANCELLED';

                    return (
                      <div key={idx} className="relative group">
                        {/* Dot */}
                        <div 
                          className={`absolute -left-[19px] top-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                            isRejected 
                              ? 'bg-rose-600 ring-2 ring-rose-200' 
                              : isLatest 
                              ? 'bg-teal-600 ring-2 ring-teal-200' 
                              : 'bg-emerald-500'
                          }`}
                        >
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>

                        {/* Event Details */}
                        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-2xs hover:border-teal-200 transition">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-xs text-gray-800">{evt.status}</span>
                            <span className="text-[10px] text-gray-400 font-mono">
                              {evt.at ? formatDateTime(evt.at) : 'Logged'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{evt.note}</p>
                          {evt.actor && (
                            <div className="mt-1 text-[10px] text-gray-400 flex items-center space-x-1">
                              <span>Actor:</span>
                              <span className="font-medium text-gray-500">{evt.actor}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items */}
              {trackingData.items?.length > 0 && (
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
                    Medicines In Package ({trackingData.items.length})
                  </h4>
                  <div className="space-y-2">
                    {trackingData.items.map((it, idx) => (
                      <div key={idx} className="p-2.5 bg-gray-50 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-gray-800">{it.name}</div>
                          {it.batchNumber && (
                            <div className="text-[10px] text-teal-700 font-mono">Batch: {it.batchNumber}</div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-700">Qty: {it.quantity}</div>
                          <div className="text-[11px] text-gray-500">{formatCurrency(it.price * it.quantity)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
