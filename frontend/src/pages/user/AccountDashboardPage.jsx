import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  User, 
  Package, 
  MapPin, 
  Heart, 
  LogOut, 
  ShieldCheck, 
  CreditCard,
  Phone,
  Mail,
  ChevronRight
} from 'lucide-react';

export default function AccountDashboardPage() {
  const { user, logout } = useAuth();
  const { orders, wishlist } = useData();
  const location = useLocation();
  const navigate = useNavigate();

  const userOrders = orders.filter((o) => o.userId === user?.id || o.userEmail === user?.email);

  const navItems = [
    { label: 'My Orders & Tracking', path: '/account/orders', icon: Package, count: userOrders.length },
    { label: 'Delivery Addresses', path: '/account/addresses', icon: MapPin },
    { label: 'Saved Wishlist', path: '/account/wishlist', icon: Heart, count: wishlist.length },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar */}
        <aside className="space-y-4">
          {/* User Profile Card */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs text-center space-y-3">
            <div className="w-16 h-16 bg-teal-100 text-teal-800 rounded-full flex items-center justify-center mx-auto text-xl font-black">
              {user?.name ? user.name[0] : 'U'}
            </div>
            <div>
              <div className="flex items-center justify-center space-x-1.5">
                <h2 className="text-base font-extrabold text-gray-900">{user?.name || 'Customer'}</h2>
                {user?.isPlusMember && (
                  <span className="text-[9px] bg-amber-100 text-amber-900 font-extrabold px-1.5 py-0.5 rounded-full">
                    VIP
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">{user?.email}</p>
              <p className="text-xs text-gray-500">{user?.phone}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs divide-y divide-gray-100">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between p-4 text-xs font-bold transition ${
                    isActive ? 'bg-teal-50 text-teal-800' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-teal-700" />
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    {item.count !== undefined && item.count > 0 && (
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px]">
                        {item.count}
                      </span>
                    )}
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </Link>
              );
            })}

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-4 text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out Account</span>
            </button>
          </div>
        </aside>

        {/* Right Main Content */}
        <div className="lg:col-span-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
