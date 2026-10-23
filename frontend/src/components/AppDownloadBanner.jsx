import React, { useState } from 'react';
import { Smartphone, Download, Check, Send } from 'lucide-react';

export default function AppDownloadBanner({ onNotify }) {
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);

  const handleSendLink = (e) => {
    e.preventDefault();
    if (phone.length === 10) {
      setSent(true);
      if (onNotify) onNotify(`App download link sent to +91-${phone}!`);
      setTimeout(() => {
        setSent(false);
        setPhone('');
      }, 4000);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-r from-teal-50 via-cyan-50 to-emerald-50 rounded-3xl border border-teal-200/80 p-8 sm:p-12 relative overflow-hidden">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Smartphone Mockups */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div className="relative flex items-center space-x-3 sm:space-x-4">
              
              {/* Phone 1 */}
              <div className="w-40 sm:w-48 bg-gray-900 rounded-[2.5rem] p-2.5 shadow-2xl border-4 border-gray-800 rotate-[-4deg] hover:rotate-0 transition duration-300">
                <div className="bg-white rounded-[2rem] overflow-hidden p-2 text-center text-xs">
                  <div className="w-12 h-3 bg-gray-800 rounded-full mx-auto mb-2" />
                  <div className="bg-teal-700 text-white p-2 rounded-xl text-[10px] font-bold mb-2">
                    PharmEasy Flat 25% Off
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 p-1">
                    <div className="bg-emerald-50 p-2 rounded-lg text-[9px] font-bold text-emerald-800">
                      Medicines
                    </div>
                    <div className="bg-sky-50 p-2 rounded-lg text-[9px] font-bold text-sky-800">
                      Lab Tests
                    </div>
                  </div>
                  <div className="mt-3 text-[10px] text-gray-500 font-medium">
                    Delivered in 24 Hrs
                  </div>
                </div>
              </div>

              {/* Phone 2 */}
              <div className="w-40 sm:w-48 bg-gray-900 rounded-[2.5rem] p-2.5 shadow-2xl border-4 border-gray-800 rotate-[4deg] hover:rotate-0 transition duration-300">
                <div className="bg-white rounded-[2rem] overflow-hidden p-2 text-center text-xs">
                  <div className="w-12 h-3 bg-gray-800 rounded-full mx-auto mb-2" />
                  <div className="bg-amber-500 text-white p-2 rounded-xl text-[10px] font-bold mb-2">
                    Health Checkups
                  </div>
                  <div className="bg-gray-100 p-2 rounded-lg text-[9px] text-gray-700 mb-1">
                    Free Sample Pickup
                  </div>
                  <div className="mt-3 text-[10px] text-gray-500 font-medium">
                    Verified Digital Reports
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* App download content & SMS Link */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Simplifying Healthcare <br />
              <span className="text-teal-700">Impacting Lives</span>
            </h2>

            <p className="text-sm text-gray-600 max-w-lg mx-auto lg:mx-0">
              Download the free PharmEasy app for lightning-fast medicine orders, instant lab test bookings, digital health record vaults, and pill reminder alarms.
            </p>

            {/* App Store Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <a 
                href="#download-play"
                className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl flex items-center space-x-3 shadow-md hover:scale-105 transition"
              >
                <div className="text-xl">▶</div>
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-wider text-gray-400">GET IT ON</div>
                  <div className="text-xs font-bold leading-none">Google Play</div>
                </div>
              </a>

              <a 
                href="#download-apple"
                className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl flex items-center space-x-3 shadow-md hover:scale-105 transition"
              >
                <div className="text-xl"></div>
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-wider text-gray-400">Download on the</div>
                  <div className="text-xs font-bold leading-none">App Store</div>
                </div>
              </a>
            </div>

            {/* SMS Link Input */}
            <div className="pt-4 max-w-md mx-auto lg:mx-0">
              <div className="text-xs font-semibold text-gray-700 mb-2">
                Or enter your phone number to receive the app download link via SMS:
              </div>
              <form onSubmit={handleSendLink} className="flex rounded-xl overflow-hidden shadow-xs border border-gray-300 bg-white">
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-2.5 flex items-center border-r border-gray-300">
                  +91
                </span>
                <input 
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10 digit mobile number"
                  className="w-full text-xs px-3 py-2.5 focus:outline-none"
                />
                <button 
                  type="submit"
                  disabled={phone.length !== 10}
                  className="bg-teal-700 hover:bg-teal-800 disabled:bg-gray-300 text-white px-4 py-2.5 text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                >
                  {sent ? <Check className="w-4 h-4" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{sent ? "Sent" : "Send Link"}</span>
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
