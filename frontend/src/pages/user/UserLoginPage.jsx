import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Lock, Mail, Eye, EyeOff, Pill, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import demoData from '../../data/demoUsers.json';

export default function UserLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const demoUser = demoData.users[0]; // Rohan Sharma (user@example.com / user123)

  const handleQuickFill = () => {
    setEmail(demoUser.email);
    setPassword(demoUser.password);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password, 'user');
      const origin = location.state?.from?.pathname || '/account';
      navigate(origin, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-6">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 p-8 text-white text-center relative">
            <div className="w-16 h-16 bg-white/15 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-inner">
              <Pill className="w-9 h-9 text-white" />
            </div>
            <h2 className="text-2xl font-black tracking-tight">Customer Login</h2>
            <p className="text-xs text-teal-100 mt-1">
              Access your medicine orders, prescriptions, and VIP Plus rewards
            </p>
          </div>

          <div className="p-8 pt-6 space-y-6">
            {/* Demo Quick-Fill Assistant Pill */}
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-teal-900 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-teal-700" />
                  Demo Mode Credentials
                </span>
                <span className="bg-teal-200 text-teal-900 font-extrabold px-2 py-0.5 rounded-full text-[10px]">
                  Local Demo
                </span>
              </div>
              <p className="text-gray-600 text-[11px] mb-2.5">
                Use predefined user account to test ordering and live tracking:
              </p>
              <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-teal-100">
                <div className="text-[11px] font-mono text-gray-700">
                  <div><strong>Email:</strong> {demoUser.email}</div>
                  <div><strong>Pass:</strong> {demoUser.password}</div>
                </div>
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition shadow-xs cursor-pointer"
                >
                  Quick Fill
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-sm rounded-xl transition shadow-md shadow-teal-700/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Sign In to Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-gray-500 border-t border-gray-100 flex items-center justify-between">
              <span>New customer?</span>
              <Link to="/register" className="font-bold text-teal-700 hover:underline">
                Create new account
              </Link>
            </div>
          </div>
        </div>

        {/* Note on security */}
        <p className="text-center text-[11px] text-gray-400">
          Demo authentication operates via local credentials abstraction. Ready for future MongoDB JWT authentication.
        </p>
      </div>
    </div>
  );
}
