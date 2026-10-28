import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  Plus, 
  Search, 
  Package, 
  FileText, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Edit3, 
  Boxes,
  ExternalLink 
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function SellerProductsPage() {
  const { user } = useAuth();
  const { products, updateStock } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingStockId, setEditingStockId] = useState(null);
  const [newStockVal, setNewStockVal] = useState('');

  // Seller's own products strictly matching their seller ID
  const sellerProducts = products.filter((p) => {
    if (!user) return false;
    const uid = String(user.id || user._id || '');
    const sid = String(p.sellerId || '');
    return uid && sid && uid === sid;
  });

  const filtered = sellerProducts.filter((p) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = p.name?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q) || p.batchNumber?.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (statusFilter !== 'all' && p.approvalStatus !== statusFilter) {
      return false;
    }
    return true;
  });

  const handleSaveStock = (id) => {
    if (newStockVal !== '') {
      updateStock(id, Number(newStockVal));
    }
    setEditingStockId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-900">My Medicine Catalog</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage product listings, pricing, batches, and stock levels ({sellerProducts.length} items)
          </p>
        </div>

        <Link
          to="/seller/products/add"
          className="flex items-center space-x-1.5 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition shadow-md shadow-teal-700/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Medicine</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, brand, or batch..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-gray-500 font-semibold">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-bold text-gray-800 p-1.5 rounded-xl border border-gray-300 bg-white cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved &amp; Live</option>
            <option value="pending">Pending Admin Review</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-gray-500 uppercase text-[10px] border-b border-gray-200">
                <tr>
                  <th className="p-4 font-bold">Product</th>
                  <th className="p-4 font-bold">Category</th>
                  <th className="p-4 font-bold">Price / MRP</th>
                  <th className="p-4 font-bold">Batch &amp; Expiry</th>
                  <th className="p-4 font-bold">Rx Req?</th>
                  <th className="p-4 font-bold">Available Stock</th>
                  <th className="p-4 font-bold">Approval Status</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 flex items-center space-x-3 min-w-[220px]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-contain rounded-xl bg-gray-50 p-1 border border-gray-100 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-gray-900 line-clamp-1">{item.name}</div>
                        <div className="text-[10px] text-teal-700 font-semibold">{item.brand}</div>
                      </div>
                    </td>

                    <td className="p-4 text-gray-600">{item.category}</td>

                    <td className="p-4">
                      <div className="font-bold text-gray-900">{formatCurrency(item.price)}</div>
                      {item.mrp && <div className="text-[10px] text-gray-400 line-through">MRP: {formatCurrency(item.mrp)}</div>}
                    </td>

                    <td className="p-4 font-mono">
                      <div className="text-gray-900 font-bold">{item.batchNumber || 'BAT-DEF'}</div>
                      <div className="text-[10px] text-gray-500">Exp: {formatDate(item.expiryDate)}</div>
                    </td>

                    <td className="p-4">
                      {item.prescriptionRequired ? (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                          Rx Required
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                          OTC Safe
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      {editingStockId === item.id ? (
                        <div className="flex items-center space-x-1">
                          <input
                            type="number"
                            defaultValue={item.stock}
                            onChange={(e) => setNewStockVal(e.target.value)}
                            className="w-16 p-1 text-xs border rounded border-teal-600"
                          />
                          <button
                            onClick={() => handleSaveStock(item.id)}
                            className="bg-teal-700 text-white px-2 py-1 rounded text-[10px] font-bold"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1.5">
                          <span className={`font-black ${item.stock < 20 ? 'text-rose-600' : 'text-gray-900'}`}>
                            {item.stock} units
                          </span>
                          <button
                            onClick={() => {
                              setEditingStockId(item.id);
                              setNewStockVal(item.stock);
                            }}
                            className="text-gray-400 hover:text-teal-700 p-0.5"
                            title="Edit Stock"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      {item.approvalStatus === 'approved' && (
                        <span className="inline-flex items-center text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Approved &amp; Live
                        </span>
                      )}
                      {item.approvalStatus === 'pending' && (
                        <span className="inline-flex items-center text-[10px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                          <Clock className="w-3 h-3 mr-1" /> Awaiting Admin
                        </span>
                      )}
                      {item.approvalStatus === 'rejected' && (
                        <span className="inline-flex items-center text-[10px] font-extrabold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3 mr-1" /> Rejected
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      {item.approvalStatus === 'approved' ? (
                        <Link
                          to={`/products/${item.id}`}
                          className="text-teal-700 hover:underline font-bold text-xs inline-flex items-center"
                        >
                          <span>Store Preview</span>
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Link>
                      ) : (
                        <span className="text-gray-400 text-[11px]">Under Review</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500 text-xs">
            No medicine products found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
