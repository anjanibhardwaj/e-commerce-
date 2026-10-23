import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Toast from '../components/Toast';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  Boxes,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Store,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Bell
} from 'lucide-react';

export default function SellerLayout() {
  const { user, logout } = useAuth();
  const { orders, products, toast, closeToast } = useData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/seller/login');
  };

  // Filter seller-specific statistics
  const sellerProducts = products.filter((p) => p.sellerId === user?.id);
  const sellerOrders = orders.filter((o) => o.sellerId === user?.id || !o.sellerId);
  const pendingOrdersCount = sellerOrders.filter((o) => o.status === 'placed' || o.status === 'verified').length;

  const navLinks = [
    { name: 'Dashboard', path: '/seller/dashboard', icon: LayoutDashboard },
    { name: 'My Products', path: '/seller/products', icon: Package, badge: sellerProducts.length },
    { name: 'Add Medicine', path: '/seller/products/add', icon: PlusCircle },
    { name: 'Order Fulfillment', path: '/seller/orders', icon: ShoppingBag, badge: pendingOrdersCount, badgeColor: 'bg-rose-500' },
    { name: 'Inventory & Expiry', path: '/seller/inventory', icon: Boxes },
    { name: 'Sales & Reports', path: '/seller/reports', icon: BarChart3 },
    { name: 'Store Settings', path: '/seller/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Multi-Panel Navigation Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-2 flex flex-wrap items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
          <span className="font-bold text-white tracking-wide">SELLER HUB:</span>
          <span className="text-slate-400">Pharmacy Partner Merchant Portal</span>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <Link to="/" className="flex items-center space-x-1 hover:text-white text-teal-400 transition">
            <span>Customer Storefront</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
          <span className="text-slate-700">|</span>
          <Link to="/admin/login" className="flex items-center space-x-1 hover:text-white text-amber-400 transition">
            <span>Admin Portal</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Backdrop */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-xs"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static top-0 bottom-0 left-0 w-64 bg-slate-900 text-slate-300 z-40 transform transition-transform duration-200 ease-in-out lg:translate-x-0 flex flex-col justify-between ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div>
            {/* Pharmacy Branding */}
            <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800 bg-slate-950/40">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold shadow-md">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-white leading-tight">Pharmacy Hub</h2>
                  <span className="text-[10px] text-teal-400 uppercase font-semibold tracking-wider">Seller Center</span>
                </div>
              </div>

              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Seller Account Badge */}
            <div className="p-4 mx-3 my-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white truncate max-w-[130px]">
                  {user?.name || 'Partner Pharmacy'}
                </span>
                {user?.status === 'approved' ? (
                  <span className="inline-flex items-center text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-400" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded-full font-bold">
                    <AlertCircle className="w-3 h-3 mr-1 text-amber-400" />
                    Pending
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400">
                Lic: <span className="font-mono text-slate-300">{user?.licenseNumber || 'DL-PENDING'}</span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="px-3 space-y-1 mt-2">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? 'bg-teal-700 text-white shadow-md shadow-teal-900/30'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                      }`
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full text-white font-bold ${
                          item.badgeColor || 'bg-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-slate-800 space-y-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-900/40 rounded-xl transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out Seller</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Header Bar */}
          <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden sm:block">
                <h1 className="text-base font-bold text-gray-800">
                  Seller Merchant Workspace
                </h1>
                <p className="text-xs text-gray-500">
                  Manage inventory, process medicine dispatches &amp; compliance
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/seller/orders"
                className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition"
                title="Active Orders"
              >
                <Bell className="w-5 h-5" />
                {pendingOrdersCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>
                )}
              </Link>

              <div className="flex items-center space-x-2 pl-2 border-l border-gray-200">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                  {user?.name ? user.name[0] : 'S'}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-bold text-gray-800 truncate max-w-[120px]">
                    {user?.name}
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase">{user?.role}</div>
                </div>
              </div>
            </div>
          </header>

          {/* Pending Verification Notice Banner if seller is not yet approved */}
          {user?.status === 'pending' && (
            <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center space-x-3 text-amber-900 text-xs">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <strong className="font-bold">Account Verification Pending:</strong> Your pharmacy drug license ({user?.licenseNumber}) is currently being reviewed by Platform Compliance Administrators. You can configure products and settings now, which will go live as soon as verified.
              </div>
            </div>
          )}

          {/* Page Body */}
          <main className="p-4 sm:p-6 lg:p-8 flex-1">
            <Outlet />
          </main>
        </div>
      </div>

      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}
