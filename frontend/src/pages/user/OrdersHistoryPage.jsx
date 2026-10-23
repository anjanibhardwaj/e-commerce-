import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  FileText, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  ShieldCheck,
  Store
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

export default function OrdersHistoryPage() {
  const { user } = useAuth();
  const { orders } = useData();

  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Filter user's orders
  const userOrders = orders.filter(
    (o) => o.userId === user?.id || o.userEmail === user?.email
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'placed':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Placed</span>;
      case 'verified':
        return <span className="bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Rx Verified</span>;
      case 'packed':
        return <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Packed by Pharmacy</span>;
      case 'dispatched':
        return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Dispatched</span>;
      case 'delivered':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Delivered</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold">{status}</span>;
    }
  };

  const steps = [
    { key: 'placed', label: 'Order Placed' },
    { key: 'verified', label: 'Rx Verified' },
    { key: 'packed', label: 'Packed' },
    { key: 'dispatched', label: 'Dispatched' },
    { key: 'delivered', label: 'Delivered' }
  ];

  const getStepProgress = (status) => {
    const idx = steps.findIndex((s) => s.key === status);
    return idx === -1 ? 0 : idx;
  };

  if (userOrders.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-3">
        <Package className="w-12 h-12 text-gray-400 mx-auto" />
        <h3 className="text-base font-bold text-gray-800">No Past Orders Found</h3>
        <p className="text-xs text-gray-500">You haven't placed any medicine orders yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
        <h2 className="text-base font-extrabold text-gray-900">My Medicine Orders &amp; Real-Time Tracking</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Track fulfillment progress from the dispensing pharmacy to doorstep delivery
        </p>
      </div>

      <div className="space-y-4">
        {userOrders.map((order) => {
          const isExpanded = expandedOrderId === order.id;
          const currentStep = getStepProgress(order.status);

          return (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs hover:border-teal-300 transition"
            >
              {/* Header Card */}
              <div className="p-5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-slate-50/50">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-black text-gray-900">
                      Order #{order.id}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Placed on: {formatDateTime(order.createdAt)}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block font-semibold">Total Paid</span>
                    <span className="text-sm font-black text-gray-900">{formatCurrency(order.totalAmount)}</span>
                  </div>

                  <button
                    onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                    className="p-1.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600 cursor-pointer"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Real-time Visual Tracking Progress Bar */}
              <div className="p-5 border-b border-gray-100">
                <div className="text-xs font-bold text-gray-800 mb-3 flex items-center justify-between">
                  <span className="flex items-center">
                    <Truck className="w-4 h-4 mr-1.5 text-teal-700" />
                    Delivery Timeline
                  </span>
                  {order.courierPartner && (
                    <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded">
                      Courier: {order.courierPartner} (AWB: {order.trackingNumber})
                    </span>
                  )}
                </div>

                <div className="relative flex items-center justify-between">
                  <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-200 -translate-y-1/2 z-0">
                    <div
                      className="h-full bg-teal-600 transition-all duration-500"
                      style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    />
                  </div>

                  {steps.map((st, i) => {
                    const isDone = i <= currentStep;
                    const isCurrent = i === currentStep;
                    return (
                      <div key={st.key} className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                            isDone
                              ? 'bg-teal-700 text-white shadow-xs'
                              : 'bg-white border-2 border-gray-300 text-gray-400'
                          } ${isCurrent ? 'ring-4 ring-teal-100' : ''}`}
                        >
                          {isDone ? '✓' : i + 1}
                        </div>
                        <span className={`text-[10px] mt-1.5 font-bold ${isCurrent ? 'text-teal-900' : 'text-gray-500'}`}>
                          {st.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items Summary (always visible or expanded) */}
              <div className="p-5 space-y-3">
                <div className="text-xs font-bold text-gray-700">Order Items:</div>
                <div className="divide-y divide-gray-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-gray-800">{item.name}</span>
                        <span className="text-gray-400 ml-2">Qty: {item.quantity}</span>
                      </div>
                      <span className="font-bold text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {isExpanded && (
                  <div className="pt-3 border-t border-gray-100 text-xs text-gray-600 space-y-1.5 bg-gray-50 p-3 rounded-2xl">
                    <div><strong>Dispensing Pharmacy:</strong> {order.sellerName || 'Apollo Care Pharmacy'}</div>
                    <div><strong>Shipping To:</strong> {order.shippingAddress?.street}, {order.shippingAddress?.city}</div>
                    <div><strong>Payment Method:</strong> {order.paymentMethod}</div>
                    {order.prescriptionId && (
                      <div className="text-teal-700 font-bold flex items-center mt-1">
                        <FileText className="w-3.5 h-3.5 mr-1" />
                        Doctor prescription attached (Ref: {order.prescriptionId})
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
