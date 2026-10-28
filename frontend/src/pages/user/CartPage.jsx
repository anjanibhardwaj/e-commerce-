import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  Tag, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, showToast, coupons } = useData();
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const handleProceed = () => {
    if (!user) {
      openAuthModal(() => {
        navigate('/checkout');
      });
      return;
    }
    navigate('/checkout');
  };

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const hasRxItem = cart.some((item) => item.prescriptionRequired);

  const totalMrp = cart.reduce((acc, item) => acc + (item.mrp || item.price) * item.quantity, 0);
  const totalSelling = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountMrp = totalMrp - totalSelling;

  let couponDiscount = 0;
  if (appliedCoupon) {
    couponDiscount = Math.min(
      Math.round((totalSelling * appliedCoupon.discountPercent) / 100),
      appliedCoupon.maxDiscount
    );
  }

  const deliveryFee = totalSelling > 499 || totalSelling === 0 ? 0 : 49;
  const finalAmount = Math.max(0, totalSelling - couponDiscount + deliveryFee);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const match = (coupons || []).find(
      (c) => c.code?.toLowerCase() === couponCode.trim().toLowerCase()
    );
    if (match) {
      const minOrder = match.minOrder || match.minOrderValue || 0;
      if (totalSelling >= minOrder) {
        setAppliedCoupon({
          code: match.code,
          discountPercent: match.discountPercent || match.value || 0,
          maxDiscount: match.maxDiscount || 500
        });
        showToast(`Coupon ${match.code} applied! Saved extra!`, 'success');
      } else {
        setCouponError(`Minimum order value for ${match.code} is ₹${minOrder}`);
      }
    } else {
      setCouponError('Invalid coupon code. Try PHARMEASY50 or FIRST25');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-20 h-20 bg-teal-50 text-teal-700 rounded-3xl mx-auto flex items-center justify-center border border-teal-100 shadow-sm">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">Your Medicine Cart is Empty</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Add vitamins, supplements, medicines, or health checkups to your basket to proceed.
        </p>
        <div>
          <Link
            to="/products"
            className="inline-block bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition shadow-md shadow-teal-700/20"
          >
            Explore Health Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Shopping Cart</h1>
        <p className="text-xs text-gray-500 mt-0.5">{cart.length} item(s) ready for checkout</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Cart Items & Prescription Alert */}
        <div className="lg:col-span-2 space-y-4">
          {hasRxItem && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-3 text-xs text-amber-900">
              <FileText className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Prescription Required Notice:</strong> Your cart includes one or more prescription medicines. You will be requested to upload a doctor's prescription during the next checkout step.
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-xs">
            {cart.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain bg-gray-50 rounded-xl p-1 border border-gray-100 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    {item.prescriptionRequired && (
                      <span className="text-[9px] font-extrabold bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-200">
                        Rx Required
                      </span>
                    )}
                    <span className="text-[10px] text-teal-700 font-bold uppercase truncate">
                      {item.brand || 'Healthcare'}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-2 mt-0.5">
                    {item.name}
                  </h3>

                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm font-black text-gray-900">
                      {formatCurrency(item.price)}
                    </span>
                    {item.mrp && item.mrp > item.price && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatCurrency(item.mrp)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity adjustments */}
                <div className="flex flex-col items-end space-y-2 shrink-0">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-200 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-gray-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-200 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-rose-500 hover:text-rose-700 flex items-center space-x-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Order Summary & Coupon */}
        <div className="space-y-4">
          {/* Coupon Box */}
          <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center">
              <Tag className="w-3.5 h-3.5 mr-1.5 text-teal-700" />
              Apply Promo Coupon
            </h3>

            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="HEALTH20"
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono uppercase"
              />
              <button
                type="submit"
                className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
              >
                Apply
              </button>
            </form>

            {appliedCoupon && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
                <span>Applied <strong>{appliedCoupon.code}</strong> (-₹{couponDiscount})</span>
                <button
                  onClick={() => setAppliedCoupon(null)}
                  className="text-xs text-rose-600 font-bold hover:underline"
                >
                  Remove
                </button>
              </div>
            )}

            {couponError && (
              <p className="text-xs text-rose-600 font-medium">{couponError}</p>
            )}
          </div>

          {/* Pricing Breakdown */}
          <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider pb-2 border-b border-gray-100">
              Order Bill Summary
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Total Items MRP</span>
                <span>{formatCurrency(totalMrp)}</span>
              </div>

              {discountMrp > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Catalog Discount</span>
                  <span>- {formatCurrency(discountMrp)}</span>
                </div>
              )}

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Promo Coupon Discount</span>
                  <span>- {formatCurrency(couponDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Delivery Charges</span>
                <span>{deliveryFee === 0 ? <strong className="text-emerald-600 uppercase">FREE</strong> : formatCurrency(deliveryFee)}</span>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-between text-base font-black text-gray-900">
                <span>Total Amount to Pay</span>
                <span>{formatCurrency(finalAmount)}</span>
              </div>
            </div>

            <button
              onClick={handleProceed}
              className="w-full py-3.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-black text-sm rounded-xl transition shadow-lg shadow-teal-700/20 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center space-x-2 text-[10px] text-gray-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>Safe &amp; Secure 256-bit Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
