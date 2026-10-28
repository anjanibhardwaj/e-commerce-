import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Tag, 
  ArrowRight, 
  ShieldCheck, 
  Truck,
  CheckCircle2
} from 'lucide-react';
import { useData } from '../context/DataContext';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout,
  selectedCity
}) {
  const { coupons } = useData();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const totalMrp = cartItems.reduce((acc, item) => acc + (item.mrp || item.price) * item.quantity, 0);
  const totalSelling = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountMrp = totalMrp - totalSelling;

  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'FLAT') {
      couponDiscount = Math.min(appliedCoupon.flatDiscount || appliedCoupon.maxDiscount || 100, totalSelling);
    } else {
      const pct = appliedCoupon.discountPercent || 20;
      couponDiscount = Math.min(
        Math.round((totalSelling * pct) / 100),
        appliedCoupon.maxDiscount || 200
      );
    }
  }

  const deliveryFee = totalSelling > 499 || totalSelling === 0 ? 0 : 49;
  const finalAmount = Math.max(0, totalSelling - couponDiscount + deliveryFee);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const activeCoupons = coupons && coupons.length > 0 ? coupons : [
      { code: 'PHARMEASY50', discountPercent: 20, minOrder: 499, maxDiscount: 200 },
      { code: 'FIRST25', discountPercent: 25, minOrder: 599, maxDiscount: 300 },
      { code: 'PLUSEXTRA', discountPercent: 15, minOrder: 299, maxDiscount: 150 },
      { code: 'HEALTH100', discountPercent: 0, flatDiscount: 100, minOrder: 799, maxDiscount: 100 }
    ];

    const found = activeCoupons.find(
      (c) => c.code.toLowerCase() === couponCode.trim().toLowerCase()
    );

    if (found) {
      if (totalSelling < (found.minOrder || 0)) {
        setCouponError(`Minimum order value for ${found.code} is ₹${found.minOrder}`);
        return;
      }
      setAppliedCoupon(found);
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon code. Try PHARMEASY50, FIRST25, or HEALTH100');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl relative">
        
        {/* Drawer Header */}
        <div className="p-4 px-6 border-b border-gray-200 flex items-center justify-between bg-teal-800 text-white">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-teal-200" />
            <h2 className="text-base font-bold">
              Your Medical Cart ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Banner */}
        <div className="bg-emerald-50 px-6 py-2.5 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-800">
          <span className="flex items-center font-medium">
            <Truck className="w-4 h-4 mr-1.5 text-emerald-600" />
            {totalSelling >= 499 
              ? "Yay! You unlocked FREE Delivery!" 
              : `Add ₹${499 - totalSelling} more for FREE Delivery`}
          </span>
          <span className="font-bold">
            {totalSelling >= 499 ? "FREE" : "₹49"}
          </span>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center text-teal-700">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h3 className="text-base font-bold text-gray-800">Your cart is empty</h3>
              <p className="text-xs text-gray-500 max-w-xs">
                Looks like you haven't added any medicines or healthcare items yet.
              </p>
              <button 
                onClick={onClose}
                className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Browse Medicines
              </button>
            </div>
          ) : (
            <>
              {/* Product rows */}
              <div className="space-y-3">
                {cartItems.map((item) => {
                  const itemId = item.id || item._id;
                  return (
                    <div 
                      key={itemId}
                      className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between space-x-3"
                    >
                      <div className="w-14 h-14 bg-white rounded-xl p-1 border border-gray-100 shrink-0 flex items-center justify-center">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-800 truncate">
                          {item.name}
                        </h4>
                        <div className="text-xs text-gray-500 mt-0.5">
                          ₹{item.price} x {item.quantity} = <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                        </div>
                      </div>

                      {/* Quantity Counter */}
                      <div className="flex items-center space-x-2 bg-white px-2 py-1 rounded-lg border border-gray-200">
                        <button 
                          onClick={() => onUpdateQuantity(itemId, item.quantity - 1)}
                          className="text-gray-500 hover:text-teal-700 p-0.5 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-gray-800 w-4 text-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => onUpdateQuantity(itemId, item.quantity + 1)}
                          className="text-gray-500 hover:text-teal-700 p-0.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button 
                        onClick={() => onRemoveItem(itemId)}
                        className="text-gray-400 hover:text-rose-600 p-1 transition cursor-pointer"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Coupon Code section */}
              <div className="pt-2">
                <div className="bg-white p-3 rounded-xl border border-dashed border-teal-300">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <Tag className="w-4 h-4 text-emerald-600" />
                        <div>
                          <span className="font-bold text-emerald-700">{appliedCoupon.code} applied!</span>
                          <span className="text-[11px] text-gray-500 block">Saved ₹{couponDiscount}</span>
                        </div>
                      </div>
                      <button 
                        onClick={handleRemoveCoupon}
                        className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                      <input 
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Apply Promo Code (e.g. PHARMEASY50)"
                        className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg uppercase tracking-wider focus:outline-none focus:border-teal-600"
                      />
                      <button 
                        type="submit"
                        className="bg-teal-700 hover:bg-teal-800 text-white px-3 py-2 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {couponError && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium">{couponError}</p>
                  )}
                </div>
              </div>

              {/* Bill Details */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2 text-xs">
                <h4 className="font-bold text-gray-800 mb-2 border-b border-gray-200 pb-1.5">
                  Bill Summary
                </h4>
                <div className="flex justify-between text-gray-600">
                  <span>Total MRP</span>
                  <span>₹{totalMrp}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount on MRP</span>
                  <span>- ₹{discountMrp}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span>- ₹{couponDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges</span>
                  <span>{deliveryFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${deliveryFee}`}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-black text-sm text-gray-900">
                  <span>To Pay</span>
                  <span className="text-teal-800">₹{finalAmount}</span>
                </div>
              </div>

              {/* Delivery address info */}
              <div className="text-[11px] text-gray-500 flex items-center justify-between p-2 bg-teal-50/50 rounded-lg border border-teal-100">
                <span>Delivering to: <strong className="text-gray-800">{selectedCity ? selectedCity.name : "Mumbai"}</strong></span>
                <span className="text-emerald-700 font-semibold">Standard 24-48h</span>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer Checkout CTA */}
        {cartItems.length > 0 && (
          <div className="p-4 px-6 border-t border-gray-200 bg-white">
            <button 
              onClick={() => onCheckout({ totalAmount: finalAmount, items: cartItems })}
              className="w-full bg-teal-700 hover:bg-teal-800 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-lg transition flex items-center justify-between cursor-pointer hover:shadow-teal-700/20"
            >
              <div className="text-left">
                <div className="text-[10px] text-teal-200 font-normal leading-none uppercase">Final Amount</div>
                <div className="text-base font-black leading-tight">₹{finalAmount}</div>
              </div>
              <div className="flex items-center space-x-1 font-bold text-sm">
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
