import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Clock, ChevronRight, ChevronLeft, Plus, Check } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function DealsOfTheDay({ onAddToCart, onOpenProductDetail, cartItems = [] }) {
  const { products } = useData();
  const [timeLeft, setTimeLeft] = useState(2385); // approx 39 mins 45s
  const scrollRef = useRef(null);

  // Derive deals directly from live MongoDB Atlas products (highest discount first)
  const dealProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    const valid = products.filter((p) => !p.approvalStatus || p.approvalStatus === 'approved');
    const sorted = [...valid].sort((a, b) => (b.discount || 0) - (a.discount || 0));
    return sorted.slice(0, 10).map((p) => ({
      ...p,
      tag: p.discount ? `${p.discount}% OFF` : 'DEAL'
    }));
  }, [products]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 3600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const isItemInCart = (productId) => {
    return cartItems.some((item) => (item.id || item._id) === productId);
  };

  if (dealProducts.length === 0) {
    return null;
  }

  return (
    <section id="deals-day" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with live timer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Deals of the Day
          </h2>

          {/* Flash Timer Badge */}
          <div className="inline-flex items-center space-x-1.5 bg-amber-500 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-xs animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            <span>⏱ {formatTime(timeLeft)} MINS LEFT, HURRY!</span>
          </div>
        </div>

        <a 
          href="#deals-day" 
          className="text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-800 flex items-center hover:underline"
        >
          View All <ChevronRight className="w-4 h-4 ml-0.5" />
        </a>
      </div>

      {/* Product Slider */}
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
          {dealProducts.map((product) => {
            const prodId = product.id || product._id;
            const inCart = isItemInCart(prodId);
            return (
              <div 
                key={prodId}
                className="shrink-0 w-48 sm:w-56 bg-white rounded-2xl border border-amber-200/80 p-3.5 flex flex-col justify-between hover:shadow-xl transition-all duration-200 hover:border-amber-400 group/card relative"
              >
                {/* Sale Tag */}
                <span className="absolute top-3 left-3 z-10 text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500 text-white shadow-xs">
                  {product.tag}
                </span>

                <div 
                  onClick={() => onOpenProductDetail(product)}
                  className="w-full h-36 sm:h-44 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center p-2 mb-3 cursor-pointer group-hover/card:scale-102 transition"
                >
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-contain mix-blend-multiply"
                    loading="lazy"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div 
                    onClick={() => onOpenProductDetail(product)}
                    className="cursor-pointer"
                  >
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 hover:text-teal-700 transition leading-snug">
                      {product.name}
                    </h3>
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      {product.mrp && product.mrp > product.price && (
                        <div className="text-[11px] text-gray-400 line-through">
                          MRP ₹{product.mrp}
                        </div>
                      )}
                      <div className="text-sm sm:text-base font-extrabold text-gray-900">
                        ₹{product.price}
                        {product.discount > 0 && (
                          <span className="ml-1.5 text-[11px] font-bold text-amber-600">
                            ({product.discount}%)
                          </span>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={() => onAddToCart(product)}
                      className={`p-2 rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
                        inCart 
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                          : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-600 hover:text-white'
                      }`}
                      title={inCart ? "In cart" : "Add to cart"}
                    >
                      {inCart ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline text-[10px]">ADDED</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline text-[10px]">ADD</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

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
