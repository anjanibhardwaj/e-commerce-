import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Crown, Lock, Mail, Eye, EyeOff, Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';
import demoData from '../../data/demoUsers.json';

export default function SuperAdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const demoSuperAdmin = demoData.admins.find((a) => a.role === 'superadmin') || {
    email: 'superadmin@example.com',
    password: 'superadmin123'
  };

  const handleQuickFill = () => {
    setEmail(demoSuperAdmin.email);
    setPassword(demoSuperAdmin.password);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      await login(email, password, 'superadmin');
      navigate('/superadmin');
    } catch (err) {
      setError(err.message || 'SuperAdmin authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#09090b]">
      <div className="max-w-md w-full space-y-6">
        <div className="bg-[#121217] rounded-3xl shadow-2xl border border-purple-900/40 overflow-hidden text-white">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-950/80 via-[#181820] to-[#121217] p-8 text-center border-b border-purple-900/40 relative">
            <div className="w-16 h-16 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-2xl mx-auto flex items-center justify-center mb-3">
              <Crown className="w-9 h-9 text-amber-400" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">SuperAdmin Executive Portal</h2>
            <p className="text-xs text-purple-300 mt-1">
              Highest-Privilege Platform Oversight, System Control &amp; Global Governance
            </p>
          </div>

          <div className="p-8 space-y-6">
            {error && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start space-x-2">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-purple-200 block mb-1">
                  SuperAdmin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="superadmin@example.com"
                    className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-purple-950/30 border border-purple-800/40 text-white placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-purple-200 block mb-1">
                  Master Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Master password"
                    className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-purple-950/30 border border-purple-800/40 text-white placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-purple-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl transition shadow-lg shadow-purple-900/40 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Enter SuperAdmin Command</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Fill Button */}
            <div className="pt-2 border-t border-purple-900/30">
              <button
                type="button"
                onClick={handleQuickFill}
                className="w-full py-2.5 px-3 bg-purple-950/40 hover:bg-purple-900/40 border border-purple-700/50 text-purple-300 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>⚡ Quick Fill SuperAdmin Credentials</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
