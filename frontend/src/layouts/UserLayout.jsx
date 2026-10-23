import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import LocationModal from '../components/LocationModal';
import PrescriptionModal from '../components/PrescriptionModal';
import OffersModal from '../components/OffersModal';
import AskEasyChatModal from '../components/AskEasyChatModal';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { mockCities } from '../data/mockData';
import { LayoutDashboard, Store, ShieldCheck, ArrowRight } from 'lucide-react';

export default function UserLayout() {
  const { user, role, logout } = useAuth();
  const { cart, updateQuantity, removeFromCart, toast, closeToast, showToast, uploadPrescription } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [isOffersOpen, setIsOffersOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(mockCities[0]);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleSearch = (term) => {
    navigate(`/products?search=${encodeURIComponent(term)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans selection:bg-teal-100 selection:text-teal-900 flex flex-col">
      {/* Quick Multi-Panel Switcher Pill Bar (Dev & Demo Showcase) */}
      <div className="bg-slate-900 text-white text-xs px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 z-50">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-slate-200">PharmEasy Demo Platform:</span>
          <span className="text-slate-400 hidden sm:inline">Active Mode: <strong className="text-teal-400">User Storefront</strong></span>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/seller/login"
            className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-teal-700 text-slate-200 hover:text-white font-medium transition text-[11px]"
          >
            <Store className="w-3.5 h-3.5 text-teal-400" />
            <span>Seller Hub</span>
          </Link>

          <Link
            to="/admin/login"
            className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-teal-700 text-slate-200 hover:text-white font-medium transition text-[11px]"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin Portal</span>
          </Link>
        </div>
      </div>

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
            navigate('/login');
          }
        }}
        user={user}
        onOpenPrescription={() => setIsPrescriptionOpen(true)}
        onOpenOffers={() => setIsOffersOpen(true)}
        onSearchProduct={handleSearch}
        onSelectProduct={(p) => navigate(`/products/${p.id}`)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        <Outlet context={{ setSelectedCity, selectedCity }} />
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

      {/* Global Toast */}
      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}
