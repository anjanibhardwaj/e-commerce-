import React, { useRef } from 'react';
import { Star, Quote, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { mockTestimonials } from '../data/mockData';

export default function CustomerReviews() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            What Our Customers have to Say
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Real stories and authentic experiences from millions of happy Indian families
          </p>
        </div>
      </div>

      <div className="relative group">
        <button 
          onClick={() => scroll('left')}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition hidden md:flex"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div 
          ref={scrollRef}
          className="flex space-x-5 overflow-x-auto no-scrollbar py-2 px-1"
        >
          {mockTestimonials.map((item) => (
            <div 
              key={item.id}
              className="shrink-0 w-72 sm:w-80 bg-white rounded-2xl border border-gray-200 p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-200 hover:border-teal-400 group"
            >
              <div>
                {/* Header with Name, Date and Rating */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-teal-700 transition">
                      {item.name}
                    </h3>
                    <div className="text-[11px] text-gray-400">
                      {item.date} • {item.location}
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-700">
                    <Quote className="w-4 h-4" />
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Comment quote */}
                <p className="text-xs text-gray-600 leading-relaxed italic">
                  "{item.comment}"
                </p>
              </div>

              {/* Verified Purchase Badge */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Verified PharmEasy Customer
              </div>
            </div>
          ))}
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
