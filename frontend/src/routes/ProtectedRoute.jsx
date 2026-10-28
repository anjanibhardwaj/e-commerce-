import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-gray-600">Verifying session permissions...</p>
        </div>
      </div>
    );
  }

  // Not logged in -> send to corresponding role login page
  if (!user) {
    let loginPath = '/login';
    if (requiredRole === 'seller') loginPath = '/seller/login';
    if (requiredRole === 'admin') loginPath = '/admin/login';
    if (requiredRole === 'superadmin') loginPath = '/superadmin/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Check role authorization
  const userRole = (role || user.role || 'user').toLowerCase();

  // Role permissions checking:
  // - 'user' routes can be accessed by regular customers or any authenticated user
  // - 'seller' routes can only be accessed by sellers
  // - 'admin' routes can be accessed by admin or superadmin
  // - 'superadmin' routes can only be accessed by superadmin
  let isAuthorized = true;

  if (requiredRole === 'superadmin') {
    isAuthorized = userRole === 'superadmin';
  } else if (requiredRole === 'admin') {
    isAuthorized = userRole === 'admin' || userRole === 'superadmin';
  } else if (requiredRole === 'seller') {
    isAuthorized = userRole === 'seller';
  } else if (requiredRole === 'user') {
    // Regular customer area - any authenticated account can place orders
    isAuthorized = true;
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl border border-rose-200 text-center space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-200">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">Access Restricted</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            You are logged in as <span className="font-bold uppercase text-teal-700">{userRole}</span>. You do not have permissions to access the <span className="font-bold uppercase text-rose-600">{requiredRole}</span> panel.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
