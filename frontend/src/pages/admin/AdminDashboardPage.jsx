import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  Users, 
  Building2, 
  PackageCheck, 
  FileCheck2, 
  ClipboardList, 
  DollarSign, 
  AlertTriangle, 
  ArrowUpRight, 
  ShieldCheck, 
  Activity,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { sellers, products, orders, prescriptions, auditLogs } = useData();

  // Metrics
  const pendingSellers = sellers.filter((s) => s.status === 'pending');
  const pendingProducts = products.filter((p) => p.approvalStatus === 'pending');
  const pendingRx = prescriptions.filter((rx) => rx.status === 'pending_review');

  const totalGMV = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const platformCommission = Math.round(totalGMV * 0.08); // 8% commission

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0b3b39] via-[#09302e] to-[#041a19] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-teal-900/50">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs bg-amber-500/20 text-amber-300 font-extrabold px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Central Compliance Controller
            </span>
            <span className="text-xs text-teal-300 font-mono">
              v1.0.4 Demo Engine
            </span>
          </div>
          <h1 className="text-2xl font-black">{user?.name || 'Platform Administrator'}</h1>
          <p className="text-xs text-teal-200 mt-1 max-w-xl">
            Supervise registered retail pharmacies, inspect Schedule H doctor prescriptions, and authorize medicine catalog listings.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="p-3 bg-teal-950/60 rounded-2xl border border-teal-800/40 text-center">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Platform Mode</span>
            <span className="font-extrabold text-amber-400">DEMO LOCAL STORAGE</span>
          </div>
        </div>
      </div>

      {/* Action Required Banner if pending items exist */}
      {(pendingSellers.length > 0 || pendingProducts.length > 0 || pendingRx.length > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-amber-950 text-xs">
          <div className="flex items-center space-x-2 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Action Required: Compliance Verification Queue</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {pendingSellers.length > 0 && (
              <Link
                to="/admin/sellers"
                className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold px-3 py-1 rounded-lg text-[11px] transition shadow-2xs"
              >
                {pendingSellers.length} Pending Seller(s) &rarr;
              </Link>
            )}
            {pendingProducts.length > 0 && (
              <Link
                to="/admin/products"
                className="bg-teal-700 hover:bg-teal-800 text-white font-extrabold px-3 py-1 rounded-lg text-[11px] transition shadow-2xs"
              >
                {pendingProducts.length} Pending Medicine(s) &rarr;
              </Link>
            )}
            {pendingRx.length > 0 && (
              <Link
                to="/admin/prescriptions"
                className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-3 py-1 rounded-lg text-[11px] transition shadow-2xs"
              >
                {pendingRx.length} Prescription(s) to Verify &rarr;
              </Link>
            )}
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross GMV */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase block">Platform GMV</span>
            <span className="text-2xl font-black text-gray-900 mt-1 block">
              {formatCurrency(totalGMV)}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
              Est. Commission (8%): {formatCurrency(platformCommission)}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase block">Total Orders</span>
            <span className="text-2xl font-black text-gray-900 mt-1 block">
              {orders.length}
            </span>
            <span className="text-[10px] text-teal-700 font-bold block mt-0.5">
              Across all partner pharmacies
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <ClipboardList className="w-6 h-6" />
          </div>
        </div>

        {/* Registered Sellers */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase block">Pharmacies</span>
            <span className="text-2xl font-black text-gray-900 mt-1 block">
              {sellers.length}
            </span>
            <span className="text-[10px] text-amber-600 font-bold block mt-0.5">
              {pendingSellers.length} license(s) awaiting approval
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* Catalog Medicines */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase block">Listed Medicines</span>
            <span className="text-2xl font-black text-gray-900 mt-1 block">
              {products.length}
            </span>
            <span className="text-[10px] text-teal-700 font-bold block mt-0.5">
              {pendingProducts.length} pending listing reviews
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <PackageCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Two Columns: Recent Orders & Compliance Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Overview */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-extrabold text-gray-900">Platform Orders Activity</h2>
              <p className="text-xs text-gray-500">Live monitoring of customer checkouts across suppliers</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-teal-700 hover:underline flex items-center"
            >
              <span>All Orders</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-gray-500 uppercase text-[10px] border-b border-gray-100">
                <tr>
                  <th className="p-3 font-bold">Order ID</th>
                  <th className="p-3 font-bold">Customer</th>
                  <th className="p-3 font-bold">Pharmacy Supplier</th>
                  <th className="p-3 font-bold">Amount</th>
                  <th className="p-3 font-bold">Status</th>
                  <th className="p-3 font-bold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-mono font-bold text-gray-900">#{order.id}</td>
                    <td className="p-3 text-gray-700">{order.userName}</td>
                    <td className="p-3 text-gray-500 truncate max-w-[140px]">{order.sellerName}</td>
                    <td className="p-3 font-bold text-gray-900">{formatCurrency(order.totalAmount)}</td>
                    <td className="p-3">
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
                    <td className="p-3 text-right">
                      <Link
                        to="/admin/orders"
                        className="text-xs font-bold text-teal-700 hover:underline"
                      >
                        Inspect &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Compliance Audit Trail Feed */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-extrabold text-gray-900">Compliance Audit Trail</h2>
              <p className="text-xs text-gray-500">Immutable admin actions</p>
            </div>
            <Link
              to="/admin/settings"
              className="text-xs font-bold text-teal-700 hover:underline flex items-center"
            >
              <span>Full Log</span>
            </Link>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {auditLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="p-3 bg-slate-50 rounded-2xl border border-gray-100 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-mono font-bold text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                    {log.action}
                  </span>
                  <span className="text-gray-400">{formatDateTime(log.timestamp)}</span>
                </div>
                <p className="text-xs text-gray-700 font-medium leading-snug">{log.details}</p>
                <div className="text-[10px] text-gray-400">By: {log.actor}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
