import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Search, 
  ShieldCheck, 
  Clock, 
  Store 
} from 'lucide-react';

export default function AdminSellersPage() {
  const { user } = useAuth();
  const { sellers, approveSeller, rejectSeller, suspendSeller } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [inspectSeller, setInspectSeller] = useState(null);

  const filtered = sellers.filter((s) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = s.name?.toLowerCase().includes(q) || s.licenseNumber?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filterStatus !== 'all' && s.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-900">Seller Licensing &amp; Pharmacy Verifications</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Audit Form 20/21 pharmacy drug licenses and approve retail vendors ({sellers.length} suppliers)
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
            placeholder="Search by pharmacy name, license no., or email..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 font-semibold">Verification:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs font-bold text-gray-800 p-1.5 rounded-xl border border-gray-300 bg-white"
          >
            <option value="all">All Sellers</option>
            <option value="pending">Pending Verification</option>
            <option value="approved">Approved &amp; Licensed</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Sellers Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-gray-500 uppercase text-[10px] border-b border-gray-200">
              <tr>
                <th className="p-4 font-bold">Pharmacy Name</th>
                <th className="p-4 font-bold">Drug License No.</th>
                <th className="p-4 font-bold">Contact Person</th>
                <th className="p-4 font-bold">Location</th>
                <th className="p-4 font-bold">Verification Status</th>
                <th className="p-4 font-bold text-right">Compliance Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((seller) => (
                <tr key={seller.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-4 flex items-center space-x-3 min-w-[200px]">
                    <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{seller.name}</div>
                      <div className="text-[10px] text-gray-400">{seller.email}</div>
                    </div>
                  </td>

                  <td className="p-4 font-mono font-bold text-gray-900">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-gray-200">
                      {seller.licenseNumber || 'FORM-20B-PENDING'}
                    </span>
                    {seller.gstin && <div className="text-[10px] text-gray-400 mt-0.5">GST: {seller.gstin}</div>}
                  </td>

                  <td className="p-4">
                    <div className="text-gray-900 font-semibold">{seller.contactPerson}</div>
                    <div className="text-[10px] text-gray-500">{seller.phone}</div>
                  </td>

                  <td className="p-4 text-gray-600">
                    {seller.city || 'Mumbai'}
                  </td>

                  <td className="p-4">
                    {seller.status === 'approved' && (
                      <span className="inline-flex items-center text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                      </span>
                    )}
                    {seller.status === 'pending' && (
                      <span className="inline-flex items-center text-[10px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                        <Clock className="w-3 h-3 mr-1" /> Pending Review
                      </span>
                    )}
                    {seller.status === 'suspended' && (
                      <span className="inline-flex items-center text-[10px] font-extrabold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                        <XCircle className="w-3 h-3 mr-1" /> Suspended
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-right space-x-2">
                    {seller.status === 'pending' && (
                      <>
                        <button
                          onClick={() => approveSeller(seller.id, user?.email)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-xs"
                        >
                          Approve License ✓
                        </button>
                        <button
                          onClick={() => rejectSeller(seller.id, user?.email)}
                          className="px-2.5 py-1.5 bg-gray-100 hover:bg-rose-50 text-gray-600 hover:text-rose-700 font-bold text-xs rounded-xl transition cursor-pointer"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {seller.status === 'approved' && (
                      <button
                        onClick={() => suspendSeller(seller.id, user?.email)}
                        className="px-3 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                      >
                        Suspend
                      </button>
                    )}

                    {seller.status === 'suspended' && (
                      <button
                        onClick={() => approveSeller(seller.id, user?.email)}
                        className="px-3 py-1 text-xs font-bold text-teal-700 hover:bg-teal-50 rounded-xl transition cursor-pointer"
                      >
                        Reactivate
                      </button>
                    )}
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
