import React, { useRef } from 'react';
import { 
  Pill, 
  FlaskConical, 
  Stethoscope, 
  Sparkles, 
  HeartPulse, 
  BookOpen, 
  Crown, 
  Gift, 
  ChevronRight, 
  ChevronLeft 
} from 'lucide-react';
import { mockQuickServices } from '../data/mockData';

const iconMap = {
  Pill: Pill,
  FlaskConical: FlaskConical,
  Stethoscope: Stethoscope,
  Sparkles: Sparkles,
  HeartPulse: HeartPulse,
  BookOpen: BookOpen,
  Crown: Crown,
  Gift: Gift
};

export default function QuickServices({ onSelectService }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
      <div className="relative group">
        {/* Left Scroll Button */}
        <button 
          onClick={() => scroll('left')}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:text-teal-700 transition hidden md:flex"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Circular Cards Row */}
        <div 
          ref={scrollRef}
          className="flex items-start space-x-6 sm:space-x-8 overflow-x-auto no-scrollbar py-2 px-1"
        >
          {mockQuickServices.map((service) => {
            const IconComponent = iconMap[service.icon] || Pill;
            return (
              <div 
                key={service.id}
                onClick={() => onSelectService(service)}
                className="flex flex-col items-center cursor-pointer group/item shrink-0 w-24 sm:w-28 text-center transition-transform hover:-translate-y-1"
              >
                {/* Circular Icon Container */}
                <div className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-xs border-2 transition-all duration-200 group-hover/item:shadow-md ${service.color}`}>
                  <IconComponent className="w-8 h-8 sm:w-9 sm:h-9" />
                </div>

                {/* Service Title */}
                <span className="mt-2.5 text-xs sm:text-sm font-semibold text-gray-800 group-hover/item:text-teal-700 transition">
                  {service.title}
                </span>

                {/* Offer Badge Tag */}
                <span className="mt-1 text-[10px] sm:text-[11px] font-bold text-emerald-700 uppercase tracking-tight">
                  {service.badge}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right Scroll Button */}
        <button 
          onClick={() => scroll('right')}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:text-teal-700 transition hidden md:flex"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
