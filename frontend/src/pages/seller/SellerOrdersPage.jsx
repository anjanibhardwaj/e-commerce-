import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Search, 
  FileText, 
  Filter, 
  ArrowUpRight 
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

export default function SellerOrdersPage() {
  const { user } = useAuth();
  const { orders, updateOrderStatus, showToast } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Dispatch modal state
  const [dispatchModalOrder, setDispatchModalOrder] = useState(null);
  const [courierPartner, setCourierPartner] = useState('BlueDart Pharma Express');
  const [trackingNumber, setTrackingNumber] = useState('');

  // Seller's orders
  const sellerOrders = orders.filter(
    (o) => o.sellerId === user?.id || !o.sellerId
  );

  const filtered = sellerOrders.filter((o) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = o.id?.toLowerCase().includes(q) || o.userName?.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (statusFilter !== 'all' && o.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const handleMarkPacked = (orderId) => {
    updateOrderStatus(orderId, 'packed', { actor: user?.name || 'Seller' });
    showToast(`Order #${orderId} marked as PACKED!`);
  };

  const handleConfirmDispatch = (e) => {
    e.preventDefault();
    if (!trackingNumber) {
      showToast('Please enter tracking AWB number', 'error');
      return;
    }

    updateOrderStatus(dispatchModalOrder.id, 'dispatched', {
      trackingNumber,
      courierPartner,
      actor: user?.name || 'Seller'
    });

    setDispatchModalOrder(null);
    setTrackingNumber('');
    showToast(`Order #${dispatchModalOrder.id} DISPATCHED with ${courierPartner}!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-900">Order Fulfillment &amp; Dispatch</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Process orders, package medicines, and assign certified courier tracking ({sellerOrders.length} orders)
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID or Customer Name..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-gray-500 font-semibold">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-bold text-gray-800 p-1.5 rounded-xl border border-gray-300 bg-white cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="placed">Placed (New)</option>
            <option value="verified">Rx Verified</option>
            <option value="packed">Packed</option>
            <option value="dispatched">Dispatched</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Orders List Cards */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs hover:border-teal-300 transition space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm font-black text-gray-900">
                      Order #{order.id}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      order.status === 'dispatched'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : order.status === 'packed'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : order.status === 'verified'
                        ? 'bg-teal-50 text-teal-800 border border-teal-200'
                        : 'bg-blue-50 text-blue-800 border border-blue-200'
                    }`}>
                      {order.status?.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Placed: {formatDateTime(order.createdAt)} • Payment: <strong>{order.paymentMethod}</strong>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Gross Total</span>
                  <span className="text-base font-black text-gray-900">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>

              {/* Items & Shipping */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Items */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-gray-100 space-y-2">
                  <div className="text-[10px] font-bold text-gray-500 uppercase">Medicines to Dispense</div>
                  <div className="space-y-1">
                    {order.items?.map((it, idx) => (
                      <div key={idx} className="flex justify-between font-medium">
                        <span className="text-gray-800">
                          {it.quantity}x {it.name}
                        </span>
                        <span className="text-gray-900 font-bold">{formatCurrency(it.price * it.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping & Prescription */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-gray-100 space-y-2">
                  <div className="text-[10px] font-bold text-gray-500 uppercase flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-teal-700" />
                    Delivery Destination
                  </div>
                  <p className="text-gray-800 font-semibold">{order.userName}</p>
                  <p className="text-gray-600">
                    {order.shippingAddress?.street}, {order.shippingAddress?.city} - {order.shippingAddress?.pincode}
                  </p>
                  {order.prescriptionId && (
                    <div className="pt-1 text-[11px] text-teal-800 font-bold flex items-center">
                      <FileText className="w-3 h-3 mr-1" />
                      Prescription Verified (ID: {order.prescriptionId})
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="text-[11px] text-gray-500">
                  {order.courierPartner ? (
                    <span>Dispatched via <strong>{order.courierPartner}</strong> (AWB: <span className="font-mono text-gray-800">{order.trackingNumber}</span>)</span>
                  ) : (
                    <span>Awaiting warehouse packing &amp; handover</span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {(order.status === 'placed' || order.status === 'verified') && (
                    <button
                      onClick={() => handleMarkPacked(order.id)}
                      className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl transition cursor-pointer"
                    >
                      Mark as Packed
                    </button>
                  )}

                  {order.status === 'packed' && (
                    <button
                      onClick={() => {
                        setDispatchModalOrder(order);
                        setTrackingNumber(`AWB-${Math.floor(100000 + Math.random() * 900000)}`);
                      }}
                      className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs rounded-xl transition shadow-md shadow-teal-700/20 cursor-pointer"
                    >
                      Dispatch &amp; Assign Courier &rarr;
                    </button>
                  )}

                  {order.status === 'dispatched' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'delivered', { actor: user?.name })}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                    >
                      Mark as Delivered ✓
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center text-xs text-gray-500">
            No orders match the selected criteria.
          </div>
        )}
      </div>

      {/* Dispatch Modal */}
      {dispatchModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-gray-900">
              Dispatch Order #{dispatchModalOrder.id}
            </h3>
            <p className="text-xs text-gray-500">
              Assign logistics carrier and tracking AWB so the customer can track the delivery.
            </p>

            <form onSubmit={handleConfirmDispatch} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Courier Partner</label>
                <select
                  value={courierPartner}
                  onChange={(e) => setCourierPartner(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300"
                >
                  <option value="BlueDart Pharma Express">BlueDart Pharma Express</option>
                  <option value="Delhivery Health Fleet">Delhivery Health Fleet</option>
                  <option value="DTDC Medical Cargo">DTDC Medical Cargo</option>
                  <option value="India Post SpeedPost">India Post SpeedPost</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Airway Bill (AWB) / Tracking No.</label>
                <input
                  type="text"
                  required
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="AWB-883910"
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300 font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setDispatchModalOrder(null)}
                  className="text-xs text-gray-500 px-3 py-1.5 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition"
                >
                  Confirm Handover to Courier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
