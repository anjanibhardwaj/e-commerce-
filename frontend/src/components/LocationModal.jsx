import React, { useState } from 'react';
import { X, MapPin, Navigation, Check } from 'lucide-react';
import { mockCities } from '../data/mockData';

export default function LocationModal({ isOpen, onClose, onSelectCity, currentCity }) {
  const [pincode, setPincode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handlePincodeSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (pincode.length === 6) {
      onSelectCity({
        name: `Pin ${pincode}`,
        pincode: pincode,
        state: "Verified Location"
      });
      onClose();
    } else {
      setError('Please enter a valid 6-digit Indian pincode');
    }
  };

  const handleUseLocation = () => {
    onSelectCity({
      name: "Mumbai Central",
      pincode: "400001",
      state: "Maharashtra"
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-700">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-gray-800">
              Select Delivery Location
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Pincode Input */}
          <form onSubmit={handlePincodeSubmit} className="space-y-2">
            <label className="text-xs font-semibold text-gray-700 block">
              Enter Delivery Pincode
            </label>
            <div className="flex space-x-2">
              <input 
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 400001"
                className="w-full text-sm px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 tracking-wider"
              />
              <button 
                type="submit"
                className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer"
              >
                Check
              </button>
            </div>
            {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
          </form>

          {/* Current Location button */}
          <button 
            onClick={handleUseLocation}
            className="w-full py-2.5 px-4 rounded-xl border border-teal-200 bg-teal-50/70 hover:bg-teal-100/70 text-teal-800 text-xs font-bold flex items-center justify-center space-x-2 transition cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5 text-teal-700" />
            <span>Detect My Current Location</span>
          </button>

          {/* Popular Cities */}
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Popular Cities
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {mockCities.map((city) => {
                const isSelected = currentCity && currentCity.pincode === city.pincode;
                return (
                  <button 
                    key={city.pincode}
                    onClick={() => {
                      onSelectCity(city);
                      onClose();
                    }}
                    className={`p-2.5 rounded-xl text-left border text-xs font-medium transition flex items-center justify-between cursor-pointer ${
                      isSelected 
                        ? 'border-teal-600 bg-teal-50 text-teal-900 font-bold' 
                        : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{city.name}</div>
                      <div className="text-[10px] text-gray-400">{city.pincode}</div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-teal-700" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
