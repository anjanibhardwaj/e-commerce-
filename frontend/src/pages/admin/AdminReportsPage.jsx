import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { 
  BarChart4, 
  Download, 
  TrendingUp, 
  DollarSign, 
  Building2, 
  PieChart,
  ClipboardList 
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function AdminReportsPage() {
  const { orders, sellers, showToast } = useData();

  const totalGMV = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const platformCommission = Math.round(totalGMV * 0.08);

  // Group revenue by seller
  const sellerRevenueMap = {};
  orders.forEach((o) => {
    const sName = o.sellerName || 'Unknown Pharmacy';
    if (!sellerRevenueMap[sName]) {
      sellerRevenueMap[sName] = { name: sName, ordersCount: 0, totalSales: 0 };
    }
    sellerRevenueMap[sName].ordersCount += 1;
    sellerRevenueMap[sName].totalSales += (o.totalAmount || 0);
  });

  const sellerRevenueList = Object.values(sellerRevenueMap);

  const handleExportCSV = () => {
    const headers = 'Order ID,Date,Customer,Pharmacy,Amount,Payment,Status\n';
    const rows = orders.map(
      (o) => `"${o.id}","${o.createdAt}","${o.userName}","${o.sellerName}","${o.totalAmount}","${o.paymentMethod}","${o.status}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `platform_gmv_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Platform GMV CSV report exported successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-900">Platform Financials &amp; Analytics</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor GMV velocity, pharmacy supplier commissions, and checkout conversion rates
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center space-x-1.5 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition shadow-md shadow-teal-700/20 cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Master CSV</span>
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase block">Platform Gross Merchandise Value (GMV)</span>
          <span className="text-2xl font-black text-gray-900 mt-1 block">
            {formatCurrency(totalGMV)}
          </span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center mt-1">
            <TrendingUp className="w-3 h-3 mr-0.5" /> +22.4% MoM platform expansion
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase block">Platform Commission Earned</span>
          <span className="text-2xl font-black text-teal-700 mt-1 block">
            {formatCurrency(platformCommission)}
          </span>
          <span className="text-[10px] text-gray-500 block mt-1">
            Standard 8% healthcare marketplace take-rate
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase block">Fulfillment Success Rate</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">
            98.5%
          </span>
          <span className="text-[10px] text-gray-500 block mt-1">
            Verified cold-chain &amp; prescription compliance
          </span>
        </div>
      </div>

      {/* Seller Performance Table */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-extrabold text-gray-900">Pharmacy Supplier Performance &amp; Commission</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-gray-500 uppercase text-[10px] border-b border-gray-200">
              <tr>
                <th className="p-3 font-bold">Pharmacy Business Name</th>
                <th className="p-3 font-bold">Processed Orders</th>
                <th className="p-3 font-bold">Gross Sales</th>
                <th className="p-3 font-bold text-right">Commission Due (8%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sellerRevenueList.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80">
                  <td className="p-3 font-bold text-gray-900">{s.name}</td>
                  <td className="p-3 font-semibold text-gray-700">{s.ordersCount} orders</td>
                  <td className="p-3 font-black text-gray-900">{formatCurrency(s.totalSales)}</td>
                  <td className="p-3 font-black text-teal-700 text-right">
                    {formatCurrency(Math.round(s.totalSales * 0.08))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
