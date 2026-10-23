import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';
import demoData from '../../data/demoUsers.json';

export default function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const demoAdmin = demoData.admins[0]; // Platform Administrator (admin@example.com / admin123)

  const handleQuickFill = () => {
    setEmail(demoAdmin.email);
    setPassword(demoAdmin.password);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      await login(email, password, 'admin');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Admin authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#061919]">
      <div className="max-w-md w-full space-y-6">
        <div className="bg-[#0b2423] rounded-3xl shadow-2xl border border-teal-900/60 overflow-hidden text-white">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-950 via-[#0b2423] to-[#0f3231] p-8 text-center border-b border-teal-900/40 relative">
            <div className="w-16 h-16 bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-2xl mx-auto flex items-center justify-center mb-3">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">Admin Command Center</h2>
            <p className="text-xs text-teal-300 mt-1">
              Authorized Healthcare Compliance &amp; Platform Operations Portal
            </p>
          </div>

          <div className="p-8 pt-6 space-y-6">
            {/* Demo Quick Fill */}
            <div className="bg-teal-950/80 border border-teal-800/60 rounded-2xl p-4 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-amber-300 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  Administrator Credentials
                </span>
                <span className="bg-amber-950 text-amber-300 border border-amber-800 font-extrabold px-2 py-0.5 rounded-full text-[10px]">
                  SuperAdmin
                </span>
              </div>
              <p className="text-slate-300 text-[11px] mb-2">
                Log in to review seller licenses, approve medicines &amp; verify prescriptions:
              </p>
              <div className="flex items-center justify-between bg-[#071d1c] p-2.5 rounded-xl border border-teal-900">
                <div className="text-[11px] font-mono text-slate-300">
                  <div><strong>Email:</strong> {demoAdmin.email}</div>
                  <div><strong>Pass:</strong> {demoAdmin.password}</div>
                </div>
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-3 py-1.5 rounded-lg transition cursor-pointer"
                >
                  Quick Fill
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-950/60 border border-rose-800 rounded-xl text-xs font-semibold text-rose-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#061919] border border-teal-900 focus:outline-none focus:border-amber-400 text-sm text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Security Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#061919] border border-teal-900 focus:outline-none focus:border-amber-400 text-sm text-white placeholder-slate-500"
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
                className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-sm rounded-xl transition shadow-lg flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <span>Authenticating Session...</span> : <span>Enter Admin Command Center</span>}
              </button>
            </form>

            <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-xl flex items-start space-x-2 text-[10px] text-amber-200/80">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Administrative access is monitored and logged in compliance with clinical privacy standards.
              </span>
            </div>
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-500 space-x-4">
          <Link to="/" className="text-slate-400 hover:text-white underline">
            &larr; Customer Storefront
          </Link>
          <span>|</span>
          <Link to="/seller/login" className="text-slate-400 hover:text-white underline">
            Seller Hub &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
