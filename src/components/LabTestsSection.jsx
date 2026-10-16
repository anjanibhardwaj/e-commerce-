import React, { useRef } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Stethoscope, 
  Sparkles, 
  Activity, 
  Heart, 
  Thermometer, 
  ShieldAlert, 
  HeartPulse 
} from 'lucide-react';
import { mockLabConcerns } from '../data/mockData';

const concernIcons = {
  Stethoscope,
  Sparkles,
  Activity,
  Heart,
  Thermometer,
  ShieldAlert,
  HeartPulse
};

export default function LabTestsSection({ onSelectConcern }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="lab-tests" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Lab Tests by Health Concern
          </h2>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-gray-500 font-medium">Powered by</span>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Thyrocare &amp; NABL Certified Labs
            </span>
          </div>
        </div>

        <a 
          href="#frequently-booked-tests" 
          className="text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-800 flex items-center hover:underline mt-2 sm:mt-0"
        >
          View All Tests <ChevronRight className="w-4 h-4 ml-0.5" />
        </a>
      </div>

      {/* Concerns Horizontal Carousel */}
      <div className="relative group">
        <button 
          onClick={() => scroll('left')}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition hidden md:flex"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div 
          ref={scrollRef}
          className="flex space-x-4 sm:space-x-6 overflow-x-auto no-scrollbar py-2 px-1"
        >
          {mockLabConcerns.map((concern) => {
            const Icon = concernIcons[concern.icon] || Stethoscope;
            return (
              <div 
                key={concern.id}
                onClick={() => onSelectConcern(concern)}
                className="shrink-0 w-36 sm:w-44 bg-white rounded-2xl border border-gray-200 p-3 sm:p-4 hover:shadow-lg transition-all duration-200 cursor-pointer text-center group/card hover:border-teal-400 flex flex-col items-center"
              >
                {/* Badge if any */}
                {concern.badge && (
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full mb-2 ${
                    concern.badge === 'GET TESTED' ? 'bg-rose-500 text-white' : 'bg-teal-100 text-teal-800'
                  }`}>
                    {concern.badge}
                  </span>
                )}

                {/* Round Image / Icon container */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 border-2 border-gray-100 group-hover/card:scale-105 transition">
                  <img 
                    src={concern.image} 
                    alt={concern.name} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name */}
                <h3 className="text-xs sm:text-sm font-bold text-gray-800 group-hover/card:text-teal-700 transition">
                  {concern.name}
                </h3>

                {/* Description/Count */}
                <p className="text-[11px] text-gray-500 mt-1">
                  {concern.testsCount}
                </p>
              </div>
            );
          })}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition hidden md:flex"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
