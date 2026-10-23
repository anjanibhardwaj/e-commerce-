import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  Boxes, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Minus, 
  Search, 
  Calendar, 
  RefreshCw 
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function SellerInventoryPage() {
  const { user } = useAuth();
  const { products, updateStock, showToast } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterAlertsOnly, setFilterAlertsOnly] = useState(false);

  const sellerProducts = products.filter(
    (p) => p.sellerId === user?.id || !p.sellerId
  );

  const now = new Date();

  const getExpiryStatus = (dateStr) => {
    if (!dateStr) return { label: 'Valid', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    const diffDays = Math.round((new Date(dateStr) - now) / (1000 * 3600 * 24));
    if (diffDays <= 60) {
      return { label: `Critical: ${diffDays}d left`, color: 'text-rose-700 bg-rose-50 border-rose-200', isCritical: true };
    }
    if (diffDays <= 180) {
      return { label: `Near Expiry: ${diffDays}d`, color: 'text-amber-800 bg-amber-50 border-amber-200', isWarning: true };
    }
    return { label: `Healthy Shelf Life`, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  };

  const filtered = sellerProducts.filter((p) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = p.name?.toLowerCase().includes(q) || p.batchNumber?.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filterAlertsOnly) {
      const expStatus = getExpiryStatus(p.expiryDate);
      const isLowStock = p.stock < 25;
      if (!isLowStock && !expStatus.isCritical && !expStatus.isWarning) return false;
    }
    return true;
  });

  const handleAdjustStock = (id, currentStock, delta) => {
    const updated = Math.max(0, currentStock + delta);
    updateStock(id, updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-900">Inventory &amp; Batch Expiry Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor stock thresholds, batch numbers, and medical compliance shelf life
          </p>
        </div>

        <button
          onClick={() => setFilterAlertsOnly(!filterAlertsOnly)}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
            filterAlertsOnly
              ? 'bg-rose-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{filterAlertsOnly ? 'Showing Alerts Only' : 'Filter Alerts (Low / Expiry)'}</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by medicine name or batch code..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-gray-500 uppercase text-[10px] border-b border-gray-200">
              <tr>
                <th className="p-4 font-bold">Medicine Product</th>
                <th className="p-4 font-bold">Batch Code</th>
                <th className="p-4 font-bold">Expiry Date</th>
                <th className="p-4 font-bold">Compliance Status</th>
                <th className="p-4 font-bold">In-Stock Units</th>
                <th className="p-4 font-bold text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item) => {
                const exp = getExpiryStatus(item.expiryDate);
                const isLow = item.stock < 25;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-contain rounded-xl bg-gray-50 p-1 border border-gray-100 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-gray-900 line-clamp-1">{item.name}</div>
                        <div className="text-[10px] text-gray-500">{item.brand}</div>
                      </div>
                    </td>

                    <td className="p-4 font-mono font-bold text-gray-900">
                      {item.batchNumber || 'BAT-9921'}
                    </td>

                    <td className="p-4 font-mono text-gray-700">
                      {formatDate(item.expiryDate)}
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${exp.color}`}>
                        {exp.label}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-black ${isLow ? 'text-rose-600' : 'text-gray-900'}`}>
                          {item.stock}
                        </span>
                        {isLow && (
                          <span className="text-[9px] bg-rose-100 text-rose-800 font-extrabold px-1.5 py-0.2 rounded">
                            LOW
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <div className="inline-flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
                        <button
                          onClick={() => handleAdjustStock(item.id, item.stock, -10)}
                          className="px-2 py-1 text-[10px] font-bold bg-white text-gray-700 hover:bg-gray-200 rounded-lg shadow-2xs cursor-pointer"
                          title="Reduce 10"
                        >
                          -10
                        </button>
                        <button
                          onClick={() => handleAdjustStock(item.id, item.stock, -1)}
                          className="px-2 py-1 text-[10px] font-bold bg-white text-gray-700 hover:bg-gray-200 rounded-lg shadow-2xs cursor-pointer"
                          title="Reduce 1"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => handleAdjustStock(item.id, item.stock, 5)}
                          className="px-2 py-1 text-[10px] font-bold bg-teal-700 text-white hover:bg-teal-800 rounded-lg shadow-2xs cursor-pointer"
                          title="Add 5"
                        >
                          +5
                        </button>
                        <button
                          onClick={() => handleAdjustStock(item.id, item.stock, 25)}
                          className="px-2 py-1 text-[10px] font-bold bg-teal-700 text-white hover:bg-teal-800 rounded-lg shadow-2xs cursor-pointer"
                          title="Add 25"
                        >
                          +25
                        </button>
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
