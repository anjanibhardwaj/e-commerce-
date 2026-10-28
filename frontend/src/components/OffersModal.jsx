import React, { useState } from 'react';
import { X, Percent, Tag, Copy, Check } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function OffersModal({ isOpen, onClose, onApplyCoupon }) {
  const { coupons } = useData();
  const [copiedCode, setCopiedCode] = useState(null);

  if (!isOpen) return null;

  const handleCopy = (code) => {
    setCopiedCode(code);
    navigator.clipboard?.writeText(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const displayCoupons = coupons && coupons.length > 0 ? coupons : [
    { code: 'PHARMEASY50', description: 'Get 20% OFF on orders above ₹499', minOrder: 499, maxDiscount: 200 },
    { code: 'FIRST25', description: 'Get 25% OFF on orders above ₹599', minOrder: 599, maxDiscount: 300 },
    { code: 'PLUSEXTRA', description: 'Get 15% OFF on orders above ₹299', minOrder: 299, maxDiscount: 150 },
    { code: 'HEALTH100', description: 'Flat ₹100 OFF on orders above ₹799', minOrder: 799, maxDiscount: 100 }
  ];

  const bankOffers = [
    { title: "HDFC Bank Credit Cards", desc: "Flat ₹150 instant discount on orders above ₹1200", code: "HDFC150" },
    { title: "Paytm Wallet Cashback", desc: "Up to ₹200 assured cashback on transactions above ₹799", code: "PAYTMHEALTH" },
    { title: "PharmEasy Plus Extra", desc: "5% Extra Plus cash credited directly on dispatch", code: "PLUSEXTRA" }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-teal-800 text-white">
          <div className="flex items-center space-x-2">
            <Percent className="w-5 h-5 text-teal-200" />
            <h3 className="text-base font-bold">Exclusive Deals &amp; Coupons</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/80 hover:text-white p-1 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Active Promo Codes from MongoDB Atlas */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Available Store Coupons
            </h4>

            {displayCoupons.map((coupon, idx) => (
              <div 
                key={coupon.id || coupon._id || idx}
                className="p-4 rounded-2xl border-2 border-dashed border-teal-200 bg-teal-50/50 flex items-start justify-between space-x-3"
              >
                <div>
                  <div className="inline-flex items-center space-x-1.5 bg-white border border-teal-300 px-2.5 py-1 rounded-lg text-teal-800 font-black text-xs tracking-wider">
                    <Tag className="w-3.5 h-3.5 text-teal-600" />
                    <span>{coupon.code}</span>
                  </div>
                  <p className="text-xs text-gray-700 font-semibold mt-2">
                    {coupon.description}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Min order value ₹{coupon.minOrder} • Max savings ₹{coupon.maxDiscount}
                  </p>
                </div>

                <button 
                  onClick={() => {
                    handleCopy(coupon.code);
                    if (onApplyCoupon) onApplyCoupon(coupon);
                  }}
                  className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shrink-0 cursor-pointer"
                >
                  {copiedCode === coupon.code ? "COPIED" : "APPLY"}
                </button>
              </div>
            ))}
          </div>

          {/* Bank Partner Offers */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Bank &amp; Wallet Offers
            </h4>
            {bankOffers.map((offer, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-800">{offer.title}</div>
                  <div className="text-[11px] text-gray-500">{offer.desc}</div>
                </div>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded border border-teal-200">
                  {offer.code}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
