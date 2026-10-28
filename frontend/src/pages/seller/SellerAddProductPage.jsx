import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  PlusCircle, 
  ArrowLeft, 
  FileText, 
  Image as ImageIcon, 
  ShieldCheck, 
  AlertCircle,
  Calendar,
  Layers,
  DollarSign
} from 'lucide-react';

export default function SellerAddProductPage() {
  const { user } = useAuth();
  const { addProduct, categories, showToast } = useData();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [brand, setBrand] = useState(user?.name || 'Apollo Pharma');
  const [category, setCategory] = useState(categories[0]?.name || 'Prescription Medicines');
  const [mrp, setMrp] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('50');
  const [batchNumber, setBatchNumber] = useState(`BAT-${Math.floor(1000 + Math.random() * 9000)}`);
  const [expiryDate, setExpiryDate] = useState('2027-12-31');
  const [prescriptionRequired, setPrescriptionRequired] = useState(false);
  const [dosage, setDosage] = useState('Take 1 tablet after meals or as directed by doctor');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80');
  const [error, setError] = useState('');

  // Sample medical image presets for quick testing
  const sampleImages = [
    { label: 'Tablets / Capsules', url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80' },
    { label: 'Syrup / Tonic', url: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=500&auto=format&fit=crop&q=60' },
    { label: 'Healthcare Device', url: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500&auto=format&fit=crop&q=60' },
    { label: 'Ointment / Gel', url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=60' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (Number(price) > Number(mrp)) {
      setError('Selling price cannot exceed MRP.');
      return;
    }

    // Expiry validation: cannot be within 60 days
    const exp = new Date(expiryDate);
    const sixtyDaysAhead = new Date();
    sixtyDaysAhead.setDate(sixtyDaysAhead.getDate() + 60);

    if (exp <= sixtyDaysAhead) {
      setError('Regulatory Compliance Notice: Medicines expiring within 60 days cannot be listed for sale.');
      return;
    }

    addProduct({
      name,
      brand,
      category,
      mrp: Number(mrp),
      price: Number(price),
      stock: Number(stock),
      batchNumber,
      expiryDate,
      prescriptionRequired,
      dosage,
      description: description || `${name} supplied by ${user?.name}. Guaranteed genuine with cold-chain storage standards.`,
      image
    }, user);

    navigate('/seller/products');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
        <Link
          to="/seller/products"
          className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-gray-900">List New Healthcare Product</h1>
          <p className="text-xs text-gray-500">
            Submit medicine specifications and batch verification for Admin safety review
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-700 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Section 1: Basic Identifiers */}
        <div>
          <h2 className="text-xs font-black text-teal-800 uppercase tracking-wider mb-3 flex items-center">
            <Layers className="w-3.5 h-3.5 mr-1.5" />
            1. Medicine Identity &amp; Classification
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Full Medicine / Product Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dolo 650mg Paracetamol Strip of 15 Tablets"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Brand / Manufacturer *</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Micro Labs / Cipla / Abbott"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id || c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Stock */}
        <div className="pt-4 border-t border-gray-100">
          <h2 className="text-xs font-black text-teal-800 uppercase tracking-wider mb-3 flex items-center">
            <DollarSign className="w-3.5 h-3.5 mr-1.5" />
            2. Pricing &amp; Stock Availability
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">MRP (₹) *</label>
              <input
                type="number"
                required
                min="1"
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
                placeholder="100"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Selling Price (₹) *</label>
              <input
                type="number"
                required
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="85"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Initial Stock Units *</label>
              <input
                type="number"
                required
                min="1"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="50"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Batch, Expiry & Compliance */}
        <div className="pt-4 border-t border-gray-100">
          <h2 className="text-xs font-black text-teal-800 uppercase tracking-wider mb-3 flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            3. Batch Number, Expiry &amp; Prescription Compliance
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Batch Code *</label>
              <input
                type="text"
                required
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder="BAT-90210"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Expiry Date *</label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="sm:col-span-2 p-4 bg-slate-50 border border-gray-200 rounded-2xl">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prescriptionRequired}
                  onChange={(e) => setPrescriptionRequired(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                />
                <div>
                  <span className="text-xs font-bold text-gray-900 block">
                    Prescription Required (Schedule H / Schedule X Drug)
                  </span>
                  <span className="text-[11px] text-gray-500">
                    If checked, buyers must upload a verified doctor's prescription before checkout can be approved.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Section 4: Imagery & Usage */}
        <div className="pt-4 border-t border-gray-100">
          <h2 className="text-xs font-black text-teal-800 uppercase tracking-wider mb-3 flex items-center">
            <ImageIcon className="w-3.5 h-3.5 mr-1.5" />
            4. Product Image &amp; Clinical Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Image URL</label>
              <input
                type="url"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-[10px] text-gray-400 font-bold self-center">Presets:</span>
                {sampleImages.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImage(s.url)}
                    className="text-[10px] bg-gray-100 hover:bg-teal-50 text-gray-700 hover:text-teal-700 px-2.5 py-1 rounded-lg border border-gray-200 font-semibold"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Usage / Dosage Instructions</label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="1 capsule daily after breakfast"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Product Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe key ingredients, medical benefits, and warnings..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
          <Link to="/seller/products" className="text-xs text-gray-500 hover:text-gray-700 font-bold">
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs rounded-xl transition shadow-md shadow-teal-700/20 cursor-pointer"
          >
            Submit Listing for Admin Review &rarr;
          </button>
        </div>
      </form>
    </div>
  );
}
