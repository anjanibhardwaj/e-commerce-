import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Toast from '../components/Toast';
import {
  Crown,
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
  ShieldCheck,
  Activity
} from 'lucide-react';

export default function SuperAdminLayout() {
  const { user, logout } = useAuth();
  const { sellers, products, orders, toast, closeToast } = useData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/superadmin/login');
  };

  const navItems = [
    { name: 'Executive Overview', path: '/superadmin/dashboard', icon: Crown },
    { name: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'All Platform Orders', path: '/admin/orders', icon: ClipboardList, badge: orders.length },
    { name: 'Product Catalog Control', path: '/admin/products', icon: PackageCheck, badge: products.length },
    { name: 'Sellers & Licensing', path: '/admin/sellers', icon: Building2, badge: sellers.length },
    { name: 'Customer Accounts', path: '/admin/users', icon: Users },
    { name: 'Category Taxonomy', path: '/admin/categories', icon: Layers },
    { name: 'Financial Revenue & Audit', path: '/admin/reports', icon: BarChart4 },
    { name: 'System Settings', path: '/admin/settings', icon: Sliders }
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans text-slate-100">
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
          className={`fixed lg:static top-0 bottom-0 left-0 w-68 bg-[#0e0e13] text-slate-300 z-40 border-r border-purple-900/30 transform transition-transform duration-200 ease-in-out lg:translate-x-0 flex flex-col justify-between ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div>
            {/* Header / Logo */}
            <div className="h-16 px-6 flex items-center justify-between border-b border-purple-900/30 bg-purple-950/20">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 bg-purple-600/20 border border-purple-500/40 rounded-xl flex items-center justify-center text-amber-400">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-black text-sm tracking-wider text-white block">
                    SUPER<span className="text-amber-400">ADMIN</span>
                  </span>
                  <span className="text-[10px] text-purple-300/70 block uppercase font-bold tracking-widest">
                    Executive Control
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav list */}
            <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-140px)]">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-200">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* User profile & Logout */}
          <div className="p-4 border-t border-purple-900/30 bg-purple-950/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-xs">
                  SA
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white truncate max-w-[120px]">
                    {user?.name || 'Chief SuperAdmin'}
                  </div>
                  <div className="text-[10px] text-amber-400 font-semibold uppercase">
                    Platform Master
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#09090d] overflow-y-auto">
          {/* Top Bar */}
          <header className="h-16 bg-[#101017] border-b border-purple-900/30 px-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-1.5 text-slate-400 hover:text-white"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="text-xs text-purple-300 font-bold hidden sm:block">
                Master Governance Mode • Real-Time Database Sync Active
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <Link
                to="/admin/dashboard"
                className="px-3 py-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-900/70 border border-purple-700/40 text-purple-200 font-bold transition"
              >
                Open Admin Operations &rarr;
              </Link>
            </div>
          </header>

          <main className="p-6 sm:p-8 flex-1">
            <Outlet />
          </main>
        </div>
      </div>

      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}
