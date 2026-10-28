import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Toast from '../components/Toast';
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Building2,
  PackageCheck,
  ClipboardList,
  FileCheck2,
  Layers,
  BarChart4,
  Sliders,
  LogOut,
  Menu,
  X,
  Activity,
  AlertTriangle
} from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { sellers, products, prescriptions, orders, toast, closeToast } = useData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const pendingSellersCount = sellers.filter((s) => s.status === 'pending').length;
  const pendingProductsCount = products.filter((p) => p.approvalStatus === 'pending').length;
  const pendingPrescriptionsCount = prescriptions.filter((rx) => rx.status === 'pending_review').length;

  const adminNav = [
    { name: 'Command Center', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Customer Accounts', path: '/admin/users', icon: Users },
    {
      name: 'Seller Licenses',
      path: '/admin/sellers',
      icon: Building2,
      badge: pendingSellersCount,
      badgeColor: 'bg-amber-500'
    },
    {
      name: 'Product Approvals',
      path: '/admin/products',
      icon: PackageCheck,
      badge: pendingProductsCount,
      badgeColor: 'bg-teal-500'
    },
    { name: 'Platform Orders', path: '/admin/orders', icon: ClipboardList, badge: orders.length },
    {
      name: 'Prescription Station',
      path: '/admin/prescriptions',
      icon: FileCheck2,
      badge: pendingPrescriptionsCount,
      badgeColor: 'bg-rose-500'
    },
    { name: 'Categories & Brands', path: '/admin/categories', icon: Layers },
    { name: 'Reports & Revenue', path: '/admin/reports', icon: BarChart4 },
    { name: 'System & Audit Logs', path: '/admin/settings', icon: Sliders }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Backdrop */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-xs"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static top-0 bottom-0 left-0 w-68 bg-[#0b2423] text-slate-300 z-40 transform transition-transform duration-200 ease-in-out lg:translate-x-0 flex flex-col justify-between ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div>
            {/* Header / Logo */}
            <div className="h-16 px-6 flex items-center justify-between border-b border-teal-900/40 bg-teal-950/60">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold border border-amber-500/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-white leading-tight">Admin Center</h2>
                  <span className="text-[10px] text-teal-300 uppercase font-semibold tracking-wider">Super Administrator</span>
                </div>
              </div>

              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* System Status Pill */}
            <div className="mx-3 my-3 p-3 rounded-2xl bg-teal-950/40 border border-teal-800/40 text-[11px] space-y-1">
              <div className="flex items-center justify-between text-teal-200 font-bold">
                <span className="flex items-center">
                  <Activity className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                  Engine Status
                </span>
                <span className="text-[10px] bg-emerald-900/80 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  Active
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Mode: Demo Credentials (JSON / LocalStore). Ready for Node.js API swap.
              </p>
            </div>

            {/* Navigation */}
            <nav className="px-3 space-y-1 mt-2">
              {adminNav.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? 'bg-teal-600 text-white shadow-lg shadow-teal-950/40 font-bold'
                          : 'text-slate-300 hover:bg-teal-900/40 hover:text-white'
                      }`
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4 shrink-0 text-teal-300" />
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

          {/* Bottom Logout */}
          <div className="p-4 border-t border-teal-900/40">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs font-bold text-rose-300 hover:text-rose-200 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-800/40 rounded-xl transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out Administrator</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Bar */}
          <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-base font-bold text-gray-900">
                  Platform Compliance &amp; Operations
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Verified Pharmacist Approvals, Licensing Audits &amp; Orders Monitoring
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 pl-3 border-l border-gray-200">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
                  {user?.name ? user.name[0] : 'A'}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-bold text-gray-900">{user?.name}</div>
                  <div className="text-[10px] text-amber-700 font-bold uppercase">{user?.department || 'System Admin'}</div>
                </div>
              </div>
            </div>
          </header>

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
