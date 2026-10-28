import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import apiClient from '../../services/apiClient';
import { 
  ShieldCheck, 
  Truck, 
  FileText, 
  AlertCircle, 
  Star, 
  CheckCircle2, 
  Calendar, 
  Store, 
  ArrowLeft,
  ShoppingCart,
  Zap,
  Plus,
  Minus
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, cart, addToCart, showToast } = useData();

  const [quantity, setQuantity] = useState(1);
  const [fetchedProduct, setFetchedProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const product = products.find((p) => (p.id || p._id) === id) || fetchedProduct;

  useEffect(() => {
    if (!products.some((p) => (p.id || p._id) === id)) {
      setLoading(true);
      apiClient.get(`/products/${id}`)
        .then((res) => {
          if (res?.success && res.data) {
            setFetchedProduct(res.data);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id, products]);

  if (!product) {
    if (loading) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-gray-700">Loading live product details from database...</p>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Product Not Found</h2>
        <p className="text-xs text-gray-500">The healthcare product you requested does not exist or may have been delisted.</p>
        <Link to="/products" className="inline-block bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl">
          Browse Medicine Catalog
        </Link>
      </div>
    );
  }

  const inCart = cart.find((item) => (item.id || item._id) === (product.id || product._id));
  const relatedProducts = products
    .filter((p) => p.category === product.category && (p.id || p._id) !== (product.id || product._id) && (!p.approvalStatus || p.approvalStatus === 'approved'))
    .slice(0, 4);

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center space-x-2 text-xs text-gray-500">
        <Link to="/" className="hover:text-teal-700">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-teal-700">Medicines</Link>
        <span>/</span>
        <span className="text-teal-700 font-semibold truncate max-w-[200px]">{product.name}</span>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column: Image & Authenticity Badges */}
        <div className="space-y-6">
          <div className="w-full h-80 sm:h-96 bg-gray-50 rounded-2xl p-6 flex items-center justify-center border border-gray-100 relative">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
            />
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 bg-amber-400 text-amber-950 font-black text-xs px-2.5 py-1 rounded-lg shadow-xs">
                {product.discount}% SAVINGS
              </span>
            )}
          </div>

          {/* Clinical Assurance Badges */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-teal-50/60 border border-teal-100 rounded-2xl">
              <ShieldCheck className="w-5 h-5 text-teal-700 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-gray-800">100% Genuine</div>
              <div className="text-[9px] text-gray-500">Direct from certified mfr</div>
            </div>
            <div className="p-3 bg-teal-50/60 border border-teal-100 rounded-2xl">
              <Truck className="w-5 h-5 text-teal-700 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-gray-800">Cold Chain Safe</div>
              <div className="text-[9px] text-gray-500">Temperature monitored</div>
            </div>
            <div className="p-3 bg-teal-50/60 border border-teal-100 rounded-2xl">
              <Store className="w-5 h-5 text-teal-700 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-gray-800">Licensed Seller</div>
              <div className="text-[9px] text-gray-500">Form 20/21 verified</div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Prescription advisory, Seller info & Actions */}
        <div className="space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                {product.brand}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 mt-1 leading-snug">
                {product.name}
              </h1>
              <div className="flex items-center space-x-3 mt-2 text-xs">
                <span className="flex items-center bg-emerald-50 text-emerald-700 font-extrabold px-2 py-0.5 rounded-md border border-emerald-200">
                  <Star className="w-3.5 h-3.5 fill-emerald-500 mr-1" />
                  {product.rating || '4.8'}
                </span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-500">{product.reviewsCount || 180} Verified Patient Ratings</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 flex items-baseline space-x-3">
              <span className="text-2xl font-black text-gray-900">
                {formatCurrency(product.price)}
              </span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-sm text-gray-400 line-through">
                  MRP {formatCurrency(product.mrp)}
                </span>
              )}
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Inclusive of all taxes
              </span>
            </div>

            {/* Prescription Advisory Banner */}
            {product.prescriptionRequired ? (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-xs text-rose-800">
                <FileText className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Prescription Required (Rx):</strong> As per clinical pharmaceutical regulations, this medicine requires a valid doctor's prescription. You will be prompted to attach it at checkout.
                </div>
              </div>
            ) : (
              <div className="p-2.5 bg-teal-50 border border-teal-100 rounded-xl flex items-center space-x-2 text-xs text-teal-800">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Over-the-Counter (OTC) medicine. No doctor prescription mandatory.</span>
              </div>
            )}

            {/* Batch & Expiry and Seller details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-gray-200 bg-white">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Batch &amp; Expiry</span>
                <span className="font-mono text-gray-800 font-semibold">{product.batchNumber || 'BAT-9921'}</span>
                <div className="text-[10px] text-gray-500 mt-0.5">Exp: {formatDate(product.expiryDate)}</div>
              </div>

              <div className="p-3 rounded-xl border border-gray-200 bg-white">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Fulfillment Partner</span>
                <span className="text-gray-800 font-semibold truncate block">
                  {product.sellerName || 'Apollo Care Pharmacy'}
                </span>
                <div className="text-[10px] text-emerald-600 font-bold mt-0.5">Verified Supplier ✓</div>
              </div>
            </div>

            {/* Usage & Description */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Product Information</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {product.description || 'Scientifically formulated health supplement supporting overall daily wellbeing.'}
              </p>
              {product.dosage && (
                <div className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <strong>Dosage / Instructions:</strong> {product.dosage}
                </div>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-gray-200 space-y-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 text-gray-600 hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-xs font-bold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 text-gray-600 hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => addToCart(product, quantity)}
                className="flex-1 py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs rounded-xl transition shadow-md shadow-teal-700/20 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add {quantity} to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition shadow-md flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12 space-y-4">
          <h2 className="text-lg font-black text-gray-900">Similar Healthcare Essentials</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigate(`/products/${rel.id}`)}
                className="bg-white p-4 rounded-2xl border border-gray-200 hover:border-teal-400 hover:shadow-lg transition cursor-pointer"
              >
                <img src={rel.image} alt={rel.name} className="w-full h-32 object-contain mb-2" />
                <h3 className="text-xs font-bold text-gray-800 line-clamp-1">{rel.name}</h3>
                <div className="text-xs font-extrabold text-teal-700 mt-1">₹{rel.price}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
