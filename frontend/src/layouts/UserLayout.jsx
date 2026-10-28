import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import LocationModal from '../components/LocationModal';
import PrescriptionModal from '../components/PrescriptionModal';
import OffersModal from '../components/OffersModal';
import AskEasyChatModal from '../components/AskEasyChatModal';
import OrderTrackingModal from '../components/OrderTrackingModal';
import LoginModal from '../components/LoginModal';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { mockCities } from '../data/mockData';

export default function UserLayout() {
  const { user, isAuthModalOpen, openAuthModal, closeAuthModal, handleAuthSuccess } = useAuth();
  const { cart, updateQuantity, removeFromCart, toast, closeToast, showToast, uploadPrescription } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [isOffersOpen, setIsOffersOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(mockCities[0]);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    if (!user) {
      openAuthModal(() => {
        navigate('/checkout');
      });
      return;
    }
    navigate('/checkout');
  };

  const handleSearch = (term) => {
    navigate(`/products?search=${encodeURIComponent(term)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans selection:bg-teal-100 selection:text-teal-900 flex flex-col">
      {/* Main Header */}
      <Header
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenLocation={() => setIsLocationOpen(true)}
        selectedCity={selectedCity}
        onOpenLogin={() => {
          if (user) {
            navigate('/account');
          } else {
            openAuthModal();
          }
        }}
        onOpenTrackOrder={() => setIsTrackingOpen(true)}
        user={user}
        onOpenPrescription={() => setIsPrescriptionOpen(true)}
        onOpenOffers={() => setIsOffersOpen(true)}
        onSearchProduct={handleSearch}
        onSelectProduct={(p) => navigate(`/products/${p.id}`)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        <Outlet context={{ setSelectedCity, selectedCity, openAuthModal, setIsTrackingOpen }} />
      </main>

      {/* Main Footer */}
      <Footer onOpenChat={() => setIsChatOpen(true)} />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleProceedToCheckout}
        selectedCity={selectedCity}
      />

      {/* City Location Modal */}
      <LocationModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        onSelectCity={(city) => {
          setSelectedCity(city);
          showToast(`Delivery location set to ${city.name} (${city.pincode})`);
        }}
        currentCity={selectedCity}
      />

      {/* Prescription Upload Modal */}
      <PrescriptionModal
        isOpen={isPrescriptionOpen}
        onClose={() => setIsPrescriptionOpen(false)}
        onUploadSuccess={(data) => {
          uploadPrescription({
            userId: user?.id || 'guest-user',
            userName: user?.name || 'Walk-in Customer',
            patientName: data.patientName || user?.name || 'Patient',
            fileName: data.fileName || 'prescription.jpg'
          });
        }}
      />

      {/* Offers Modal */}
      <OffersModal
        isOpen={isOffersOpen}
        onClose={() => setIsOffersOpen(false)}
        onApplyCoupon={(coupon) => {
          setIsOffersOpen(false);
          setIsCartOpen(true);
          showToast(`Coupon ${coupon.code} applied!`);
        }}
      />

      {/* AskEasy AI / Support Assistant */}
      <AskEasyChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onNavigate={(target) => {
          if (target === 'prescription-modal') {
            setIsPrescriptionOpen(true);
          } else {
            navigate('/products');
          }
        }}
      />

      {/* Live Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
      />

      {/* Flipkart-Style Login / Signup Modal */}
      <LoginModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        onLoginSuccess={handleAuthSuccess}
      />

      {/* Global Toast */}
      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}
