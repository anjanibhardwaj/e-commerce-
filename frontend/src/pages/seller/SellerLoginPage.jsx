import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Store, Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles, Building2 } from 'lucide-react';
import demoData from '../../data/demoUsers.json';

export default function SellerLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const approvedSeller = demoData.sellers[0]; // Apollo Care Pharmacy (approved)
  const pendingSeller = demoData.sellers[1];  // MediLife (pending approval)

  const handleFillApproved = () => {
    setEmail(approvedSeller.email);
    setPassword(approvedSeller.password);
    setError('');
  };

  const handleFillPending = () => {
    setEmail(pendingSeller.email);
    setPassword(pendingSeller.password);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      await login(email, password, 'seller');
      navigate('/seller/dashboard');
    } catch (err) {
      setError(err.message || 'Seller login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-900">
      <div className="max-w-md w-full space-y-6">
        {/* Card */}
        <div className="bg-slate-800 rounded-3xl shadow-2xl border border-slate-700 overflow-hidden text-white">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-teal-800 to-slate-900 p-8 text-center relative border-b border-slate-700">
            <div className="w-16 h-16 bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-2xl mx-auto flex items-center justify-center mb-3">
              <Store className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black tracking-tight">Seller Merchant Portal</h2>
            <p className="text-xs text-teal-300 mt-1">
              Authorized Pharmacy &amp; Healthcare Suppliers Workspace
            </p>
          </div>

          <div className="p-8 pt-6 space-y-6">
            {/* Demo Quick-Fill Box */}
            <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-4 text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-teal-400 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  Demo Seller Accounts
                </span>
                <span className="bg-teal-950 text-teal-300 border border-teal-800 font-extrabold px-2 py-0.5 rounded-full text-[10px]">
                  Ready to test
                </span>
              </div>

              {/* Account 1: Approved */}
              <div className="flex items-center justify-between bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                <div className="text-[11px] font-mono text-slate-300">
                  <div className="text-emerald-400 font-bold">1. Verified Pharmacy</div>
                  <div>{approvedSeller.email} / {approvedSeller.password}</div>
                </div>
                <button
                  type="button"
                  onClick={handleFillApproved}
                  className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                >
                  Fill
                </button>
              </div>

              {/* Account 2: Pending Approval */}
              <div className="flex items-center justify-between bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                <div className="text-[11px] font-mono text-slate-300">
                  <div className="text-amber-400 font-bold">2. Pending Verification</div>
                  <div>{pendingSeller.email} / {pendingSeller.password}</div>
                </div>
                <button
                  type="button"
                  onClick={handleFillPending}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                >
                  Fill
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-950/60 border border-rose-800/80 rounded-xl text-xs font-semibold text-rose-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Registered Seller Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seller@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:outline-none focus:border-teal-500 text-sm text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:outline-none focus:border-teal-500 text-sm text-white placeholder-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-sm rounded-xl transition shadow-lg shadow-teal-950 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <span>Signing in...</span> : <span>Access Seller Dashboard</span>}
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-700/60 flex items-center justify-between">
              <span>New pharmacy supplier?</span>
              <Link to="/seller/register" className="font-bold text-teal-400 hover:underline">
                Apply for Seller License
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-500">
          <Link to="/" className="text-slate-400 hover:text-white underline">
            &larr; Return to Customer Shopping Front
          </Link>
        </div>
      </div>
    </div>
  );
}
