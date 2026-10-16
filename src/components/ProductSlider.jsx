import React, { useRef } from 'react';
import { ChevronRight, ChevronLeft, ShoppingBag, Plus, Check } from 'lucide-react';

export default function ProductSlider({ 
  id,
  title, 
  subtitle, 
  products, 
  onAddToCart, 
  onOpenProductDetail, 
  cartItems = [],
  viewAllLink
}) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const isItemInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  return (
    <section id={id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-0.5 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        {viewAllLink && (
          <a 
            href={viewAllLink} 
            className="text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-800 flex items-center hover:underline"
          >
            View All <ChevronRight className="w-4 h-4 ml-0.5" />
          </a>
        )}
      </div>

      {/* Slider */}
      <div className="relative group">
        <button 
          onClick={() => scroll('left')}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition hidden md:flex"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div 
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto no-scrollbar py-2 px-1"
        >
          {products.map((product) => {
            const inCart = isItemInCart(product.id);
            return (
              <div 
                key={product.id}
                className="shrink-0 w-48 sm:w-56 bg-white rounded-2xl border border-gray-200 p-3.5 flex flex-col justify-between hover:shadow-xl transition-all duration-200 hover:border-teal-400 group/card relative"
              >
                {/* Discount Tag */}
                {product.tag && (
                  <span className="absolute top-3 left-3 z-10 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-500 text-white shadow-xs">
                    {product.tag}
                  </span>
                )}

                {/* Product Image */}
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

                {/* Product Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div 
                    onClick={() => onOpenProductDetail(product)}
                    className="cursor-pointer"
                  >
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 hover:text-teal-700 transition leading-snug">
                      {product.name}
                    </h3>
                  </div>

                  {/* Pricing and Action */}
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
                          <span className="ml-1.5 text-[11px] font-bold text-rose-600">
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
                          : 'bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-700 hover:text-white'
                      }`}
                      title={inCart ? "Item in cart" : "Add to cart"}
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
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
