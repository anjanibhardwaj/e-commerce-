import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  BarChart3, 
  Download, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  ArrowUpRight 
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function SellerReportsPage() {
  const { user } = useAuth();
  const { orders, products, showToast } = useData();

  const [dateFilter, setDateFilter] = useState('30d');

  const sellerOrders = orders.filter(
    (o) => o.sellerId === user?.id || !o.sellerId
  );

  const completedOrders = sellerOrders.filter((o) => o.status !== 'cancelled');
  const totalRevenue = completedOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const avgOrderValue = completedOrders.length > 0 ? Math.round(totalRevenue / completedOrders.length) : 0;

  // Product-wise sales aggregation
  const productSalesMap = {};
  completedOrders.forEach((o) => {
    o.items?.forEach((it) => {
      if (!productSalesMap[it.name]) {
        productSalesMap[it.name] = { name: it.name, quantity: 0, revenue: 0 };
      }
      productSalesMap[it.name].quantity += it.quantity;
      productSalesMap[it.name].revenue += (it.price * it.quantity);
    });
  });

  const productSalesList = Object.values(productSalesMap);

  const handleDownloadCSV = () => {
    const headers = 'Order ID,Customer,Amount,Status,Payment Method\n';
    const rows = completedOrders.map(
      (o) => `"${o.id}","${o.userName}","${o.totalAmount}","${o.status}","${o.paymentMethod}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `pharmacy_sales_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Sales report CSV generated and downloaded!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-900">Sales &amp; Financial Analytics</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Evaluate revenue performance, top-selling medicines, and transaction histories
          </p>
        </div>

        <button
          onClick={handleDownloadCSV}
          className="flex items-center space-x-1.5 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition shadow-md shadow-teal-700/20 cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase block">Total Net Revenue</span>
          <span className="text-2xl font-black text-gray-900 mt-1 block">
            {formatCurrency(totalRevenue)}
          </span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center mt-1">
            <TrendingUp className="w-3 h-3 mr-0.5" /> Direct to pharmacy account
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase block">Fulfilled Orders</span>
          <span className="text-2xl font-black text-gray-900 mt-1 block">
            {completedOrders.length}
          </span>
          <span className="text-[10px] text-teal-700 font-bold block mt-1">
            100% On-time dispatch target
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase block">Avg Order Value (AOV)</span>
          <span className="text-2xl font-black text-gray-900 mt-1 block">
            {formatCurrency(avgOrderValue)}
          </span>
          <span className="text-[10px] text-gray-400 block mt-1">
            Includes prescription &amp; OTC supplies
          </span>
        </div>
      </div>

      {/* Product-wise Sales Table */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-extrabold text-gray-900">Product-Wise Sales Breakdown</h2>

        {productSalesList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-gray-500 uppercase text-[10px] border-b border-gray-200">
                <tr>
                  <th className="p-3 font-bold">Medicine Name</th>
                  <th className="p-3 font-bold">Units Dispensed</th>
                  <th className="p-3 font-bold text-right">Gross Earnings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {productSalesList.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="p-3 font-semibold text-gray-800">{item.name}</td>
                    <td className="p-3 font-bold text-gray-700">{item.quantity} units</td>
                    <td className="p-3 font-black text-gray-900 text-right">{formatCurrency(item.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-gray-400 py-6 text-center">No sales recorded yet.</p>
        )}
      </div>
    </div>
  );
}
