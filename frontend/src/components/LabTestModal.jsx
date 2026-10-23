import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function LabTestModal({ test, isOpen, onClose, onBookingSuccess }) {
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [date, setDate] = useState('2026-10-18');
  const [timeSlot, setTimeSlot] = useState('07:00 AM - 08:00 AM (Fasting Preferred)');

  if (!isOpen || !test) return null;

  const handleBook = (e) => {
    e.preventDefault();
    onBookingSuccess({
      testName: test.name,
      patientName: patientName || "Rohan Sharma",
      age: age || "28",
      gender,
      date,
      timeSlot,
      price: test.price
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-teal-800 text-white">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-200 bg-teal-900/60 px-2 py-0.5 rounded">
              Thyrocare Certified Diagnostics
            </span>
            <h3 className="text-base font-bold mt-1">Book Lab Test</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/80 hover:text-white p-1 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleBook} className="p-6 space-y-4">
          {/* Selected Test Summary */}
          <div className="bg-teal-50/70 p-4 rounded-2xl border border-teal-200/80">
            <h4 className="text-xs sm:text-sm font-bold text-gray-900">
              {test.name}
            </h4>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-teal-100 text-xs">
              <span className="text-teal-800 font-semibold">{test.testsIncluded || 84} Tests Included</span>
              <span className="font-extrabold text-teal-950 text-base">₹{test.price}</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-1 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-1" />
              <span>Free Doorstep Phlebotomist Sample Pickup</span>
            </div>
          </div>

          {/* Patient Details */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Patient Information
            </h5>
            
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Full Name
              </label>
              <input 
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Rohan Sharma"
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Age (Years)
                </label>
                <input 
                  type="number"
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 32"
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Gender
                </label>
                <select 
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Select Date
                </label>
                <input 
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Time Slot
                </label>
                <select 
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 bg-white"
                >
                  <option>06:30 AM - 07:30 AM</option>
                  <option>07:00 AM - 08:00 AM (Fasting Preferred)</option>
                  <option>08:00 AM - 09:00 AM</option>
                  <option>09:00 AM - 10:00 AM</option>
                  <option>05:00 PM - 06:00 PM</option>
                </select>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition shadow-sm cursor-pointer mt-4"
          >
            Confirm Doorstep Sample Collection
          </button>
        </form>

      </div>
    </div>
  );
}
