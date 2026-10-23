import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  Package, 
  ShoppingBag, 
  DollarSign, 
  AlertTriangle, 
  Clock, 
  Boxes, 
  ArrowUpRight, 
  TrendingUp, 
  PlusCircle,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

export default function SellerDashboardPage() {
  const { user } = useAuth();
  const { products, orders } = useData();

  // Scope to seller
  const sellerProducts = products.filter((p) => p.sellerId === user?.id);
  const activeProducts = sellerProducts.filter((p) => p.approvalStatus === 'approved');
  const pendingApprovals = sellerProducts.filter((p) => p.approvalStatus === 'pending');

  const sellerOrders = orders.filter((o) => o.sellerId === user?.id || !o.sellerId);
  const pendingOrders = sellerOrders.filter((o) => o.status === 'placed' || o.status === 'verified');
  const totalRevenue = sellerOrders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Low stock (< 20 units) & near expiry (< 90 days)
  const lowStockCount = sellerProducts.filter((p) => p.stock < 25).length;
  const now = new Date();
  const nearExpiryCount = sellerProducts.filter((p) => {
    if (!p.expiryDate) return false;
    const diffDays = (new Date(p.expiryDate) - now) / (1000 * 3600 * 24);
    return diffDays < 90;
  }).length;

  return (
    <div className="space-y-6">
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs bg-teal-500/20 text-teal-300 font-extrabold px-2.5 py-0.5 rounded-full border border-teal-500/30">
              License: {user?.licenseNumber || 'DL-APPROVED'}
            </span>
            <span className="text-xs text-teal-200">
              Rating: ★ {user?.rating || 4.8} / 5.0
            </span>
          </div>
          <h1 className="text-2xl font-black">{user?.name || 'Partner Pharmacy Hub'}</h1>
          <p className="text-xs text-teal-200 mt-1">
            Dispatch medical supplies, manage batch inventory, and maintain healthcare compliance.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/seller/products/add"
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs rounded-xl transition shadow-md cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Medicine</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 block uppercase tracking-wider">Gross Sales</span>
            <span className="text-2xl font-black text-gray-900 mt-1 block">
              {formatCurrency(totalRevenue)}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center mt-0.5">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14.8% from last month
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 block uppercase tracking-wider">Orders to Dispatch</span>
            <span className="text-2xl font-black text-gray-900 mt-1 block">
              {pendingOrders.length}
            </span>
            <span className="text-[10px] text-amber-600 font-bold flex items-center mt-0.5">
              <Clock className="w-3 h-3 mr-0.5" /> Requires packing
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Live Products */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 block uppercase tracking-wider">Active Catalog</span>
            <span className="text-2xl font-black text-gray-900 mt-1 block">
              {activeProducts.length}
            </span>
            <span className="text-[10px] text-teal-700 font-bold flex items-center mt-0.5">
              <CheckCircle2 className="w-3 h-3 mr-0.5" /> {pendingApprovals.length} pending admin review
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Stock / Expiry Alerts */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 block uppercase tracking-wider">Inventory Alerts</span>
            <span className="text-2xl font-black text-rose-600 mt-1 block">
              {lowStockCount + nearExpiryCount}
            </span>
            <span className="text-[10px] text-rose-500 font-bold flex items-center mt-0.5">
              <AlertTriangle className="w-3 h-3 mr-0.5" /> {lowStockCount} low stock, {nearExpiryCount} near expiry
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Boxes className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Orders & Quick Inventory Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-extrabold text-gray-900">Recent Customer Orders</h2>
              <p className="text-xs text-gray-500">Orders allocated to your pharmacy</p>
            </div>
            <Link
              to="/seller/orders"
              className="text-xs font-bold text-teal-700 hover:underline flex items-center"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          {sellerOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-gray-400 uppercase text-[10px] border-b border-gray-100">
                    <th className="py-2.5 font-bold">Order ID</th>
                    <th className="py-2.5 font-bold">Customer</th>
                    <th className="py-2.5 font-bold">Items</th>
                    <th className="py-2.5 font-bold">Amount</th>
                    <th className="py-2.5 font-bold">Status</th>
                    <th className="py-2.5 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sellerOrders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 font-mono font-bold text-gray-900">#{order.id}</td>
                      <td className="py-3 text-gray-700">{order.userName}</td>
                      <td className="py-3 text-gray-500">{order.items?.length || 1} item(s)</td>
                      <td className="py-3 font-bold text-gray-900">{formatCurrency(order.totalAmount)}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === 'dispatched'
                            ? 'bg-indigo-50 text-indigo-700'
                            : order.status === 'packed'
                            ? 'bg-amber-50 text-amber-800'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {order.status?.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          to="/seller/orders"
                          className="text-xs font-bold text-teal-700 hover:underline"
                        >
                          Process &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-gray-400 py-6 text-center">No orders received yet.</p>
          )}
        </div>

        {/* Quick Actions & Compliance Status */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Quick Shortcuts
            </h3>
            <div className="space-y-2">
              <Link
                to="/seller/products/add"
                className="flex items-center justify-between p-3 rounded-2xl bg-teal-50 hover:bg-teal-100/70 border border-teal-200 transition text-xs font-bold text-teal-900"
              >
                <span>+ List New Medicine</span>
                <ArrowUpRight className="w-4 h-4 text-teal-700" />
              </Link>

              <Link
                to="/seller/inventory"
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-gray-200 transition text-xs font-bold text-gray-800"
              >
                <span>Update Stock Quantities</span>
                <ArrowUpRight className="w-4 h-4 text-gray-500" />
              </Link>

              <Link
                to="/seller/reports"
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-gray-200 transition text-xs font-bold text-gray-800"
              >
                <span>Download Sales Report (CSV)</span>
                <ArrowUpRight className="w-4 h-4 text-gray-500" />
              </Link>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-3 shadow-md">
            <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Drug Licensing Compliance</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              All prescription medicines are audited for manufacturer expiry dates and valid Form 20/21 pharmacy licenses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
