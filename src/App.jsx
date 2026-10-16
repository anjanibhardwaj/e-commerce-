import React, { useState } from 'react';
import Header from './components/Header';
import QuickServices from './components/QuickServices';
import HeroBanners from './components/HeroBanners';
import LabTestsSection from './components/LabTestsSection';
import PrescriptionBanner from './components/PrescriptionBanner';
import ShopByCategory from './components/ShopByCategory';
import ProductSlider from './components/ProductSlider';
import PlusBanner from './components/PlusBanner';
import LabTestsGrid from './components/LabTestsGrid';
import FeaturedBrands from './components/FeaturedBrands';
import DealsOfTheDay from './components/DealsOfTheDay';
import PromoStrip from './components/PromoStrip';
import HealthArticles from './components/HealthArticles';
import WhyChooseUs from './components/WhyChooseUs';
import AppDownloadBanner from './components/AppDownloadBanner';
import CustomerReviews from './components/CustomerReviews';
import SeoAccordion from './components/SeoAccordion';
import SeoContent from './components/SeoContent';
import Footer from './components/Footer';

// Modals & Overlays
import CartDrawer from './components/CartDrawer';
import LocationModal from './components/LocationModal';
import LoginModal from './components/LoginModal';
import PrescriptionModal from './components/PrescriptionModal';
import ProductDetailModal from './components/ProductDetailModal';
import LabTestModal from './components/LabTestModal';
import OffersModal from './components/OffersModal';
import ArticleModal from './components/ArticleModal';
import AskEasyChatModal from './components/AskEasyChatModal';
import CheckoutModal from './components/CheckoutModal';
import Toast from './components/Toast';

import { mockProducts, mockCities, mockFrequentlyBookedLabTests } from './data/mockData';
import { X, ArrowLeft, Filter } from 'lucide-react';

