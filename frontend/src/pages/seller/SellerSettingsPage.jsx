import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Store, ShieldCheck, CheckCircle2, AlertCircle, Save } from 'lucide-react';

export default function SellerSettingsPage() {
  const { user } = useAuth();
  const { showToast } = useData();

  const [businessName, setBusinessName] = useState(user?.name || 'Apollo Care Pharmacy');
  const [contactPerson, setContactPerson] = useState(user?.contactPerson || 'Dr. Rajesh Gupta');
  const [phone, setPhone] = useState(user?.phone || '+91 9820012345');
  const [address, setAddress] = useState(user?.address || 'Shop 4, Lotus Enclave, Link Road, Mumbai 400053');

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Pharmacy profile details updated!');
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-xl font-black text-gray-900">Pharmacy Store Settings</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Manage licensed credentials, business addresses, and contact persons
        </p>
      </div>

      {/* Compliance Card */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 flex items-start space-x-3 text-xs text-emerald-900">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <div className="font-extrabold text-sm mb-0.5">Verified Medical Seller Status: Active</div>
          <p className="text-emerald-800 leading-relaxed">
            Drug License Number: <strong>{user?.licenseNumber || 'DL-MH-2024-88491'}</strong> (Form 20/21) • GSTIN: <strong>{user?.gstin || '27AAACA1234A1Z5'}</strong>. Verified by Central Platform Compliance.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Pharmacy Business Name</label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Pharmacist In-Charge</label>
            <input
              type="text"
              required
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Registered Email</label>
            <input
              type="email"
              disabled
              value={user?.email || 'seller@example.com'}
              className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Dispatch Contact Phone</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-gray-700 block mb-1">Physical Pharmacy Address</label>
            <textarea
              rows={2}
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            className="flex items-center space-x-1.5 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition shadow-md shadow-teal-700/20 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
