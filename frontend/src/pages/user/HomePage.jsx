import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import QuickServices from '../../components/QuickServices';
import HeroBanners from '../../components/HeroBanners';
import LabTestsSection from '../../components/LabTestsSection';
import PrescriptionBanner from '../../components/PrescriptionBanner';
import ShopByCategory from '../../components/ShopByCategory';
import ProductSlider from '../../components/ProductSlider';
import PlusBanner from '../../components/PlusBanner';
import LabTestsGrid from '../../components/LabTestsGrid';
import FeaturedBrands from '../../components/FeaturedBrands';
import DealsOfTheDay from '../../components/DealsOfTheDay';
import PromoStrip from '../../components/PromoStrip';
import HealthArticles from '../../components/HealthArticles';
import WhyChooseUs from '../../components/WhyChooseUs';
import AppDownloadBanner from '../../components/AppDownloadBanner';
import CustomerReviews from '../../components/CustomerReviews';
import SeoAccordion from '../../components/SeoAccordion';
import SeoContent from '../../components/SeoContent';

// Detail Modals
import ProductDetailModal from '../../components/ProductDetailModal';
import LabTestModal from '../../components/LabTestModal';
import ArticleModal from '../../components/ArticleModal';

import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { mockFrequentlyBookedLabTests } from '../../data/mockData';