export default function App() {
  // Global cart state
  const [cart, setCart] = useState([
    {
      id: "tr-1",
      name: "Shelcal 500mg Strip Of 15 Tablets",
      mrp: 164,
      price: 154,
      image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=60",
      quantity: 1
    }
  ]);

  // Delivery City
  const [selectedCity, setSelectedCity] = useState(mockCities[0]); // Mumbai
  const [user, setUser] = useState(null);

  // Search filter view
  const [searchFilter, setSearchFilter] = useState('');

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [isOffersOpen, setIsOffersOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedLabTest, setSelectedLabTest] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [checkoutData, setCheckoutData] = useState(null);

  // Toast notifications
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast({ message });
  };

  // Cart operations
  const handleAddToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prev, { ...product, quantity }];
      }
    });
    showToast(`Added "${product.name.slice(0, 28)}..." to cart!`);
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id);
    } else {
      setCart((prev) =>
        prev.map(item => (item.id === id ? { ...item, quantity: newQuantity } : item))
      );
    }
  };

  const handleRemoveItem = (id) => {
    setCart((prev) => prev.filter(item => item.id !== id));
    showToast("Item removed from your cart");
  };

  // Checkout trigger
  const handleProceedToCheckout = (data) => {
    setIsCartOpen(false);
    setCheckoutData(data);
  };

  const handleOrderConfirmed = (orderId) => {
    setCart([]);
    showToast(`Order #${orderId} placed successfully!`);
  };

  // Search Handler
  const handleSearch = (term) => {
    setSearchFilter(term);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // All catalog products combined for search
  const allProducts = [
    ...mockProducts.newLaunches,
    ...mockProducts.trending,
    ...mockProducts.dealsOfDay,
    ...mockProducts.inTheSpotlight,
    ...mockProducts.wellnessEssentials
  ];

  const filteredProducts = searchFilter 
    ? allProducts.filter(p => 
        p.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
        p.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(searchFilter.toLowerCase()))
      )
    : [];

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans selection:bg-teal-100 selection:text-teal-900">
      
      {/* 1. Header (Take it easy PharmEasy, Location, Login, Offers, Cart & Search Bar) */}
      <Header 
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenLocation={() => setIsLocationOpen(true)}
        selectedCity={selectedCity}
        onOpenLogin={() => setIsLoginOpen(true)}
        user={user}
        onOpenPrescription={() => setIsPrescriptionOpen(true)}
        onOpenOffers={() => setIsOffersOpen(true)}
        onSearchProduct={handleSearch}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <main>
        {/* If user searched something, show search results grid banner */}
        {searchFilter ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-gray-200">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setSearchFilter('')}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-teal-50 text-gray-700 hover:text-teal-700 transition cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Showing results for: <span className="text-teal-700">"{searchFilter}"</span>
                  </h2>
                  <p className="text-xs text-gray-500">
                    Found {filteredProducts.length} matching health products
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setSearchFilter('')}
                className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
              >
                Clear Search
              </button>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredProducts.map((product) => (
                  <div 
                    key={product.id}
                    className="bg-white rounded-2xl border border-gray-200 p-3.5 flex flex-col justify-between hover:shadow-xl transition-all duration-200 hover:border-teal-400"
                  >
                    <div 
                      onClick={() => setSelectedProduct(product)}
                      className="cursor-pointer"
                    >
                      <div className="w-full h-36 bg-gray-50 rounded-xl p-2 mb-2 flex items-center justify-center">
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                      </div>
                      <span className="text-[10px] text-teal-700 font-bold uppercase">{product.brand}</span>
                      <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 mt-0.5">{product.name}</h3>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        {product.mrp && <div className="text-[10px] text-gray-400 line-through">₹{product.mrp}</div>}
                        <div className="text-sm font-extrabold text-gray-900">₹{product.price}</div>
                      </div>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition cursor-pointer"
                      >
                        ADD
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-3">
                <p className="text-sm font-bold text-gray-700">No exact matches found for "{searchFilter}"</p>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Try searching for general terms like "Shelcal", "Liv 52", "Vitamin C", "Thyroid", or "Blood Pressure".
                </p>
                <button 
                  onClick={() => setSearchFilter('')}
                  className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer"
                >
                  Return to Home
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* 2. Quick Service Badges (Medicine, Lab Tests, Doctor Consult, Branded Substitute, Healthcare, etc.) */}
            <QuickServices 
              onSelectService={(service) => {
                if (service.id === 'lab') {
                  const el = document.getElementById('lab-tests');
                  el?.scrollIntoView({ behavior: 'smooth' });
                } else if (service.id === 'plus') {
                  const el = document.getElementById('plus-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                } else if (service.id === 'off') {
                  setIsOffersOpen(true);
                } else if (service.id === 'doc') {
                  showToast("Connecting with available online specialist doctor (₹199)...");
                } else {
                  handleSearch(service.title);
                }
              }}
            />

            {/* 3. Hero Promotional Banners Carousel (The Rains Are Here, Your Weight, Gut Health) */}
            <HeroBanners 
              onBannerAction={(action) => {
                if (action === 'lab') {
                  setSelectedLabTest(mockFrequentlyBookedLabTests[0]);
                } else if (action === 'consult') {
                  showToast("Doctor consultation slot opened! Dedicated physician assigned.");
                } else {
                  setIsChatOpen(true);
                }
              }}
            />

            {/* 4. Lab Tests by Health Concern (Full Body, Vitamins, Diabetes, Women Care, Fever, Thyroid) */}
            <LabTestsSection 
              onSelectConcern={(concern) => {
                setSelectedLabTest({
                  id: `concern-${concern.id}`,
                  name: `${concern.name} Diagnostic Health Package`,
                  price: 1899,
                  mrp: 3800,
                  testsIncluded: 72,
                  fastingRequired: "Fasting 10-12 hours required",
                  reportTime: "Reports within 24 hours",
                  tag: "SPECIAL LAB"
                });
              }}
            />

            {/* 5. Order with Prescription Banner & How does this work? (4 Steps) */}
            <PrescriptionBanner 
              onOpenPrescription={() => setIsPrescriptionOpen(true)}
            />

            {/* 6. Shop by Category (Health Must Haves, Personal Care, Healthcare Devices, etc.) */}
            <ShopByCategory 
              onSelectCategory={(categoryName) => {
                handleSearch(categoryName);
              }}
            />

            {/* 7. New Launches (Page 2) */}
            <ProductSlider 
              id="new-launches"
              title="New Launches"
              subtitle="New wellness range just for you!"
              products={mockProducts.newLaunches}
              onAddToCart={handleAddToCart}
              onOpenProductDetail={(p) => setSelectedProduct(p)}
              cartItems={cart}
            />

            {/* 8. Trending Near You (Page 2) */}
            <ProductSlider 
              id="trending-near-you"
              title="Trending Near You"
              subtitle={`Popular healthcare products in ${selectedCity ? selectedCity.name : "your city"}`}
              products={mockProducts.trending}
              onAddToCart={handleAddToCart}
              onOpenProductDetail={(p) => setSelectedProduct(p)}
              cartItems={cart}
            />

            {/* 9. Become a PLUS Member Banner (Page 2) */}
            <PlusBanner 
              onExplorePlus={() => {
                setUser({
                  name: "Rohan Sharma",
                  phone: "+91 9876543210",
                  email: "rohan@example.com",
                  isPlusMember: true
                });
                showToast("Congratulations! PharmEasy Plus VIP membership active for 1 year!");
              }}
            />

            {/* 10. Frequently Booked Lab Tests (Page 2) */}
            <LabTestsGrid 
              onBookTest={(test) => setSelectedLabTest(test)}
            />

            {/* 11. Wellness Essentials of the Week (Page 2 & 3) */}
            <ProductSlider 
              id="wellness-essentials"
              title="Wellness Essentials of the Week"
              subtitle="Super charge your immunity with us"
              products={mockProducts.wellnessEssentials}
              onAddToCart={handleAddToCart}
              onOpenProductDetail={(p) => setSelectedProduct(p)}
              cartItems={cart}
            />

            {/* 12. Featured Brands (Page 3) */}
            <FeaturedBrands 
              onSelectBrand={(brandName) => handleSearch(brandName)}
            />

            {/* 13. Deals of the Day with Countdown Timer (Page 3) */}
            <DealsOfTheDay 
              onAddToCart={handleAddToCart}
              onOpenProductDetail={(p) => setSelectedProduct(p)}
              cartItems={cart}
            />

            {/* 14. In The Spotlight (Page 3) */}
            <ProductSlider 
              id="spotlight"
              title="In The Spotlight"
              subtitle="Hand-picked wellness heroes with up to 53% discount"
              products={mockProducts.inTheSpotlight}
              onAddToCart={handleAddToCart}
              onOpenProductDetail={(p) => setSelectedProduct(p)}
              cartItems={cart}
            />

            {/* 15. Mini Promo Strip (Sunscreen, Men's Multivitamin, Energy, GRD) */}
            <PromoStrip 
              onBannerClick={(promoTitle) => handleSearch(promoTitle)}
            />

            {/* 16. Health Articles (Page 4) */}
            <HealthArticles 
              onSelectArticle={(article) => setSelectedArticle(article)}
            />

            {/* 17. Why Choose Us? (Page 4) */}
            <WhyChooseUs />

            {/* 18. App Download Section (Page 4) */}
            <AppDownloadBanner 
              onNotify={(msg) => showToast(msg)}
            />

            {/* 19. What Our Customers have to Say (Page 4) */}
            <CustomerReviews />

            {/* 20. Top SEO Keywords & Tests Directory (Page 4 & 5) */}
            <SeoAccordion 
              onKeywordClick={(keyword) => handleSearch(keyword)}
            />

            {/* 21. SEO Content Paragraphs (Page 5) */}
            <SeoContent />
          </>
        )}
      </main>

      {/* 22. Footer (Company, Featured Categories, Need Help, Policy, Payment badges, Floating WhatsApp) */}
      <Footer 
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* --- Modals & Drawers --- */}

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleProceedToCheckout}
        selectedCity={selectedCity}
      />

      {/* Location Modal */}
      <LocationModal 
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        onSelectCity={(city) => {
          setSelectedCity(city);
          showToast(`Delivery location updated to ${city.name} (${city.pincode})`);
        }}
        currentCity={selectedCity}
      />

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        currentUser={user}
        onLoginSuccess={(userData) => {
          setUser(userData);
          showToast(`Welcome back, ${userData.name}!`);
        }}
        onLogout={() => {
          setUser(null);
          showToast("Logged out successfully");
          setIsLoginOpen(false);
        }}
      />

      {/* Prescription Upload Modal */}
      <PrescriptionModal 
        isOpen={isPrescriptionOpen}
        onClose={() => setIsPrescriptionOpen(false)}
        onUploadSuccess={(data) => {
          showToast(`Prescription "${data.fileName}" submitted! Our pharmacist will contact you.`);
        }}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal 
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, qty) => {
          handleAddToCart(p, qty);
          setSelectedProduct(null);
        }}
        cartItems={cart}
      />

      {/* Lab Test Booking Modal */}
      <LabTestModal 
        test={selectedLabTest}
        isOpen={!!selectedLabTest}
        onClose={() => setSelectedLabTest(null)}
        onBookingSuccess={(booking) => {
          showToast(`Doorstep lab test booked for ${booking.patientName} on ${booking.date}!`);
        }}
      />

      {/* Offers Modal */}
      <OffersModal 
        isOpen={isOffersOpen}
        onClose={() => setIsOffersOpen(false)}
        onApplyCoupon={(coupon) => {
          setIsOffersOpen(false);
          setIsCartOpen(true);
          showToast(`Coupon ${coupon.code} copied!`);
        }}
      />

      {/* Health Article Modal */}
      <ArticleModal 
        article={selectedArticle}
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      {/* AskEasy Floating Chatbot */}
      <AskEasyChatModal 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onNavigate={(target) => {
          if (target === 'prescription-modal') {
            setIsPrescriptionOpen(true);
          } else {
            const el = document.querySelector(target);
            el?.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={!!checkoutData}
        orderDetails={checkoutData}
        onClose={() => setCheckoutData(null)}
        onOrderPlaced={handleOrderConfirmed}
        selectedCity={selectedCity}
      />

      {/* Global Toast */}
      <Toast 
        toast={toast}
        onClose={() => setToast(null)}
      />

    </div>
  );
}
