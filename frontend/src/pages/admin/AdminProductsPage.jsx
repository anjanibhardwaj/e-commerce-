import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  PackageCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  FileText, 
  AlertCircle,
  ExternalLink 
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function AdminProductsPage() {
  const { user } = useAuth();
  const { products, approveProduct, rejectProduct } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending'); // default to pending so admin sees action items!

  const filtered = products.filter((p) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = p.name?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q) || p.sellerName?.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filterStatus !== 'all' && p.approvalStatus !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-900">Medicine Listing Approvals</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Audit medicine batch numbers, expiry dates, and dosage safety before making products live ({products.length} total)
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
            placeholder="Search by medicine, brand, or pharmacy..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 font-semibold">Listing Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs font-bold text-gray-800 p-1.5 rounded-xl border border-gray-300 bg-white"
          >
            <option value="pending">Pending Approval (Action Items)</option>
            <option value="approved">Approved &amp; Live on Storefront</option>
            <option value="rejected">Rejected Listings</option>
            <option value="all">All Products</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-gray-500 uppercase text-[10px] border-b border-gray-200">
                <tr>
                  <th className="p-4 font-bold">Medicine Product</th>
                  <th className="p-4 font-bold">Seller Pharmacy</th>
                  <th className="p-4 font-bold">Price / MRP</th>
                  <th className="p-4 font-bold">Batch &amp; Expiry</th>
                  <th className="p-4 font-bold">Prescription Type</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Approval Decisions</th>
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
                        <div className="text-[10px] text-teal-700 font-bold">{item.brand} • {item.category}</div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-gray-800">{item.sellerName || 'Apollo Care'}</div>
                      <div className="text-[10px] text-gray-400">ID: {item.sellerId}</div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-gray-900">{formatCurrency(item.price)}</div>
                      {item.mrp && <div className="text-[10px] text-gray-400 line-through">{formatCurrency(item.mrp)}</div>}
                    </td>

                    <td className="p-4 font-mono">
                      <div className="font-bold text-gray-800">{item.batchNumber}</div>
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
                      {item.approvalStatus === 'approved' && (
                        <span className="inline-flex items-center text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Approved &amp; Live
                        </span>
                      )}
                      {item.approvalStatus === 'pending' && (
                        <span className="inline-flex items-center text-[10px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                          <Clock className="w-3 h-3 mr-1" /> Pending Admin Review
                        </span>
                      )}
                      {item.approvalStatus === 'rejected' && (
                        <span className="inline-flex items-center text-[10px] font-extrabold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3 mr-1" /> Rejected
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right space-x-2">
                      {item.approvalStatus === 'pending' && (
                        <>
                          <button
                            onClick={() => approveProduct(item.id, user?.email)}
                            className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs rounded-xl transition cursor-pointer shadow-xs"
                          >
                            Approve &amp; Make Live ✓
                          </button>
                          <button
                            onClick={() => rejectProduct(item.id, user?.email, 'Quality or batch discrepancy')}
                            className="px-2.5 py-1.5 bg-gray-100 hover:bg-rose-50 text-gray-600 hover:text-rose-700 font-bold text-xs rounded-xl transition cursor-pointer"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {item.approvalStatus === 'approved' && (
                        <button
                          onClick={() => rejectProduct(item.id, user?.email, 'Delisted by Administrator')}
                          className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                        >
                          Delist Product
                        </button>
                      )}

                      {item.approvalStatus === 'rejected' && (
                        <button
                          onClick={() => approveProduct(item.id, user?.email)}
                          className="px-2.5 py-1 text-xs font-bold text-teal-700 hover:bg-teal-50 rounded-xl transition cursor-pointer"
                        >
                          Re-approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500 text-xs">
            No products found matching the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}