export default function HomePage() {
  const { products, cart, addToCart, showToast } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const outletCtx = useOutletContext();
  const selectedCity = outletCtx?.selectedCity;

  // Selected item modal states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedLabTest, setSelectedLabTest] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Group products into sliders dynamically based on category/tag
  const approvedProducts = products.filter((p) => p.approvalStatus === 'approved');
  const newLaunches = approvedProducts.slice(0, 10);
  const trending = approvedProducts.slice(5, 15);
  const wellness = approvedProducts.filter((p) => p.category.includes('Vitamins') || p.category.includes('Wellness') || p.category.includes('Ayurvedic'));
  const spotlight = approvedProducts.filter((p) => p.discount >= 20 || p.featured);

  const handleSearch = (term) => {
    navigate(`/products?search=${encodeURIComponent(term)}`);
  };

  return (
    <div className="space-y-2">
      {/* 1. Quick Services Badges */}
      <QuickServices
        onSelectService={(service) => {
          if (service.id === 'lab') {
            const el = document.getElementById('lab-tests');
            el?.scrollIntoView({ behavior: 'smooth' });
          } else if (service.id === 'plus') {
            const el = document.getElementById('plus-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          } else if (service.id === 'off') {
            navigate('/products?discount=20');
          } else if (service.id === 'doc') {
            showToast('Connecting with online certified doctor specialist (₹199)...', 'info');
          } else {
            handleSearch(service.title);
          }
        }}
      />

      {/* 2. Hero Promotional Banners */}
      <HeroBanners
        onBannerAction={(action) => {
          if (action === 'lab') {
            setSelectedLabTest(mockFrequentlyBookedLabTests[0]);
          } else if (action === 'consult') {
            showToast('Doctor consultation slot confirmed! Physician assigned.', 'info');
          } else {
            navigate('/products');
          }
        }}
      />

      {/* 3. Lab Tests by Health Concern */}
      <LabTestsSection
        onSelectConcern={(concern) => {
          setSelectedLabTest({
            id: `concern-${concern.id}`,
            name: `${concern.name} Comprehensive Health Package`,
            price: 1899,
            mrp: 3800,
            testsIncluded: 72,
            fastingRequired: 'Fasting 10-12 hours required',
            reportTime: 'Reports delivered within 24 hours',
            tag: 'DIAGNOSTIC'
          });
        }}
      />

      {/* 4. Order with Prescription Banner */}
      <PrescriptionBanner
        onOpenPrescription={() => {
          // Triggers modal in UserLayout or route
          const btn = document.querySelector('button[title="Upload Prescription"]');
          if (btn) btn.click();
          else showToast('Please click "+ Upload Prescription" in the top bar to submit Rx.', 'info');
        }}
      />

      {/* 5. Shop by Category */}
      <ShopByCategory
        onSelectCategory={(categoryName) => {
          navigate(`/products?category=${encodeURIComponent(categoryName)}`);
        }}
      />

      {/* 6. New Launches Slider */}
      <ProductSlider
        id="new-launches"
        title="New Launches"
        subtitle="New healthcare &amp; wellness range curated for you"
        products={newLaunches}
        onAddToCart={addToCart}
        onOpenProductDetail={(p) => setSelectedProduct(p)}
        cartItems={cart}
      />

      {/* 7. Trending Near You */}
      <ProductSlider
        id="trending-near-you"
        title="Trending Near You"
        subtitle={`Popular healthcare products ordered in ${selectedCity ? selectedCity.name : 'your city'}`}
        products={trending}
        onAddToCart={addToCart}
        onOpenProductDetail={(p) => setSelectedProduct(p)}
        cartItems={cart}
      />

      {/* 8. Plus VIP Banner */}
      <PlusBanner
        onExplorePlus={() => {
          showToast('PharmEasy Plus VIP membership active! Save 5% extra on every order.', 'success');
        }}
      />

      {/* 9. Frequently Booked Lab Tests */}
      <LabTestsGrid
        onBookTest={(test) => setSelectedLabTest(test)}
      />

      {/* 10. Wellness Essentials Slider */}
      <ProductSlider
        id="wellness-essentials"
        title="Wellness Essentials of the Week"
        subtitle="Supercharge immunity and daily vitality"
        products={wellness.length > 0 ? wellness : approvedProducts.slice(0, 8)}
        onAddToCart={addToCart}
        onOpenProductDetail={(p) => setSelectedProduct(p)}
        cartItems={cart}
      />

      {/* 11. Featured Brands */}
      <FeaturedBrands
        onSelectBrand={(brandName) => {
          navigate(`/products?brand=${encodeURIComponent(brandName)}`);
        }}
      />

      {/* 12. Deals of the Day with Countdown */}
      <DealsOfTheDay
        onAddToCart={addToCart}
        onOpenProductDetail={(p) => setSelectedProduct(p)}
        cartItems={cart}
      />

      {/* 13. In The Spotlight */}
      <ProductSlider
        id="spotlight"
        title="In The Spotlight"
        subtitle="Hand-picked wellness heroes with special promotional savings"
        products={spotlight.length > 0 ? spotlight : approvedProducts.slice(2, 10)}
        onAddToCart={addToCart}
        onOpenProductDetail={(p) => setSelectedProduct(p)}
        cartItems={cart}
      />

      {/* 14. Promotional Strips */}
      <PromoStrip
        onBannerClick={(promoTitle) => handleSearch(promoTitle)}
      />

      {/* 15. Verified Health Articles */}
      <HealthArticles
        onSelectArticle={(article) => setSelectedArticle(article)}
      />

      {/* 16. Why Choose Us */}
      <WhyChooseUs />

      {/* 17. App Download Banner */}
      <AppDownloadBanner
        onNotify={(msg) => showToast(msg, 'info')}
      />

      {/* 18. Customer Reviews */}
      <CustomerReviews />

      {/* 19. SEO Accordion */}
      <SeoAccordion
        onKeywordClick={(keyword) => handleSearch(keyword)}
      />

      {/* 20. SEO Content */}
      <SeoContent />

      {/* Detail Overlays */}
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

      <LabTestModal
        test={selectedLabTest}
        isOpen={!!selectedLabTest}
        onClose={() => setSelectedLabTest(null)}
        onBookingSuccess={(booking) => {
          showToast(`Doorstep lab test sample collection booked for ${booking.patientName}!`, 'success');
        }}
      />

      <ArticleModal
        article={selectedArticle}
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </div>
  );
}
