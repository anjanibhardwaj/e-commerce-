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
  Plus,
  Trash2,
  Image as ImageIcon,
  ShieldCheck,
  X
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function AdminProductsPage() {
  const { user } = useAuth();
  const { products, categories, approveProduct, rejectProduct, deleteProduct, addProduct, showToast } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // default to all so admin sees whole catalog!

  // Add Product Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newBrand, setNewBrand] = useState('Certified Healthcare');
  const [newCategory, setNewCategory] = useState(categories[0]?.name || 'Vitamins & Supplements');
  const [newMrp, setNewMrp] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('100');
  const [newBatch, setNewBatch] = useState(`BAT-${Math.floor(10000 + Math.random() * 90000)}`);
  const [newExpiry, setNewExpiry] = useState('2028-12-31');
  const [newRx, setNewRx] = useState(false);
  const [newImg, setNewImg] = useState('https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80');
  const [newDesc, setNewDesc] = useState('');

  const sampleImages = [
    { label: 'Bottles / Supplements', url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80' },
    { label: 'Tablets / Blister', url: 'https://images.unsplash.com/photo-1580281657527-47f249e8f4df?w=500&auto=format&fit=crop&q=80' },
    { label: 'Capsules', url: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?w=500&auto=format&fit=crop&q=80' },
    { label: 'Syrup / Tonic', url: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=500&auto=format&fit=crop&q=80' },
    { label: 'Healthcare Device', url: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500&auto=format&fit=crop&q=80' },
    { label: 'Skincare / Tube', url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80' }
  ];

  const filtered = products.filter((p) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match =
        p.name?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.sellerName?.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filterStatus !== 'all' && (p.approvalStatus || 'approved') !== filterStatus) return false;
    return true;
  });

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newMrp || !newPrice) {
      showToast('Name, MRP, and selling price are required.', 'error');
      return;
    }

    if (Number(newPrice) > Number(newMrp)) {
      showToast('Selling price cannot exceed MRP.', 'error');
      return;
    }

    await addProduct(
      {
        name: newName.trim(),
        brand: newBrand.trim(),
        category: newCategory,
        mrp: Number(newMrp),
        price: Number(newPrice),
        stock: Number(newStock) || 100,
        batchNumber: newBatch,
        expiryDate: newExpiry,
        prescriptionRequired: newRx,
        dosage: 'As directed by physician',
        description: newDesc || `${newName} certified authentic medicine with quality batch assurance.`,
        image: newImg
      },
      { id: user?.id || 'admin-master', name: user?.name || 'Platform Administrator' }
    );

    setIsAddModalOpen(false);
    setNewName('');
    setNewMrp('');
    setNewPrice('');
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete "${name}" from catalog?`)) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-900">Medicine Catalog &amp; Approvals</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Full platform-wide governance over all pharmacy listings ({products.length} medicines in database)
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Medicine to Catalog</span>
        </button>
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
            <option value="all">All Products ({products.length})</option>
            <option value="approved">Approved &amp; Active</option>
            <option value="pending">Pending Approval</option>
            <option value="rejected">Rejected Listings</option>
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
                  <th className="p-4 font-bold">Type</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Admin Control Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item) => {
                  const targetId = item.id || item._id;

                  return (
                    <tr key={targetId} className="hover:bg-slate-50/80 transition">
                      <td className="p-4 flex items-center space-x-3 min-w-[240px]">
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
                        <div className="font-bold text-gray-800">{item.sellerName || 'Apollo Care Pharmacy'}</div>
                        <div className="text-[10px] text-gray-400 font-mono">ID: {String(item.sellerId || 'std').slice(0, 10)}</div>
                      </td>

                      <td className="p-4">
                        <div className="font-black text-gray-900">{formatCurrency(item.price)}</div>
                        <div className="text-[10px] text-gray-400 line-through">{formatCurrency(item.mrp)}</div>
                      </td>

                      <td className="p-4">
                        <div className="font-mono text-[11px] font-bold text-gray-700">{item.batchNumber || 'BAT-VERIFIED'}</div>
                        <div className="text-[10px] text-gray-400">Exp: {formatDate(item.expiryDate || '2028-12-31')}</div>
                      </td>

                      <td className="p-4">
                        {item.prescriptionRequired ? (
                          <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            Rx Prescription
                          </span>
                        ) : (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            OTC Wellness
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.approvalStatus === 'approved' || !item.approvalStatus
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : item.approvalStatus === 'rejected'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {(item.approvalStatus || 'approved').toUpperCase()}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {item.approvalStatus === 'pending' && (
                            <>
                              <button
                                onClick={() => approveProduct(targetId, user?.email)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg transition flex items-center space-x-1 cursor-pointer"
                                title="Approve Listing"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => rejectProduct(targetId, user?.email, 'Quality audit rejection')}
                                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[10px] rounded-lg transition flex items-center space-x-1 cursor-pointer"
                                title="Reject Listing"
                              >
                                <XCircle className="w-3 h-3" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => handleDelete(targetId, item.name)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-700 rounded-lg transition cursor-pointer"
                            title="Delete medicine from platform catalog"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500 text-xs">
            No products match the selected search or filter.
          </div>
        )}
      </div>

      {/* ADD MEDICINE MODAL FOR ADMIN */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-black text-gray-900">
                Add New Medicine (Admin / SuperAdmin Catalog)
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">
                  Medicine Name &amp; Pack Size *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Paracetamol 650mg Strip Of 15 Tablets"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">
                    Manufacturer / Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    placeholder="e.g. Sun Pharma"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">
                    Taxonomy Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id || c._id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">
                    MRP (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newMrp}
                    onChange={(e) => setNewMrp(e.target.value)}
                    placeholder="100"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="80"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">
                    Initial Stock *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300"
                  />
                </div>
              </div>

              {/* Preset Image Options */}
              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">
                  Product Image Preset
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {sampleImages.map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => setNewImg(s.url)}
                      className={`p-2 rounded-xl border text-[10px] font-bold transition text-left flex items-center space-x-1.5 cursor-pointer ${
                        newImg === s.url ? 'border-teal-700 bg-teal-50 text-teal-800' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <img src={s.url} alt="" className="w-6 h-6 object-cover rounded" />
                      <span className="truncate">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prescription Toggle */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="adminRxCheck"
                  checked={newRx}
                  onChange={(e) => setNewRx(e.target.checked)}
                  className="rounded text-teal-700 focus:ring-teal-700"
                />
                <label htmlFor="adminRxCheck" className="text-xs font-bold text-gray-800 cursor-pointer">
                  Requires Doctor Prescription (Schedule H/X)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Add Medicine to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
