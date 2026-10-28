import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  User, 
  Percent, 
  ShoppingCart, 
  ChevronDown, 
  ChevronRight, 
  Upload, 
  Pill, 
  Sparkles, 
  FileText, 
  PhoneCall,
  X,
  Activity,
  Truck
} from 'lucide-react';
import { useData } from '../context/DataContext';

export default function Header({ 
  cartCount, 
  onOpenCart, 
  onOpenLocation, 
  selectedCity, 
  onOpenLogin, 
  onOpenTrackOrder,
  user, 
  onOpenPrescription,
  onOpenOffers,
  onSearchProduct,
  onSelectProduct
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const searchRef = useRef(null);
  const navRef = useRef(null);

  const { products, lastRefreshedAt } = useData();

  // Search live products from MongoDB Atlas
  const filteredSuggestions = (products || [])
    .filter((item) => {
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      return (
        item.name?.toLowerCase().includes(q) ||
        item.brand?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q)
      );
    })
    .slice(0, 8);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Smart Hide on Scroll Down, Show on Scroll Up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show when near top of the page
      if (currentScrollY < 60) {
        setIsHeaderVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      // Scrolling down: Hide header
      if (currentScrollY > lastScrollY + 10) {
        setIsHeaderVisible(false);
        setActiveDropdown(null);
        setShowSearchDropdown(false);
      } 
      // Scrolling up: Show header
      else if (currentScrollY < lastScrollY - 10) {
        setIsHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearchProduct(searchTerm);
      setShowSearchDropdown(false);
    }
  };

  return (
    <header className={`bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs transition-transform duration-300 ease-in-out ${
      isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Delivery Location */}
          <div className="flex items-center space-x-6 sm:space-x-8">
            <a href="#" className="flex items-center group">
              <div className="flex flex-col">
                <span className="text-[10px] text-teal-800 font-semibold tracking-wider italic uppercase">Take it easy</span>
                <div className="flex items-center">
                  <span className="text-2xl sm:text-3xl font-extrabold text-teal-700 tracking-tight flex items-center">
                    <span className="text-emerald-500 mr-1 inline-flex items-center justify-center bg-teal-50 rounded-full p-1 border border-teal-200">
                      <Pill className="w-5 h-5 text-teal-700" />
                    </span>
                    Pharm<span className="text-emerald-500">Easy</span>
                  </span>
                </div>
              </div>
            </a>

            {/* Delivery Location Selector */}
            <button 
              onClick={onOpenLocation}
              className="hidden md:flex items-center text-left py-1.5 px-3 rounded-lg hover:bg-gray-100 transition border border-transparent hover:border-gray-200"
            >
              <MapPin className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
              <div className="text-xs">
                <div className="text-gray-500 font-medium leading-none mb-0.5">Delivery to</div>
                <div className="text-gray-800 font-semibold flex items-center leading-none">
                  <span className="truncate max-w-[130px]">{selectedCity ? `${selectedCity.name} ${selectedCity.pincode}` : "Select Location"}</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1 text-gray-400" />
                </div>
              </div>
            </button>
          </div>

          {/* Right Action Icons (Live Sync, Log in, Offers, Cart) */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            
            {/* Real-time DB 3s refresh indicator */}
            <div 
              title="Real-time live sync connected to MongoDB Atlas (updates every 3s)"
              className="hidden lg:inline-flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[11px] font-bold shadow-2xs"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live DB (3s)</span>
            </div>

            {/* User Login */}
            <button 
              onClick={onOpenLogin}
              className="flex items-center text-xs font-semibold text-gray-700 hover:text-teal-700 transition px-2 py-1.5 rounded-lg hover:bg-gray-50"
            >
              <div className="w-7 h-7 rounded-full bg-teal-50 flex items-center justify-center mr-2 border border-teal-100">
                <User className="w-4 h-4 text-teal-700" />
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-gray-500 font-normal block text-[10px] leading-tight">
                  {user ? "Welcome back" : "Hello, Log in"}
                </span>
                <span className="font-bold text-gray-800 text-xs">
                  {user ? user.name : "My Account"}
                </span>
              </div>
            </button>

            {/* Track Order */}
            <button 
              onClick={onOpenTrackOrder}
              className="flex items-center text-xs font-semibold text-gray-700 hover:text-teal-700 transition px-2 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <Truck className="w-4 h-4 mr-1.5 text-gray-600" />
              <span className="hidden sm:inline">Track Order</span>
            </button>

            {/* Offers */}
            <button 
              onClick={onOpenOffers}
              className="flex items-center text-xs font-semibold text-gray-700 hover:text-teal-700 transition px-2 py-1.5 rounded-lg hover:bg-gray-50"
            >
              <Percent className="w-4 h-4 mr-1.5 text-gray-600" />
              <span className="hidden sm:inline">Offers</span>
            </button>

            {/* Cart */}
            <button 
              onClick={onOpenCart}
              className="flex items-center text-xs font-semibold text-gray-700 hover:text-teal-700 transition px-3 py-1.5 rounded-lg bg-teal-50/70 border border-teal-100 hover:bg-teal-100/70 relative"
            >
              <div className="relative mr-2">
                <ShoppingCart className="w-4 h-4 text-teal-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span>Cart</span>
            </button>

          </div>
        </div>

        {/* Secondary Category Navigation Link Row */}
        <nav ref={navRef} className="flex items-center space-x-4 sm:space-x-8 text-[13px] font-medium text-gray-700 border-t border-gray-100 py-2.5 relative flex-wrap sm:flex-nowrap">
          
          {/* Medicine Dropdown */}
          <div className="relative group shrink-0">
            <button 
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'medicine' ? null : 'medicine')}
              className="flex items-center hover:text-teal-700 transition py-1 cursor-pointer focus:outline-none"
            >
              <span>Medicine</span>
              <ChevronDown className={`w-3.5 h-3.5 ml-1 text-gray-400 transition-transform ${activeDropdown === 'medicine' ? 'rotate-180 text-teal-700' : 'group-hover:rotate-180'}`} />
            </button>
            <div className={`absolute top-full left-0 ${activeDropdown === 'medicine' ? 'block' : 'hidden group-hover:block'} w-56 bg-white border border-gray-200 shadow-2xl rounded-2xl py-2 mt-1 z-50 animate-in fade-in zoom-in-95 duration-150`}>
              <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1">
                Pharmacy Services
              </div>
              <a 
                href="#new-launches" 
                onClick={() => setActiveDropdown(null)}
                className="flex items-center px-4 py-2 hover:bg-teal-50 text-xs text-gray-800 hover:text-teal-800 font-semibold transition"
              >
                All Medicines &amp; Generics
              </a>
              <a 
                href="#deals-day" 
                onClick={() => setActiveDropdown(null)}
                className="flex items-center px-4 py-2 hover:bg-teal-50 text-xs text-gray-800 hover:text-teal-800 font-semibold transition"
              >
                Daily Essentials &amp; Refills
              </a>
              <a 
                href="#spotlight" 
                onClick={() => setActiveDropdown(null)}
                className="flex items-center px-4 py-2 hover:bg-teal-50 text-xs text-gray-800 hover:text-teal-800 font-semibold transition"
              >
                Ayurvedic &amp; Herbal Care
              </a>
              <a 
                href="#wellness-essentials" 
                onClick={() => setActiveDropdown(null)}
                className="flex items-center px-4 py-2 hover:bg-teal-50 text-xs text-gray-800 hover:text-teal-800 font-semibold transition"
              >
                Homeopathy Medicines
              </a>
              <div className="mt-1 pt-1 border-t border-gray-100 px-3">
                <button 
                  onClick={() => {
                    setActiveDropdown(null);
                    onOpenPrescription();
                  }}
                  className="w-full text-left py-1 text-[11px] font-bold text-teal-700 hover:underline cursor-pointer"
                >
                  + Upload Prescription Directly
                </button>
              </div>
            </div>
          </div>

          {/* Healthcare Dropdown */}
          <div className="relative group shrink-0">
            <button 
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'healthcare' ? null : 'healthcare')}
              className="flex items-center hover:text-teal-700 transition py-1 cursor-pointer focus:outline-none"
            >
              <span>Healthcare</span>
              <ChevronDown className={`w-3.5 h-3.5 ml-1 text-gray-400 transition-transform ${activeDropdown === 'healthcare' ? 'rotate-180 text-teal-700' : 'group-hover:rotate-180'}`} />
            </button>
            <div className={`absolute top-full left-0 ${activeDropdown === 'healthcare' ? 'block' : 'hidden group-hover:block'} w-56 bg-white border border-gray-200 shadow-2xl rounded-2xl py-2 mt-1 z-50 animate-in fade-in zoom-in-95 duration-150`}>
              <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1">
                Popular Categories
              </div>
              <a 
                href="#shop-category" 
                onClick={() => setActiveDropdown(null)}
                className="flex items-center px-4 py-2 hover:bg-teal-50 text-xs text-gray-800 hover:text-teal-800 font-semibold transition"
              >
                Personal Care &amp; Hygiene
              </a>
              <a 
                href="#shop-category" 
                onClick={() => setActiveDropdown(null)}
                className="flex items-center px-4 py-2 hover:bg-teal-50 text-xs text-gray-800 hover:text-teal-800 font-semibold transition"
              >
                Healthcare &amp; BP Devices
              </a>
              <a 
                href="#shop-category" 
                onClick={() => setActiveDropdown(null)}
                className="flex items-center px-4 py-2 hover:bg-teal-50 text-xs text-gray-800 hover:text-teal-800 font-semibold transition"
              >
                Vitamins &amp; Dietary Nutrition
              </a>
              <a 
                href="#shop-category" 
                onClick={() => setActiveDropdown(null)}
                className="flex items-center px-4 py-2 hover:bg-teal-50 text-xs text-gray-800 hover:text-teal-800 font-semibold transition"
              >
                Sports &amp; Fitness Supplements
              </a>
              <a 
                href="#shop-category" 
                onClick={() => setActiveDropdown(null)}
                className="flex items-center px-4 py-2 hover:bg-teal-50 text-xs text-gray-800 hover:text-teal-800 font-semibold transition"
              >
                Diabetes Care Essentials
              </a>
            </div>
          </div>

          {/* Doctor Consult */}
          <a href="#doctor-consult" className="shrink-0 hover:text-teal-700 transition flex items-center py-1">
            Doctor Consult <span className="ml-1.5 px-1.5 py-0.2 bg-rose-100 text-rose-700 text-[10px] rounded-full font-bold">FROM ₹199</span>
          </a>

          {/* Lab Tests Dropdown */}
          <div className="relative group shrink-0">
            <button 
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'labtests' ? null : 'labtests')}
              className="flex items-center hover:text-teal-700 transition py-1 cursor-pointer focus:outline-none"
            >
              <span>Lab Tests</span>
              <ChevronDown className={`w-3.5 h-3.5 ml-1 text-gray-400 transition-transform ${activeDropdown === 'labtests' ? 'rotate-180 text-teal-700' : 'group-hover:rotate-180'}`} />
            </button>
            <div className={`absolute top-full left-0 ${activeDropdown === 'labtests' ? 'block' : 'hidden group-hover:block'} w-60 bg-white border border-gray-200 shadow-2xl rounded-2xl py-2 mt-1 z-50 animate-in fade-in zoom-in-95 duration-150`}>
              <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1 flex items-center justify-between">
                <span>Thyrocare Tests</span>
                <span className="text-teal-600 font-bold">Free Home Pickup</span>
              </div>
              <a 
                href="#lab-tests" 
                onClick={() => setActiveDropdown(null)}
                className="flex items-center px-4 py-2 hover:bg-teal-50 text-xs text-gray-800 hover:text-teal-800 font-semibold transition"
              >
                Full Body Health Checkups
              </a>
              <a 
                href="#frequently-booked-tests" 
                onClick={() => setActiveDropdown(null)}
                className="flex items-center px-4 py-2 hover:bg-teal-50 text-xs text-gray-800 hover:text-teal-800 font-semibold transition"
              >
                Fever &amp; Dengue Tests
              </a>
              <a 
                href="#frequently-booked-tests" 
                onClick={() => setActiveDropdown(null)}
                className="flex items-center px-4 py-2 hover:bg-teal-50 text-xs text-gray-800 hover:text-teal-800 font-semibold transition"
              >
                Thyroid &amp; Hormone Profiles
              </a>
              <a 
                href="#frequently-booked-tests" 
                onClick={() => setActiveDropdown(null)}
                className="flex items-center px-4 py-2 hover:bg-teal-50 text-xs text-gray-800 hover:text-teal-800 font-semibold transition"
              >
                Diabetes HbA1c &amp; Glucose
              </a>
            </div>
          </div>

          {/* PLUS Link */}
          <a href="#plus-section" className="shrink-0 hover:text-teal-700 transition flex items-center font-bold text-amber-600 py-1">
            PLUS <span className="ml-1 px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[10px] rounded-full font-bold">Save 5% Extra</span>
          </a>

          {/* Health Insights Dropdown */}
          <div className="relative group shrink-0">
            <button 
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'insights' ? null : 'insights')}
              className="flex items-center hover:text-teal-700 transition py-1 cursor-pointer focus:outline-none"
            >
              <span>Health Insights</span>
              <ChevronDown className={`w-3.5 h-3.5 ml-1 text-gray-400 transition-transform ${activeDropdown === 'insights' ? 'rotate-180 text-teal-700' : 'group-hover:rotate-180'}`} />
            </button>
            <div className={`absolute top-full left-0 ${activeDropdown === 'insights' ? 'block' : 'hidden group-hover:block'} w-56 bg-white border border-gray-200 shadow-2xl rounded-2xl py-2 mt-1 z-50 animate-in fade-in zoom-in-95 duration-150`}>
              <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1">
                Doctor Articles
              </div>
              <a 
                href="#health-articles" 
                onClick={() => setActiveDropdown(null)}
                className="flex items-center px-4 py-2 hover:bg-teal-50 text-xs text-gray-800 hover:text-teal-800 font-semibold transition"
              >
                Verified Health Articles
              </a>
              <a 
                href="#health-articles" 
                onClick={() => setActiveDropdown(null)}
                className="flex items-center px-4 py-2 hover:bg-teal-50 text-xs text-gray-800 hover:text-teal-800 font-semibold transition"
              >
                Disease &amp; Diagnosis Guides
              </a>
              <a 
                href="#health-articles" 
                onClick={() => setActiveDropdown(null)}
                className="flex items-center px-4 py-2 hover:bg-teal-50 text-xs text-gray-800 hover:text-teal-800 font-semibold transition"
              >
                Pregnancy &amp; Women Wellness
              </a>
            </div>
          </div>

          {/* Offers */}
          <button 
            onClick={onOpenOffers} 
            className="shrink-0 hover:text-teal-700 transition py-1 cursor-pointer"
          >
            Offers
          </button>

          {/* AskEasy */}
          <a href="#ask-easy" className="shrink-0 text-teal-700 font-semibold hover:text-teal-800 flex items-center bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
            <Sparkles className="w-3 h-3 mr-1 text-teal-600 animate-pulse" />
            AskEasy
          </a>
        </nav>
      </div>

      {/* Main Search Section (As seen in Screenshot Page 1) */}
      <div className="bg-slate-50 border-t border-b border-gray-200 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              What are you looking for?
            </h1>
            <button 
              onClick={onOpenPrescription}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center hover:underline self-start sm:self-auto"
            >
              <FileText className="w-3.5 h-3.5 mr-1 text-teal-600" />
              Order with prescription. <span className="uppercase font-bold ml-1 text-teal-800 underline">UPLOAD NOW &gt;</span>
            </button>
          </div>

          {/* Search Input Box */}
          <div className="relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="flex items-center shadow-sm rounded-full overflow-hidden border-2 border-teal-600 bg-white focus-within:ring-2 focus-within:ring-teal-400/40">
              <div className="pl-4 pr-2 text-gray-400">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                placeholder="Search for Medicines, Health Drinks, Vitamins, Lab Tests..." 
                className="w-full py-3 px-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
              />
              {searchTerm && (
                <button 
                  type="button" 
                  onClick={() => setSearchTerm('')} 
                  className="p-1 mr-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button 
                type="submit"
                className="bg-teal-700 hover:bg-teal-800 text-white font-semibold px-6 sm:px-8 py-3 text-sm transition shrink-0"
              >
                Search
              </button>
            </form>

            {/* Live Autocomplete Dropdown */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                <div className="p-2 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500 font-semibold px-4">
                  <span>{searchTerm ? "Search Results" : "Popular Searches"}</span>
                  <span className="text-[11px] text-teal-600">Verified by PharmEasy Doctors</span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                  {filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((item, idx) => (
                      <div 
                        key={idx}
                        onClick={() => {
                          onSearchProduct(item.name);
                          setShowSearchDropdown(false);
                        }}
                        className="p-3 px-4 hover:bg-teal-50/70 cursor-pointer flex items-center justify-between transition group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-teal-700 group-hover:bg-teal-100 transition">
                            <Search className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-800 group-hover:text-teal-800">
                              {item.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {item.category}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded">
                          {item.price}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500">
                      No matching products found for "{searchTerm}". Press Enter to search catalog.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
