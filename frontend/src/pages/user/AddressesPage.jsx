import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Plus, Trash2, CheckCircle2, Home, Briefcase } from 'lucide-react';

export default function AddressesPage() {
  const { user } = useAuth();

  const [addresses, setAddresses] = useState(
    user?.addresses || [
      {
        id: 'addr-1',
        tag: 'Home',
        street: 'Apt 402, Green Meadows, Andheri West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400058',
        isDefault: true
      },
      {
        id: 'addr-2',
        tag: 'Office',
        street: 'Tech Park, Building 3, Bandra Kurla Complex',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400051',
        isDefault: false
      }
    ]
  );

  const [showAddForm, setShowAddForm] = useState(false);
  const [tag, setTag] = useState('Home');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

  const handleAddAddress = (e) => {
    e.preventDefault();
    const newAddr = {
      id: `addr-${Date.now()}`,
      tag,
      street,
      city,
      state: 'Maharashtra',
      pincode,
      isDefault: addresses.length === 0
    };
    setAddresses([...addresses, newAddr]);
    setShowAddForm(false);
    setStreet('');
    setCity('');
    setPincode('');
  };

  const handleRemove = (id) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-gray-900">Saved Delivery Addresses</h2>
          <p className="text-xs text-gray-500 mt-0.5">Manage delivery locations for medicine dispatch</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Address</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddAddress} className="bg-white p-6 rounded-3xl border border-teal-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-teal-800 uppercase tracking-wider">New Delivery Address</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Tag</label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-gray-300"
              >
                <option value="Home">Home</option>
                <option value="Office">Office</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-gray-700 block mb-1">Street / Apartment</label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Flat 101, Lake View"
                className="w-full text-xs p-2 rounded-xl border border-gray-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">City</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Mumbai"
                className="w-full text-xs p-2 rounded-xl border border-gray-300"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Pincode</label>
              <input
                type="text"
                required
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="400001"
                className="w-full text-xs p-2 rounded-xl border border-gray-300"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-gray-500 px-3 py-1.5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-teal-700 text-white font-bold text-xs px-4 py-2 rounded-xl"
            >
              Save Address
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center space-x-1.5 text-xs font-extrabold text-teal-800">
                  {addr.tag === 'Home' ? <Home className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
                  <span>{addr.tag}</span>
                </span>
                {addr.isDefault && (
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Default
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-700">{addr.street}</p>
              <p className="text-xs text-gray-500 mt-1">{addr.city} - {addr.pincode}</p>
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                onClick={() => handleRemove(addr.id)}
                className="text-xs text-rose-500 hover:text-rose-700 font-semibold flex items-center space-x-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
