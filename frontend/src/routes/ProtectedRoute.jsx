import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

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
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Logged in with wrong role -> block cross-panel unauthorized access
  if (requiredRole && role !== requiredRole) {
    let targetDashboard = '/';
    if (role === 'seller') targetDashboard = '/seller/dashboard';
    if (role === 'admin') targetDashboard = '/admin/dashboard';

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl border border-rose-200 text-center space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-200">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">Access Restricted</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            You are logged in as a <span className="font-bold uppercase text-teal-700">{role}</span>. You do not have permissions to access the <span className="font-bold uppercase text-rose-600">{requiredRole}</span> panel.
          </p>
          <div className="pt-2">
            <Navigate to={targetDashboard} replace />
          </div>
        </div>
      </div>
    );
  }

  return children;
}
