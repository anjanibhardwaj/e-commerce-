import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import OrderTrackingModal from '../../components/OrderTrackingModal';
import { 
  ClipboardList, 
  Search, 
  FileText, 
  MapPin, 
  Truck, 
  Filter,
  CheckCircle,
  XCircle,
  Package,
  Send,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

export default function AdminOrdersPage() {
  const { orders, acceptOrder, rejectOrder, packOrder, dispatchOrder, deliverOrder, updateOrderStatus, showToast } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [selectedTrackingId, setSelectedTrackingId] = useState('');

  // Dispatch modal
  const [dispatchOrderObj, setDispatchOrderObj] = useState(null);
  const [trackingAwb, setTrackingAwb] = useState('');
  const [courierName, setCourierName] = useState('BlueDart Pharma Express');

  // Reject modal
  const [rejectOrderObj, setRejectOrderObj] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('Prescription invalid or out of stock');

  const filtered = orders.filter((o) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match =
        (o.id || o._id || o.orderNumber)?.toLowerCase().includes(q) ||
        o.userName?.toLowerCase().includes(q) ||
        o.customerName?.toLowerCase().includes(q) ||
        o.sellerName?.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filterStatus !== 'all' && o.status?.toLowerCase() !== filterStatus.toLowerCase()) return false;
    return true;
  });

  const handleConfirmDispatch = (e) => {
    e.preventDefault();
    if (!dispatchOrderObj) return;
    dispatchOrder(dispatchOrderObj.id || dispatchOrderObj._id, {
      trackingNumber: trackingAwb || `AWB-${Date.now().toString().slice(-8)}`,
      courierPartner: courierName
    });
    setDispatchOrderObj(null);
    setTrackingAwb('');
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectOrderObj) return;
    rejectOrder(rejectOrderObj.id || rejectOrderObj._id, cancellationReason);
    setRejectOrderObj(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-900">Platform-Wide Orders Monitor</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Oversight of customer checkouts, pharmacy routing, and delivery fulfillment ({orders.length} orders)
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID, customer, or pharmacy..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 font-semibold">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs font-bold text-gray-800 p-1.5 rounded-xl border border-gray-300 bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="placed">Placed (Pending Rx/Accept)</option>
            <option value="PROCESSING_PHARMACY">Processing at Pharmacy</option>
            <option value="PACKED">Packed</option>
            <option value="DISPATCHED">Dispatched</option>
            <option value="DELIVERED">Delivered</option>
            <option value="REJECTED">Cancelled / Rejected</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-gray-500 uppercase text-[10px] border-b border-gray-200">
                <tr>
                  <th className="p-4 font-bold">Order ID</th>
                  <th className="p-4 font-bold">Customer &amp; Address</th>
                  <th className="p-4 font-bold">Fulfillment Pharmacy</th>
                  <th className="p-4 font-bold">Items</th>
                  <th className="p-4 font-bold">Amount</th>
                  <th className="p-4 font-bold">Fulfillment Status</th>
                  <th className="p-4 font-bold text-center">Manage Order Action</th>
                  <th className="p-4 font-bold text-right">Logistics / Tracking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((order) => {
                  const targetId = order.id || order._id;
                  const st = order.status?.toLowerCase() || '';

                  return (
                    <tr key={targetId} className="hover:bg-slate-50/80 transition">
                      <td className="p-4">
                        <div className="font-mono font-bold text-teal-800">
                          #{order.orderNumber || order.orderId || order.id}
                        </div>
                        <div className="text-[10px] text-gray-400">{formatDateTime(order.createdAt)}</div>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-gray-900">{order.userName || order.customerName || 'Customer'}</div>
                        <div className="text-[10px] text-gray-500">{order.userEmail || order.shippingAddress?.phone}</div>
                        <div className="text-[10px] text-gray-400 truncate max-w-[150px]">
                          {order.shippingAddress?.street ? `${order.shippingAddress.street}, ${order.shippingAddress.city}` : order.shippingAddress?.city || 'India'}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-gray-800">{order.sellerName || 'Apollo Care Pharmacy'}</div>
                        <div className="text-[10px] text-gray-400">ID: {order.sellerId ? String(order.sellerId).slice(0, 10) : 'Standard Hub'}</div>
                      </td>

                      <td className="p-4">
                        <div className="text-gray-800 font-semibold">{order.items?.length || 1} item(s)</div>
                        <div className="text-[10px] text-gray-500 truncate max-w-[140px]">
                          {order.items?.map((it) => `${it.name} (x${it.quantity})`).join(', ')}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-black text-gray-900">{formatCurrency(order.totalAmount || order.pricing?.grandTotal / 100 || 0)}</div>
                        <div className="text-[10px] text-emerald-600 font-bold">{order.paymentMethod || 'COD'}</div>
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          st === 'delivered'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : st === 'dispatched'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : st === 'packed'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : st === 'processing_pharmacy' || st === 'accepted' || st === 'verified'
                            ? 'bg-cyan-50 text-cyan-800 border border-cyan-200'
                            : st === 'rejected' || st === 'cancelled'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}>
                          {order.status?.toUpperCase()}
                        </span>
                        {order.cancellationReason && (
                          <div className="text-[10px] text-rose-600 mt-0.5 max-w-[120px] truncate">
                            Reason: {order.cancellationReason}
                          </div>
                        )}
                      </td>

                      {/* Interactive Manage Actions */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {/* Accept / Reject buttons if pending */}
                          {(st === 'placed' || st === 'payment_pending' || st === 'awaiting_prescription_review') && (
                            <>
                              <button
                                onClick={() => acceptOrder(targetId)}
                                className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white font-bold text-[10px] rounded-lg transition shadow-xs flex items-center space-x-1 cursor-pointer"
                                title="Accept and assign for dispensing"
                              >
                                <CheckCircle className="w-3 h-3" />
                                <span>Accept</span>
                              </button>
                              <button
                                onClick={() => setRejectOrderObj(order)}
                                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[10px] rounded-lg transition flex items-center space-x-1 cursor-pointer"
                                title="Reject / Cancel Order"
                              >
                                <XCircle className="w-3 h-3" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}

                          {/* Pack Button */}
                          {(st === 'processing_pharmacy' || st === 'accepted' || st === 'verified') && (
                            <button
                              onClick={() => packOrder(targetId)}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] rounded-lg transition shadow-xs flex items-center space-x-1 cursor-pointer"
                            >
                              <Package className="w-3 h-3" />
                              <span>Mark Packed</span>
                            </button>
                          )}

                          {/* Dispatch Button */}
                          {st === 'packed' && (
                            <button
                              onClick={() => {
                                setDispatchOrderObj(order);
                                setTrackingAwb(`AWB-${Math.floor(10000000 + Math.random() * 90000000)}`);
                              }}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded-lg transition shadow-xs flex items-center space-x-1 cursor-pointer"
                            >
                              <Send className="w-3 h-3" />
                              <span>Dispatch</span>
                            </button>
                          )}

                          {/* Deliver Button */}
                          {st === 'dispatched' && (
                            <button
                              onClick={() => deliverOrder(targetId)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg transition shadow-xs flex items-center space-x-1 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Mark Delivered</span>
                            </button>
                          )}

                          {/* Delivered/Completed */}
                          {st === 'delivered' && (
                            <span className="text-[10px] text-emerald-700 font-bold flex items-center justify-center">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Completed
                            </span>
                          )}

                          {/* Cancelled */}
                          {(st === 'rejected' || st === 'cancelled') && (
                            <span className="text-[10px] text-rose-600 font-bold flex items-center justify-center">
                              <XCircle className="w-3.5 h-3.5 mr-1" /> Closed
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        {order.courierPartner ? (
                          <div>
                            <span className="font-bold text-gray-900 block">{order.courierPartner}</span>
                            <button
                              onClick={() => {
                                setSelectedTrackingId(order.orderNumber || order.orderId || order.id);
                                setTrackingModalOpen(true);
                              }}
                              className="font-mono text-[10px] text-teal-700 hover:underline font-bold cursor-pointer"
                            >
                              AWB: {order.trackingNumber} ↗
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedTrackingId(order.orderNumber || order.orderId || order.id);
                              setTrackingModalOpen(true);
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 rounded-lg text-[10px] font-bold text-gray-600 transition cursor-pointer"
                          >
                            Track Live ↗
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500 text-xs">
            No orders match the current filter.
          </div>
        )}
      </div>

      {/* Dispatch Modal */}
      {dispatchOrderObj && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-gray-900">
              Dispatch Order #{dispatchOrderObj.orderNumber || dispatchOrderObj.id}
            </h3>
            <form onSubmit={handleConfirmDispatch} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">
                  Courier / Logistics Partner
                </label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-gray-300 bg-white"
                >
                  <option value="BlueDart Pharma Express">BlueDart Pharma Express</option>
                  <option value="Delhivery Health Logistics">Delhivery Health Logistics</option>
                  <option value="Shadowfax Rapid Delivery">Shadowfax Rapid Delivery</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">
                  Tracking AWB Number
                </label>
                <input
                  type="text"
                  required
                  value={trackingAwb}
                  onChange={(e) => setTrackingAwb(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-gray-300 font-mono font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDispatchOrderObj(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectOrderObj && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-rose-700">
              Reject / Cancel Order #{rejectOrderObj.orderNumber || rejectOrderObj.id}
            </h3>
            <form onSubmit={handleConfirmReject} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">
                  Cancellation Reason
                </label>
                <select
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-gray-300 bg-white"
                >
                  <option value="Prescription invalid or expired">Prescription invalid or expired</option>
                  <option value="Item temporarily out of stock">Item temporarily out of stock</option>
                  <option value="Delivery address out of coverage">Delivery address out of coverage</option>
                  <option value="Customer requested cancellation">Customer requested cancellation</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectOrderObj(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Keep Order
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <OrderTrackingModal
        isOpen={trackingModalOpen}
        onClose={() => setTrackingModalOpen(false)}
        initialOrderNumber={selectedTrackingId}
      />
    </div>
  );
}
