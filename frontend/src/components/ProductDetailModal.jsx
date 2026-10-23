import React, { useState } from 'react';
import { X, Star, ShieldCheck, Truck, Plus, Minus, ShoppingBag, Check } from 'lucide-react';

export default function ProductDetailModal({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart,
  cartItems = []
}) {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const inCart = cartItems.some(item => item.id === product.id);

  const handleAdd = () => {
    onAddToCart(product, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header bar */}
        <div className="p-4 px-6 border-b border-gray-100 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
            {product.category || "Healthcare"}
          </span>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Product Image */}
          <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-4 border border-gray-100 relative">
            {product.tag && (
              <span className="absolute top-3 left-3 text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-500 text-white">
                {product.tag}
              </span>
            )}
            <img 
              src={product.image} 
              alt={product.name} 
              className="max-h-56 object-contain mix-blend-multiply" 
            />
            <div className="mt-4 flex items-center space-x-2 text-[11px] text-gray-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Genuine Pharmacy Certified</span>
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {product.brand || "PharmEasy Care"}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-snug mt-1">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                  <span>{product.rating || 4.7}</span>
                  <Star className="w-3 h-3 fill-white ml-1" />
                </div>
                <span className="text-xs text-gray-500">
                  ({product.reviewsCount || 1240} ratings &amp; reviews)
                </span>
              </div>

              {/* Pricing */}
              <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-black text-gray-900">
                    ₹{product.price}
                  </span>
                  {product.mrp && product.mrp > product.price && (
                    <span className="text-xs text-gray-400 line-through">
                      MRP ₹{product.mrp}
                    </span>
                  )}
                  {product.discount > 0 && (
                    <span className="text-xs font-bold text-rose-600">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-gray-500 mt-1">
                  Inclusive of all taxes • Delivery within 24-48 hours
                </div>
              </div>

              {/* Description & Dosage */}
              <div className="mt-3 text-xs text-gray-600 space-y-1.5 leading-relaxed">
                <p>
                  <strong className="text-gray-800">Description: </strong>
                  {product.description || "Clinically tested formulation for optimal wellness and daily health maintenance."}
                </p>
                {product.dosage && (
                  <p>
                    <strong className="text-gray-800">Usage &amp; Dosage: </strong>
                    {product.dosage}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-gray-100 flex items-center space-x-3">
              <div className="flex items-center space-x-2 border border-gray-200 rounded-xl p-1 bg-white">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 text-gray-500 hover:text-teal-700 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold w-6 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 text-gray-500 hover:text-teal-700 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button 
                onClick={handleAdd}
                className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{inCart ? "Update in Cart" : "Add to Cart"}</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
