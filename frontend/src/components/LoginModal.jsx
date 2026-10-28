import React, { useState } from 'react';
import { X, Lock, Mail, Phone, User, MapPin, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const { login, registerUser, handleAuthSuccess } = useAuth();

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupStreet, setSignupStreet] = useState('');
  const [signupCity, setSignupCity] = useState('Mumbai');
  const [signupState, setSignupState] = useState('Maharashtra');
  const [signupPincode, setSignupPincode] = useState('400058');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await login(loginEmail, loginPassword, 'user');
      if (onLoginSuccess) onLoginSuccess(res);
      else handleAuthSuccess(res);
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await login('user@example.com', 'user123', 'user');
      if (onLoginSuccess) onLoginSuccess(res);
      else handleAuthSuccess(res);
      onClose();
    } catch (err) {
      setError(err.message || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setError('Name, email, and password are required.');
      return;
    }

    if (signupPhone && signupPhone.length !== 10) {
      setError('Please provide a valid 10-digit mobile number.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: signupName.trim(),
        email: signupEmail.trim(),
        phone: signupPhone ? `+91 ${signupPhone.trim()}` : '+91 9876543210',
        password: signupPassword,
        role: 'user',
        addresses: [
          {
            id: `addr-${Date.now()}`,
            tag: 'Home',
            street: signupStreet || 'Plot 12, Sunrise Residency',
            city: signupCity || 'Mumbai',
            state: signupState || 'Maharashtra',
            pincode: signupPincode || '400001',
            isDefault: true
          }
        ]
      };

      const res = await registerUser(payload);
      if (onLoginSuccess) onLoginSuccess(res);
      else handleAuthSuccess(res);
      onClose();
    } catch (err) {
      setError(err.message || 'Registration failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative flex flex-col md:flex-row border border-gray-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Flipkart-Style Brand Banner */}
        <div className="md:w-5/12 bg-gradient-to-br from-teal-800 via-teal-900 to-emerald-950 p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl"></div>

          <div>
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/10 text-teal-200 text-[11px] font-semibold backdrop-blur-xs mb-4">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Customer Portal</span>
            </span>

            <h3 className="text-2xl font-black tracking-tight leading-tight">
              {activeTab === 'login' ? 'Login' : "Looks like you're new here!"}
            </h3>
            <p className="text-xs text-teal-100/80 mt-2 leading-relaxed">
              {activeTab === 'login'
                ? 'Get access to your Orders, Cart, Saved Addresses & 100% genuine medicine deliveries.'
                : 'Sign up with your mobile and details to start ordering authentic medicines directly from verified pharmacies.'}
            </p>
          </div>

          <div className="pt-6 border-t border-teal-700/40 space-y-2 text-[11px] text-teal-200/90">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Genuine Pharmacy Guarantee</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Real-Time Live Order Tracking</span>
            </div>
          </div>
        </div>

        {/* Right Auth Forms Section */}
        <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            {/* Tab Switcher */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setError(''); }}
                className={`flex-1 pb-3 text-xs font-bold transition border-b-2 text-center cursor-pointer ${
                  activeTab === 'login'
                    ? 'border-teal-700 text-teal-800'
                    : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('signup'); setError(''); }}
                className={`flex-1 pb-3 text-xs font-bold transition border-b-2 text-center cursor-pointer ${
                  activeTab === 'signup'
                    ? 'border-teal-700 text-teal-800'
                    : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                Create Account (Sign Up)
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                {error}
              </div>
            )}

            {/* LOGIN FORM */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. user@example.com"
                      className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs rounded-xl transition shadow-md shadow-teal-700/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <span>Continue &amp; Log In</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                {/* 1-Click Demo Login */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleQuickDemoLogin}
                    disabled={loading}
                    className="w-full py-2.5 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>⚡ 1-Click Demo Login (Rohan Sharma)</span>
                  </button>
                </div>
              </form>
            )}

            {/* SIGNUP FORM */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="e.g. Rahul Verma"
                      className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="10 digit number"
                        className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="you@email.com"
                        className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600 transition"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                    Create Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600 transition"
                    />
                  </div>
                </div>

                {/* Delivery Address fields */}
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  <div className="text-[11px] font-bold text-gray-700 uppercase flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-700" />
                    <span>Primary Delivery Address</span>
                  </div>

                  <input
                    type="text"
                    required
                    value={signupStreet}
                    onChange={(e) => setSignupStreet(e.target.value)}
                    placeholder="House / Flat No, Street, Landmark"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />

                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      required
                      value={signupCity}
                      onChange={(e) => setSignupCity(e.target.value)}
                      placeholder="City"
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 bg-white"
                    />
                    <input
                      type="text"
                      required
                      value={signupState}
                      onChange={(e) => setSignupState(e.target.value)}
                      placeholder="State"
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 bg-white"
                    />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={signupPincode}
                      onChange={(e) => setSignupPincode(e.target.value.replace(/\D/g, ''))}
                      placeholder="Pincode"
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs rounded-xl transition shadow-md shadow-teal-700/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <span>Create Account &amp; Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Bottom Flip text */}
          <div className="mt-5 text-center text-xs text-gray-500 pt-3 border-t border-gray-100">
            {activeTab === 'login' ? (
              <div>
                New to MedCart?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('signup'); setError(''); }}
                  className="font-bold text-teal-700 hover:underline cursor-pointer"
                >
                  Create an account
                </button>
              </div>
            ) : (
              <div>
                Existing user?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setError(''); }}
                  className="font-bold text-teal-700 hover:underline cursor-pointer"
                >
                  Log in
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
