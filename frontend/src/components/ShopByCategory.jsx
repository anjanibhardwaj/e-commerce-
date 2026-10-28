import React, { useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function ShopByCategory({ onSelectCategory }) {
  const { categories } = useData();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const displayCategories = categories && categories.length > 0 ? categories : [
    { name: 'Prescription Medicines', discountText: 'Up to 20% OFF', image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&auto=format&fit=crop&q=60' },
    { name: 'OTC Medicines', discountText: 'Up to 25% OFF', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&auto=format&fit=crop&q=60' },
    { name: 'Vitamins & Supplements', discountText: 'Up to 40% OFF', image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?w=400&auto=format&fit=crop&q=80' },
    { name: 'Healthcare Devices', discountText: 'Up to 50% OFF', image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&auto=format&fit=crop&q=60' },
    { name: 'Personal Care', discountText: 'Up to 35% OFF', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&auto=format&fit=crop&q=60' },
    { name: 'Ayurvedic Care', discountText: 'Up to 30% OFF', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop&q=60' }
  ];

  return (
    <section id="shop-category" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Shop by Category
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Explore authentic healthcare and wellness products direct from verified pharmacies</p>
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
          {displayCategories.map((cat, idx) => (
            <div 
              key={cat._id || cat.id || idx}
              onClick={() => onSelectCategory(cat.name)}
              className="shrink-0 w-36 sm:w-44 bg-white rounded-2xl border border-gray-200 p-3 flex flex-col items-center text-center cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-teal-400 group/cat"
            >
              {/* Tag / Discount badge */}
              {(cat.discountText || cat.tag) && (
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full mb-2 bg-teal-50 text-teal-700">
                  {cat.discountText || cat.tag}
                </span>
              )}

              {/* Product Category Image */}
              <div className="w-24 h-24 rounded-xl overflow-hidden mb-3 bg-gray-50 p-1 flex items-center justify-center group-hover/cat:scale-105 transition">
                <img 
                  src={cat.image || 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&auto=format&fit=crop&q=80'} 
                  alt={cat.name} 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Title */}
              <h3 className="text-xs sm:text-sm font-semibold text-gray-800 group-hover/cat:text-teal-700 transition">
                {cat.name}
              </h3>
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
