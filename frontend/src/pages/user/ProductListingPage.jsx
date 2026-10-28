import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { 
  Filter, 
  ArrowUpDown, 
  Search, 
  X, 
  Check, 
  Star, 
  FileText, 
  ShieldCheck, 
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import ProductDetailModal from '../../components/ProductDetailModal';

export default function ProductListingPage() {
  const { products, cart, addToCart, updateQuantity } = useData();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  const brandParam = searchParams.get('brand') || '';

  // Local filter states
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedBrand, setSelectedBrand] = useState(brandParam);
  const [rxFilter, setRxFilter] = useState('all'); // 'all' | 'rx' | 'otc'
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-low' | 'price-high' | 'rating'
  const [maxPrice, setMaxPrice] = useState(3000);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync with URL params if they change
  React.useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
    if (brandParam) setSelectedBrand(brandParam);
  }, [categoryParam, brandParam]);

  // Approved products only from MongoDB Atlas
  const approvedProducts = useMemo(() => {
    return products.filter((p) => !p.approvalStatus || p.approvalStatus === 'approved');
  }, [products]);

  // Extract unique categories and brands
  const availableCategories = useMemo(() => {
    return Array.from(new Set(approvedProducts.map((p) => p.category).filter(Boolean)));
  }, [approvedProducts]);

  const availableBrands = useMemo(() => {
    return Array.from(new Set(approvedProducts.map((p) => p.brand).filter(Boolean)));
  }, [approvedProducts]);

  // Filtered & Sorted list
  const filteredProducts = useMemo(() => {
    let list = approvedProducts.filter((product) => {
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name?.toLowerCase().includes(q);
        const matchesBrand = product.brand?.toLowerCase().includes(q);
        const matchesCategory = product.category?.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesCategory) return false;
      }

      // Category
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }

      // Brand
      if (selectedBrand && product.brand !== selectedBrand) {
        return false;
      }

      // Rx
      if (rxFilter === 'rx' && !product.prescriptionRequired) return false;
      if (rxFilter === 'otc' && product.prescriptionRequired) return false;

      // Price
      if (product.price > maxPrice) return false;

      return true;
    });

    // Sorting
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return list;
  }, [approvedProducts, searchQuery, selectedCategory, selectedBrand, rxFilter, maxPrice, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setRxFilter('all');
    setMaxPrice(3000);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Header / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <div className="text-xs text-gray-500 mb-1 flex items-center space-x-1.5">
            <Link to="/" className="hover:text-teal-700">Home</Link>
            <span>/</span>
            <span className="text-gray-800 font-semibold">Medicine Catalog</span>
            {selectedCategory && (
              <>
                <span>/</span>
                <span className="text-teal-700 font-bold">{selectedCategory}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            {selectedCategory || searchQuery ? (
              <>Results for <span className="text-teal-700">"{selectedCategory || searchQuery}"</span></>
            ) : (
              'All Healthcare &amp; Medicines'
            )}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Showing {filteredProducts.length} verified products from certified pharmacies
          </p>
        </div>

        {/* Sorting Dropdown & Mobile Filter Trigger */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center space-x-1.5 px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-700 shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-teal-700" />
            <span>Filters</span>
          </button>

          <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-xl px-3 py-1.5 shadow-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-500 font-semibold">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-bold text-gray-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured Picks</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-6">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-sm font-extrabold text-gray-900 flex items-center">
                <Filter className="w-4 h-4 mr-1.5 text-teal-700" />
                Filter Catalog
              </span>
              {(selectedCategory || selectedBrand || rxFilter !== 'all' || maxPrice < 3000) && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Prescription Requirement Filter */}
            <div>
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
                Prescription Type
              </h3>
              <div className="space-y-2">
                {[
                  { id: 'all', label: 'All Health Products' },
                  { id: 'otc', label: 'OTC / No Prescription Needed' },
                  { id: 'rx', label: 'Prescription Required (Rx)' }
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer hover:text-teal-700"
                  >
                    <input
                      type="radio"
                      name="rxFilter"
                      checked={rxFilter === item.id}
                      onChange={() => setRxFilter(item.id)}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Max Price</h3>
                <span className="text-xs font-extrabold text-teal-700">Up to ₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="50"
                max="3000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>₹50</span>
                <span>₹1,500</span>
                <span>₹3,000+</span>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
                Categories
              </h3>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left text-xs py-1 px-2 rounded-lg transition ${
                    !selectedCategory ? 'bg-teal-50 text-teal-800 font-bold' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  All Categories
                </button>
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat)}
                    className={`w-full text-left text-xs py-1 px-2 rounded-lg transition truncate ${
                      selectedCategory === cat ? 'bg-teal-50 text-teal-800 font-bold' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div>
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
                Popular Brands
              </h3>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={() => setSelectedBrand('')}
                  className={`w-full text-left text-xs py-1 px-2 rounded-lg transition ${
                    !selectedBrand ? 'bg-teal-50 text-teal-800 font-bold' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  All Brands
                </button>
                {availableBrands.map((brand) => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => setSelectedBrand(brand === selectedBrand ? '' : brand)}
                    className={`w-full text-left text-xs py-1 px-2 rounded-lg transition truncate ${
                      selectedBrand === brand ? 'bg-teal-50 text-teal-800 font-bold' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Cards Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => {
                const prodId = product.id || product._id;
                const inCart = cart.find((item) => (item.id || item._id) === prodId);
                return (
                  <div
                    key={prodId}
                    className="bg-white rounded-2xl border border-gray-200 p-3.5 flex flex-col justify-between hover:shadow-xl transition-all duration-200 hover:border-teal-400 group"
                  >
                    <div>
                      {/* Image + Badges */}
                      <div
                        onClick={() => setSelectedProduct(product)}
                        className="cursor-pointer relative"
                      >
                        <div className="w-full h-40 bg-gray-50 rounded-xl p-2 mb-2 flex items-center justify-center overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Rx Badge */}
                        {product.prescriptionRequired ? (
                          <span className="absolute top-2 left-2 text-[10px] font-extrabold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md border border-rose-200 flex items-center">
                            <FileText className="w-3 h-3 mr-0.5" />
                            Rx Required
                          </span>
                        ) : (
                          <span className="absolute top-2 left-2 text-[10px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-md border border-teal-200">
                            OTC
                          </span>
                        )}

                        {product.discount > 0 && (
                          <span className="absolute top-2 right-2 text-[10px] font-black bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded-md shadow-xs">
                            {product.discount}% OFF
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-gray-500">
                          <span className="text-teal-700 font-bold uppercase truncate max-w-[120px]">
                            {product.brand}
                          </span>
                          <span className="flex items-center text-amber-500 font-bold">
                            <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                            {product.rating || '4.5'}
                          </span>
                        </div>

                        <Link
                          to={`/products/${prodId}`}
                          className="text-xs font-semibold text-gray-800 line-clamp-2 hover:text-teal-700 transition"
                        >
                          {product.name}
                        </Link>

                        <div className="text-[10px] text-gray-400 truncate">
                          Sold by: {product.sellerName || 'Verified Pharmacy'}
                        </div>
                      </div>
                    </div>

                    {/* Price & Add to Cart button */}
                    <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        {product.mrp && product.mrp > product.price && (
                          <div className="text-[10px] text-gray-400 line-through">₹{product.mrp}</div>
                        )}
                        <div className="text-sm font-black text-gray-900">₹{product.price}</div>
                      </div>

                      {inCart ? (
                        <div className="flex items-center space-x-1.5 bg-teal-50 border border-teal-200 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(prodId, inCart.quantity - 1)}
                            className="w-6 h-6 rounded bg-white text-teal-800 font-bold text-xs flex items-center justify-center hover:bg-teal-100 shadow-2xs"
                          >
                            -
                          </button>
                          <span className="text-xs font-extrabold text-teal-900 px-1">
                            {inCart.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(prodId, inCart.quantity + 1)}
                            className="w-6 h-6 rounded bg-teal-700 text-white font-bold text-xs flex items-center justify-center hover:bg-teal-800 shadow-2xs"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(product)}
                          className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition shadow-xs cursor-pointer"
                        >
                          ADD
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto flex items-center justify-center text-gray-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-gray-800">No medicines matched your filter criteria</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Try loosening your filters, adjusting the price range slider, or clearing the search terms.
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, qty) => {
          addToCart(p, qty);
          setSelectedProduct(null);
        }}
        cartItems={cart}
      />
    </div>
  );
}
