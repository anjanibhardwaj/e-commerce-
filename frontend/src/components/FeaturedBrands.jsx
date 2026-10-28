import React, { useRef, useMemo } from 'react';
import { ChevronRight, ChevronLeft, Award } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function FeaturedBrands({ onSelectBrand }) {
  const { products } = useData();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Derive brands dynamically from live database products
  const brands = useMemo(() => {
    const brandSet = Array.from(new Set(products.map((p) => p.brand).filter(Boolean)));
    if (brandSet.length === 0) {
      return [
        { name: 'GSK', tagline: 'Global Healthcare Leader', color: 'text-teal-900' },
        { name: 'Cipla', tagline: 'Caring For Life', color: 'text-blue-900' },
        { name: 'Sun Pharma', tagline: 'Reaching People, Touching Lives', color: 'text-orange-900' },
        { name: 'Abbott', tagline: 'Life. To The Fullest.', color: 'text-sky-900' },
        { name: 'Torrent Pharma', tagline: 'Certified Pharmaceutical', color: 'text-indigo-900' },
        { name: 'Micro Labs', tagline: 'Makers of Dolo 650', color: 'text-emerald-900' },
        { name: 'Dabur', tagline: 'Pure Ayurvedic Care', color: 'text-amber-900' },
        { name: 'Himalaya Wellness', tagline: 'Natural Herbal Formulas', color: 'text-emerald-900' }
      ];
    }
    const colorClasses = [
      'text-teal-900', 'text-blue-900', 'text-emerald-900', 'text-indigo-900', 
      'text-cyan-900', 'text-amber-900', 'text-sky-900'
    ];
    return brandSet.map((name, index) => ({
      name,
      tagline: 'Verified Clinical Partner',
      color: colorClasses[index % colorClasses.length]
    }));
  }, [products]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Featured Brands
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Pick from our favourite clinically validated brands
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
          className="flex space-x-4 overflow-x-auto no-scrollbar py-2 px-1"
        >
          {brands.map((brand, idx) => (
            <div 
              key={idx}
              onClick={() => onSelectBrand(brand.name)}
              className="shrink-0 w-36 sm:w-44 bg-white rounded-2xl border border-gray-200 p-4 text-center cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-teal-400 group/brand flex flex-col items-center justify-center min-h-[120px]"
            >
              <div className="w-12 h-12 rounded-full bg-teal-50/70 border border-teal-100 flex items-center justify-center mb-2 group-hover/brand:bg-teal-600 transition">
                <Award className="w-6 h-6 text-teal-700 group-hover/brand:text-white transition" />
              </div>

              <h3 className={`text-base font-extrabold ${brand.color} group-hover/brand:text-teal-700 transition`}>
                {brand.name}
              </h3>
              <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">
                {brand.tagline}
              </p>
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
