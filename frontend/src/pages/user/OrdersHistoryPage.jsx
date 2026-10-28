import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import OrderTrackingModal from '../../components/OrderTrackingModal';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  FileText, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck,
  Store,
  Copy,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

export default function OrdersHistoryPage() {
  const { user } = useAuth();
  const { orders, showToast } = useData();

  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [selectedTrackingId, setSelectedTrackingId] = useState('');

  // Filter user's orders
  const userOrders = orders.filter((o) => {
    if (!user) return false;
    const uid = String(user.id || user._id || '');
    const oid = String(o.userId || '');
    if (uid && oid && uid === oid) return true;
    if (user.email && o.userEmail && user.email.toLowerCase() === o.userEmail.toLowerCase()) return true;
    if (user.name && o.userName && user.name.toLowerCase() === o.userName.toLowerCase()) return true;
    return false;
  });

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || '';
    switch (s) {
      case 'placed':
      case 'payment_pending':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Order Placed</span>;
      case 'awaiting_prescription_review':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Awaiting Rx Review</span>;
      case 'processing_pharmacy':
      case 'accepted':
      case 'verified':
        return <span className="bg-cyan-50 text-cyan-800 border border-cyan-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Pharmacy Accepted &amp; Dispensing</span>;
      case 'packed':
        return <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Packed by Pharmacy</span>;
      case 'dispatched':
        return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Dispatched (In Transit)</span>;
      case 'delivered':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Delivered</span>;
      case 'rejected':
      case 'cancelled':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Cancelled / Rejected</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold">{status}</span>;
    }
  };

  const steps = [
    { key: 'placed', label: 'Order Placed' },
    { key: 'accepted', label: 'Accepted by Pharmacy' },
    { key: 'packed', label: 'Packed & Sealed' },
    { key: 'dispatched', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' }
  ];

  const getStepProgress = (status) => {
    const s = status?.toLowerCase() || '';
    if (s === 'delivered') return 4;
    if (s === 'dispatched') return 3;
    if (s === 'packed') return 2;
    if (s === 'processing_pharmacy' || s === 'accepted' || s === 'verified') return 1;
    return 0;
  };

  if (userOrders.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-3">
        <Package className="w-12 h-12 text-gray-400 mx-auto" />
        <h3 className="text-base font-bold text-gray-800">No Orders Placed Yet</h3>
        <p className="text-xs text-gray-500">Your placed medicine orders will appear here with live tracking.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
        <h2 className="text-base font-extrabold text-gray-900">My Medicine Orders &amp; Live Tracking</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Flipkart-style order status updates from dispensing pharmacy to your doorstep ({userOrders.length} orders)
        </p>
      </div>

      <div className="space-y-4">
        {userOrders.map((order) => {
          const orderRefId = order.orderNumber || order.orderId || order.id;
          const isExpanded = expandedOrderId === order.id;
          const currentStep = getStepProgress(order.status);
          const isCancelled = order.status?.toLowerCase() === 'rejected' || order.status?.toLowerCase() === 'cancelled';

          return (
            <div
              key={order.id || order._id}
              className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs hover:border-teal-300 transition"
            >
              {/* Header Card */}
              <div className="p-5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-slate-50/50">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] text-gray-400 font-bold uppercase">Order ID:</span>
                    <span className="font-mono text-sm font-black text-teal-800">
                      #{orderRefId}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(orderRefId);
                        showToast('Order ID copied!');
                      }}
                      className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-700 cursor-pointer"
                      title="Copy Order ID"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="text-[11px] text-gray-400">
                    Placed on {formatDateTime(order.createdAt)} • Dispensed by{' '}
                    <strong className="text-gray-700">{order.sellerName || 'Apollo Care Pharmacy'}</strong>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setSelectedTrackingId(orderRefId);
                      setTrackingModalOpen(true);
                    }}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Track Order</span>
                  </button>

                  <button
                    onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                    className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-500 cursor-pointer"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* FLIPKART-STYLE STATUS TRACKER BAR */}
              <div className="p-6 border-b border-gray-100">
                {isCancelled ? (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-3 text-xs text-rose-800">
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <div>
                      <div className="font-bold">Order Cancelled / Rejected</div>
                      <div className="text-[11px] text-rose-600 mt-0.5">
                        {order.cancellationReason || 'Item unavailable at this pharmacy or prescription required.'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="flex items-center justify-between relative z-10">
                      {steps.map((st, idx) => {
                        const isDone = idx <= currentStep;
                        const isCurrent = idx === currentStep;

                        return (
                          <div key={st.key} className="flex flex-col items-center text-center flex-1">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                                isDone
                                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                                  : 'bg-gray-200 text-gray-500'
                              } ${isCurrent ? 'ring-4 ring-emerald-100 scale-110' : ''}`}
                            >
                              {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                            </div>
                            <span
                              className={`text-[10px] mt-2 font-bold max-w-[80px] leading-tight ${
                                isDone ? 'text-gray-900' : 'text-gray-400'
                              }`}
                            >
                              {st.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Progress Track Line */}
                    <div className="absolute top-4 left-8 right-8 h-1 bg-gray-200 -z-0">
                      <div
                        className="h-full bg-emerald-600 transition-all duration-500"
                        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Items & Summary Preview */}
              <div className="p-5 bg-white space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-700">
                    Items Ordered ({order.items?.length || 1}):
                  </span>
                  <span className="font-black text-gray-900 text-sm">
                    {formatCurrency(order.totalAmount || order.pricing?.grandTotal / 100 || 0)}
                  </span>
                </div>

                <div className="space-y-2">
                  {order.items?.map((it, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-gray-50 rounded-2xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-gray-900">{it.name}</div>
                        <div className="text-[10px] text-gray-500">
                          Qty: {it.quantity} • Unit Price: {formatCurrency(it.price || it.unitPrice / 100 || 0)}
                        </div>
                      </div>
                      <div className="font-black text-gray-900">
                        {formatCurrency((it.price || it.unitPrice / 100 || 0) * it.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                        Delivery Address
                      </span>
                      <div className="text-gray-700">
                        <div><strong>{order.shippingAddress?.fullName || order.userName}</strong></div>
                        <div>{order.shippingAddress?.street}</div>
                        <div>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</div>
                        <div>Phone: {order.shippingAddress?.phone}</div>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                        Payment &amp; Logistics
                      </span>
                      <div className="text-gray-700 space-y-0.5">
                        <div>Payment Mode: <strong>{order.paymentMethod || 'Cash on Delivery'}</strong></div>
                        <div>Payment Status: <strong>{order.paymentStatus || 'Pending'}</strong></div>
                        {order.courierPartner && (
                          <div>Courier Partner: <strong>{order.courierPartner}</strong></div>
                        )}
                        {order.trackingNumber && (
                          <div>AWB Tracking: <strong className="font-mono text-teal-700">{order.trackingNumber}</strong></div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <OrderTrackingModal
        isOpen={trackingModalOpen}
        onClose={() => setTrackingModalOpen(false)}
        initialOrderNumber={selectedTrackingId}
      />
    </div>
  );
}
