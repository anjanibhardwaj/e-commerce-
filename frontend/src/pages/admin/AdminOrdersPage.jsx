import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { 
  ClipboardList, 
  Search, 
  FileText, 
  MapPin, 
  Truck, 
  Filter,
  DollarSign 
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

export default function AdminOrdersPage() {
  const { orders } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = orders.filter((o) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = o.id?.toLowerCase().includes(q) || o.userName?.toLowerCase().includes(q) || o.sellerName?.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filterStatus !== 'all' && o.status !== filterStatus) return false;
    return true;
  });

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
            <option value="placed">Placed (Pending Rx/Packing)</option>
            <option value="verified">Rx Verified</option>
            <option value="packed">Packed</option>
            <option value="dispatched">Dispatched</option>
            <option value="delivered">Delivered</option>
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
                  <th className="p-4 font-bold">Order Reference</th>
                  <th className="p-4 font-bold">Customer</th>
                  <th className="p-4 font-bold">Dispensing Pharmacy</th>
                  <th className="p-4 font-bold">Items</th>
                  <th className="p-4 font-bold">Amount</th>
                  <th className="p-4 font-bold">Fulfillment Status</th>
                  <th className="p-4 font-bold text-right">Logistics / Courier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4">
                      <div className="font-mono font-bold text-gray-900">#{order.id}</div>
                      <div className="text-[10px] text-gray-400">{formatDateTime(order.createdAt)}</div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-gray-900">{order.userName}</div>
                      <div className="text-[10px] text-gray-500">{order.userEmail}</div>
                      <div className="text-[10px] text-gray-400">{order.shippingAddress?.city}</div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-teal-800">{order.sellerName || 'Apollo Care'}</div>
                      <div className="text-[10px] text-gray-400">{order.sellerId}</div>
                    </td>

                    <td className="p-4">
                      <div className="text-gray-800 font-semibold">{order.items?.length || 1} item(s)</div>
                      <div className="text-[10px] text-gray-500 truncate max-w-[140px]">
                        {order.items?.map((it) => it.name).join(', ')}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-black text-gray-900">{formatCurrency(order.totalAmount)}</div>
                      <div className="text-[10px] text-emerald-600 font-bold">{order.paymentMethod}</div>
                    </td>

                    <td className="p-4">
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
                      {order.prescriptionId && (
                        <div className="text-[10px] text-teal-700 font-bold mt-1 flex items-center">
                          <FileText className="w-3 h-3 mr-0.5" /> Rx Attached
                        </div>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      {order.courierPartner ? (
                        <div>
                          <span className="font-bold text-gray-900 block">{order.courierPartner}</span>
                          <span className="font-mono text-[10px] text-gray-500">AWB: {order.trackingNumber}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-[11px]">Unassigned (In Pharmacy)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500 text-xs">
            No orders match the current filter.
          </div>
        )}
      </div>
    </div>
  );
}
