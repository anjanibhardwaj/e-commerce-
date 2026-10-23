import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Store, Building, Mail, Phone, Lock, FileText, CheckCircle, ArrowRight } from 'lucide-react';

export default function SellerRegisterPage() {
  const { registerSeller } = useAuth();
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [gstin, setGstin] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      await registerSeller({
        businessName,
        contactPerson,
        email,
        phone,
        licenseNumber,
        gstin,
        city,
        address,
        password
      });
      navigate('/seller/dashboard');
    } catch (err) {
      setError(err.message || 'Seller registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 flex items-center justify-center">
      <div className="max-w-xl w-full space-y-6">
        <div className="bg-slate-800 rounded-3xl shadow-2xl border border-slate-700 overflow-hidden text-white">
          <div className="bg-gradient-to-r from-teal-800 to-slate-900 p-8 text-center border-b border-slate-700">
            <div className="w-14 h-14 bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-2xl mx-auto flex items-center justify-center mb-2">
              <Store className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black">Register as Medicine Supplier</h2>
            <p className="text-xs text-teal-300 mt-1">
              Onboard your licensed retail or wholesale pharmacy to reach millions of patients
            </p>
          </div>

          <div className="p-8 pt-6 space-y-5">
            {error && (
              <div className="p-3.5 bg-rose-950/60 border border-rose-800 rounded-xl text-xs font-semibold text-rose-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Pharmacy / Business Name</label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. LifeCare Meds"
                    className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-900 border border-slate-700 focus:outline-none focus:border-teal-500 text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Contact Pharmacist / Owner</label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Dr. Ramesh Rao"
                    className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-900 border border-slate-700 focus:outline-none focus:border-teal-500 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="pharma@example.com"
                    className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-900 border border-slate-700 focus:outline-none focus:border-teal-500 text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Mobile / Phone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9820011223"
                    className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-900 border border-slate-700 focus:outline-none focus:border-teal-500 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Drug License No. (Form 20/21)
                  </label>
                  <input
                    type="text"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="e.g. DL-MH-2026-9021"
                    className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-900 border border-slate-700 focus:outline-none focus:border-teal-500 text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    required
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    placeholder="27ABCDE1234F1Z5"
                    className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-900 border border-slate-700 focus:outline-none focus:border-teal-500 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Operating City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Mumbai / Delhi / Bengaluru"
                    className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-900 border border-slate-700 focus:outline-none focus:border-teal-500 text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Account Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-900 border border-slate-700 focus:outline-none focus:border-teal-500 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Pharmacy Physical Address</label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Shop No., Complex, Street, Pincode"
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-900 border border-slate-700 focus:outline-none focus:border-teal-500 text-white"
                />
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700 text-[11px] text-slate-400">
                <p>
                  By submitting your application, your license will be submitted to the <strong>Admin Compliance Station</strong> for verification. You will be redirected to your dashboard in "Pending" status.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-sm rounded-xl transition shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
              >
                {loading ? <span>Processing Application...</span> : <span>Submit Seller Application</span>}
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-700/60">
              Already registered?{' '}
              <Link to="/seller/login" className="font-bold text-teal-400 hover:underline">
                Sign in to Seller Hub
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
