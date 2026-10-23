import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, MapPin, CreditCard, Banknote, Sparkles } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, orderDetails, onOrderPlaced, selectedCity }) {
  const [address, setAddress] = useState('Flat 402, Sunshine Heights, Linking Road');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!isOpen || !orderDetails) return null;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const id = "PE-" + Math.floor(100000 + Math.random() * 900000);
    setOrderId(id);
    setOrderComplete(true);
    if (onOrderPlaced) onOrderPlaced(id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-teal-800 text-white">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-teal-200" />
            <h3 className="text-base font-bold">
              {orderComplete ? "Order Placed Successfully!" : "Secure Healthcare Checkout"}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/80 hover:text-white p-1 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {orderComplete ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                  ORDER ID: {orderId}
                </span>
                <h4 className="text-xl font-black text-gray-900 mt-2">
                  Thank You for Ordering with PharmEasy!
                </h4>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Your prescription and items are being verified by our registered pharmacist. You will receive an SMS confirmation shortly.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivering to:</span>
                  <span className="font-semibold text-gray-800">{selectedCity ? selectedCity.name : "Mumbai"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Estimated Delivery:</span>
                  <span className="font-semibold text-emerald-700">Tomorrow by 11:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Paid / Payable:</span>
                  <span className="font-extrabold text-gray-900">₹{orderDetails.totalAmount}</span>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              {/* Delivery Address */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                  1. Delivery Address
                </label>
                <div className="p-3 rounded-xl border border-gray-300 bg-gray-50 text-xs">
                  <div className="flex items-center text-gray-800 font-semibold mb-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-700 mr-1 shrink-0" />
                    <span>{selectedCity ? `${selectedCity.name} (${selectedCity.pincode})` : "Mumbai, 400001"}</span>
                  </div>
                  <input 
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House/Flat No., Building, Street Name"
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-teal-600 mt-1"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                  2. Choose Payment Method
                </label>
                <div className="space-y-2 text-xs">
                  <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                    paymentMethod === 'cod' ? 'border-teal-600 bg-teal-50/60' : 'border-gray-200 hover:bg-gray-50'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <Banknote className="w-4 h-4 text-emerald-700" />
                      <div>
                        <div className="font-semibold text-gray-900">Cash on Delivery (COD)</div>
                        <div className="text-[10px] text-gray-500">Pay at your doorstep after inspecting the medicines</div>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'cod'} 
                      onChange={() => setPaymentMethod('cod')}
                      className="text-teal-700"
                    />
                  </label>

                  <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                    paymentMethod === 'upi' ? 'border-teal-600 bg-teal-50/60' : 'border-gray-200 hover:bg-gray-50'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-teal-700" />
                      <div>
                        <div className="font-semibold text-gray-900">UPI / QR (GPay, PhonePe, Paytm)</div>
                        <div className="text-[10px] text-gray-500">Fast &amp; contactless payment</div>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'upi'} 
                      onChange={() => setPaymentMethod('upi')}
                      className="text-teal-700"
                    />
                  </label>
                </div>
              </div>

              {/* Amount payable banner */}
              <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-500">Payable Amount:</span>
                  <span className="text-base font-black text-gray-900 ml-2">₹{orderDetails.totalAmount}</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  GENUINE GUARANTEE
                </span>
              </div>

              <button 
                type="submit"
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-extrabold py-3.5 rounded-xl text-sm transition shadow-lg cursor-pointer"
              >
                Place Order (₹{orderDetails.totalAmount})
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
