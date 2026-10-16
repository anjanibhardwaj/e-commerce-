import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { mockHeroBanners } from '../data/mockData';

export default function HeroBanners({ onBannerAction }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? mockHeroBanners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === mockHeroBanners.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="relative overflow-hidden rounded-2xl shadow-sm border border-gray-100">
        
        {/* Banner Container */}
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {mockHeroBanners.map((banner) => (
            <div 
              key={banner.id}
              className={`w-full shrink-0 min-h-[220px] sm:min-h-[260px] bg-gradient-to-r ${banner.gradient} text-white flex flex-col md:flex-row items-center justify-between p-6 sm:p-10 relative`}
            >
              <div className="max-w-xl z-10 space-y-3">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-teal-100 backdrop-blur-xs tracking-wider">
                  {banner.badge}
                </span>
                <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                  {banner.title}
                </h2>
                <p className="text-xs sm:text-base text-teal-100 font-normal">
                  {banner.subtitle}
                </p>
                <div className="text-sm sm:text-lg font-bold text-emerald-300">
                  {banner.highlight}
                </div>
                <div>
                  <button 
                    onClick={() => onBannerAction(banner.btnAction)}
                    className="mt-2 inline-flex items-center space-x-2 bg-white text-teal-900 hover:bg-teal-50 font-bold px-5 py-2.5 rounded-lg text-xs sm:text-sm shadow-md transition-all hover:scale-105 cursor-pointer"
                  >
                    <span>{banner.btnText}</span>
                    <ArrowRight className="w-4 h-4 text-teal-800" />
                  </button>
                </div>
              </div>

              {/* Decorative Image */}
              <div className="mt-4 md:mt-0 z-10 hidden sm:block shrink-0">
                <img 
                  src={banner.image} 
                  alt={banner.title} 
                  className="w-48 h-48 sm:w-60 sm:h-60 object-cover rounded-2xl shadow-lg border-2 border-white/20"
                />
              </div>

              {/* Background Glow */}
              <div className="absolute right-0 bottom-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Carousel Prev/Next Buttons */}
        <button 
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/70 hover:bg-white text-gray-800 flex items-center justify-center shadow-md transition backdrop-blur-xs"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button 
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/70 hover:bg-white text-gray-800 flex items-center justify-center shadow-md transition backdrop-blur-xs"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {mockHeroBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${currentSlide === idx ? 'w-6 bg-white' : 'w-2 bg-white/40'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
