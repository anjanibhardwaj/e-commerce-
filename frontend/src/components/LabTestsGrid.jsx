import React from 'react';
import { ChevronRight, ShieldCheck, Clock, CheckCircle, Activity, Stethoscope } from 'lucide-react';
import { mockFrequentlyBookedLabTests } from '../data/mockData';

export default function LabTestsGrid({ onBookTest }) {
  return (
    <section id="frequently-booked-tests" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Frequently Booked Lab Tests
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            100% Certified Thyrocare &amp; NABL Accredited diagnostic packages with free doorstep blood sample pickup
          </p>
        </div>

        <button 
          onClick={() => onBookTest(mockFrequentlyBookedLabTests[0])}
          className="text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-800 flex items-center hover:underline cursor-pointer"
        >
          View All <ChevronRight className="w-4 h-4 ml-0.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {mockFrequentlyBookedLabTests.map((test) => (
          <div 
            key={test.id}
            className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col justify-between hover:shadow-xl transition-all duration-200 hover:border-teal-400 relative group"
          >
            {/* Discount Badge */}
            <span className="absolute top-4 left-4 text-[10px] font-black uppercase px-2.5 py-1 rounded bg-rose-500 text-white shadow-xs">
              {test.tag}
            </span>

            <div>
              {/* Partner accreditation */}
              <div className="text-right text-[11px] font-semibold text-teal-700 mb-6">
                Thyrocare Certified
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-gray-800 group-hover:text-teal-700 transition leading-snug min-h-[42px]">
                {test.name}
              </h3>

              {/* Key Highlights */}
              <div className="mt-4 space-y-2 border-t border-b border-gray-100 py-3 text-xs text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600 mr-2 shrink-0" />
                  <span className="font-semibold text-gray-800">{test.testsIncluded} Tests</span>
                  <span className="text-gray-500 ml-1">Included</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Clock className="w-3.5 h-3.5 text-amber-500 mr-2 shrink-0" />
                  <span>{test.fastingRequired}</span>
                </div>
                <div className="flex items-center text-emerald-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-2 shrink-0" />
                  <span>{test.reportTime}</span>
                </div>
              </div>
            </div>

            {/* Price & Booking Button */}
            <div className="mt-4 pt-2 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-gray-400 line-through">
                  MRP ₹{test.mrp}
                </div>
                <div className="text-lg font-extrabold text-gray-900">
                  ₹{test.price}
                </div>
              </div>

              <button 
                onClick={() => onBookTest(test)}
                className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm hover:shadow cursor-pointer"
              >
                Book Now
              </button>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}
