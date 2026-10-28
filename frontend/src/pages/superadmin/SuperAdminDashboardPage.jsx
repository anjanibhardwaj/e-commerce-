import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { 
  Crown, 
  DollarSign, 
  ShoppingCart, 
  Building2, 
  PackageCheck, 
  Users, 
  ShieldCheck, 
  ArrowUpRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  XCircle,
  Truck
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

export default function SuperAdminDashboardPage() {
  const { products, orders, sellers, acceptOrder, rejectOrder, deliverOrder } = useData();

  // Financial metrics
  const totalGMV = orders
    .filter((o) => o.status !== 'REJECTED' && o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + (o.totalAmount || o.pricing?.grandTotal / 100 || 0), 0);

  const platformCommission = Math.round(totalGMV * 0.08); // 8% commission
  const activeSellersCount = sellers.filter((s) => s.status === 'approved').length;
  const pendingSellersCount = sellers.filter((s) => s.status === 'pending').length;
  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'placed' || o.status === 'PAYMENT_PENDING' || o.status === 'AWAITING_PRESCRIPTION_REVIEW'
  ).length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-[#151522] to-[#12121e] rounded-3xl p-6 sm:p-8 border border-purple-800/40 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Master Governance Command</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            SuperAdmin Executive Dashboard
          </h1>
          <p className="text-xs text-purple-200/80 max-w-xl">
            Real-time platform metrics, nationwide pharmacy network oversight, and unified catalog and order management.
          </p>
        </div>
      </div>

      {/* High-Level Executive Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total GMV */}
        <div className="bg-[#12121a] rounded-3xl border border-purple-900/40 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-purple-300 font-bold">
            <span>Gross Platform GMV</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {formatCurrency(totalGMV)}
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold">
            +18.4% monthly volume growth
          </div>
        </div>

        {/* Platform Net Revenue */}
        <div className="bg-[#12121a] rounded-3xl border border-purple-900/40 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-purple-300 font-bold">
            <span>Platform Commission (8%)</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {formatCurrency(platformCommission)}
          </div>
          <div className="text-[11px] text-purple-300 font-semibold">
            Direct marketplace fee earnings
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-[#12121a] rounded-3xl border border-purple-900/40 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-purple-300 font-bold">
            <span>Total Orders Handled</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {orders.length}
          </div>
          <div className="text-[11px] text-amber-400 font-semibold">
            {pendingOrdersCount} orders requiring immediate dispatch
          </div>
        </div>

        {/* Total Sellers */}
        <div className="bg-[#12121a] rounded-3xl border border-purple-900/40 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-purple-300 font-bold">
            <span>Verified Pharmacies</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {sellers.length}
          </div>
          <div className="text-[11px] text-teal-400 font-semibold">
            {activeSellersCount} Approved • {pendingSellersCount} Pending review
          </div>
        </div>
      </div>

      {/* Quick Governance Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#12121a] rounded-3xl border border-purple-900/40 p-6 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
            <PackageCheck className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-base text-white">Product Catalog Governance</h3>
          <p className="text-xs text-slate-400">
            Control all {products.length} products listed by pharmacies. Approve, modify prices, or deactivate items platform-wide.
          </p>
          <Link
            to="/admin/products"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-teal-400 hover:text-teal-300 pt-1"
          >
            <span>Manage Product Catalog</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-[#12121a] rounded-3xl border border-purple-900/40 p-6 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-base text-white">Live Orders Command</h3>
          <p className="text-xs text-slate-400">
            Real-time control over all checkouts. Accept or cancel orders, assign couriers, and track fulfillment status live.
          </p>
          <Link
            to="/admin/orders"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 pt-1"
          >
            <span>Open All Orders Console</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-[#12121a] rounded-3xl border border-purple-900/40 p-6 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-base text-white">Merchant Pharmacy Licenses</h3>
          <p className="text-xs text-slate-400">
            Audit seller drug licenses (Form 20/21), GSTIN compliance, and review pending pharmacy onboarding requests.
          </p>
          <Link
            to="/admin/sellers"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 pt-1"
          >
            <span>Review Pharmacy Partners</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Recent Orders Action Table */}
      <div className="bg-[#12121a] rounded-3xl border border-purple-900/40 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-white">Recent Orders Needing Oversight</h2>
            <p className="text-xs text-slate-400">Direct order state transitions synchronized across Admin, Seller &amp; Customer</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs text-purple-400 hover:text-purple-300 font-bold"
          >
            View All ({orders.length}) &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-purple-950/40 text-purple-300 uppercase text-[10px] border-b border-purple-900/30">
              <tr>
                <th className="p-3 font-bold">Order ID</th>
                <th className="p-3 font-bold">Customer</th>
                <th className="p-3 font-bold">Pharmacy</th>
                <th className="p-3 font-bold">Amount</th>
                <th className="p-3 font-bold">Status</th>
                <th className="p-3 font-bold text-right">Quick SuperAdmin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/20 text-slate-200">
              {orders.slice(0, 6).map((order) => {
                const targetId = order.id || order._id;
                const st = order.status?.toLowerCase() || '';

                return (
                  <tr key={targetId} className="hover:bg-purple-950/20 transition">
                    <td className="p-3 font-mono font-bold text-purple-300">
                      #{order.orderNumber || order.orderId || order.id}
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-white">{order.userName || order.customerName || 'Customer'}</div>
                      <div className="text-[10px] text-slate-400">{order.shippingAddress?.city}</div>
                    </td>
                    <td className="p-3 text-slate-300">
                      {order.sellerName || 'Apollo Care Pharmacy'}
                    </td>
                    <td className="p-3 font-black text-white">
                      {formatCurrency(order.totalAmount || order.pricing?.grandTotal / 100 || 0)}
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        st === 'delivered'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : st === 'dispatched'
                          ? 'bg-indigo-500/20 text-indigo-300'
                          : st === 'packed'
                          ? 'bg-amber-500/20 text-amber-300'
                          : st === 'rejected' || st === 'cancelled'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {order.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {(st === 'placed' || st === 'payment_pending') && (
                          <button
                            onClick={() => acceptOrder(targetId)}
                            className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white font-bold text-[10px] rounded-lg transition flex items-center space-x-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Accept</span>
                          </button>
                        )}
                        {st === 'dispatched' && (
                          <button
                            onClick={() => deliverOrder(targetId)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg transition flex items-center space-x-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Deliver</span>
                          </button>
                        )}
                        <Link
                          to="/admin/orders"
                          className="px-2.5 py-1 bg-purple-900/40 hover:bg-purple-900/70 border border-purple-700/40 text-purple-200 font-bold text-[10px] rounded-lg transition"
                        >
                          Details &rarr;
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
