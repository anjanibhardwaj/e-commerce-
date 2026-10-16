import React, { useState } from 'react';
import { X, Phone, Lock, CheckCircle2, User, ShieldCheck } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, currentUser, onLogout }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e) => {
    e.preventDefault();
    setError('');
    if (phone.length === 10) {
      setStep('otp');
    } else {
      setError('Please enter a valid 10-digit mobile number');
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError('');
    if (otp.length === 4 || otp === '1234') {
      onLoginSuccess({
        name: "Rohan Sharma",
        phone: `+91 ${phone}`,
        email: "rohan.sharma@example.com",
        isPlusMember: true
      });
      onClose();
    } else {
      setError('Invalid OTP. Use demo OTP: 1234');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Banner Graphic */}
        <div className="bg-gradient-to-r from-teal-700 to-emerald-700 p-6 text-white text-center relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-14 h-14 bg-white/20 backdrop-blur-xs rounded-2xl mx-auto flex items-center justify-center mb-2 shadow-inner">
            <User className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold">
            {currentUser ? "My PharmEasy Account" : "Quick Login / Register"}
          </h3>
          <p className="text-xs text-teal-100 mt-1">
            Access past orders, prescription refills &amp; Plus rewards
          </p>
        </div>

        <div className="p-6">
          {currentUser ? (
            <div className="space-y-4">
              <div className="bg-teal-50 p-4 rounded-2xl border border-teal-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase">Logged In As</span>
                  <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                    PLUS VIP
                  </span>
                </div>
                <div className="text-base font-extrabold text-gray-800">{currentUser.name}</div>
                <div className="text-xs text-gray-600">{currentUser.phone}</div>
                <div className="text-xs text-gray-600">{currentUser.email}</div>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <button 
                  onClick={onLogout}
                  className="w-full py-2.5 px-4 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            </div>
          ) : step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                  Enter Your Mobile Number
                </label>
                <div className="flex rounded-xl border border-gray-300 overflow-hidden focus-within:border-teal-600">
                  <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-2.5 flex items-center border-r border-gray-300">
                    +91
                  </span>
                  <input 
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="10 digit mobile number"
                    className="w-full text-sm px-3 py-2.5 focus:outline-none"
                    autoFocus
                  />
                </div>
                {error && <p className="text-xs text-rose-600 font-medium mt-1">{error}</p>}
              </div>

              <button 
                type="submit"
                disabled={phone.length !== 10}
                className="w-full bg-teal-700 hover:bg-teal-800 disabled:bg-gray-300 text-white font-bold py-3 px-4 rounded-xl text-sm transition shadow-sm cursor-pointer"
              >
                Send OTP
              </button>

              <div className="text-center text-[11px] text-gray-500 pt-2">
                By logging in, you agree to PharmEasy's Terms and Conditions &amp; Privacy Policy.
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center mb-2">
                <span className="text-xs text-gray-600">
                  Enter 4-digit OTP sent to <strong className="text-gray-900">+91 {phone}</strong>
                </span>
                <button 
                  type="button" 
                  onClick={() => setStep('phone')} 
                  className="text-xs text-teal-700 font-bold block mx-auto mt-0.5 hover:underline"
                >
                  Change number
                </button>
              </div>

              <div>
                <input 
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 4-digit OTP (e.g. 1234)"
                  className="w-full text-center text-lg tracking-widest font-black py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600"
                  autoFocus
                />
                {error && <p className="text-xs text-rose-600 font-medium mt-1 text-center">{error}</p>}
                <p className="text-[11px] text-gray-400 text-center mt-1">Hint: Type 1234 for quick verification</p>
              </div>

              <button 
                type="submit"
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 px-4 rounded-xl text-sm transition shadow-sm cursor-pointer"
              >
                Verify &amp; Continue
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
