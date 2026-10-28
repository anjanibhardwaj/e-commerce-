import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { authService, getRoleScopeFromPath } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const location = useLocation();

  const getScope = useCallback(() => {
    return getRoleScopeFromPath(location.pathname);
  }, [location.pathname]);

  const [user, setUser] = useState(() => authService.getCurrentUser(getRoleScopeFromPath(typeof window !== 'undefined' ? window.location.pathname : '')));
  const [loading, setLoading] = useState(false);

  // Flipkart-style global Auth Modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingCallback, setPendingCallback] = useState(null);

  // Sync active user when route changes or panel switches
  useEffect(() => {
    const scope = getScope();
    const session = authService.getCurrentUser(scope);
    setUser(session);
  }, [location.pathname, getScope]);

  // Listen to storage events for seamless multi-tab reactivity
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key && (e.key.startsWith('med_session_') || e.key === 'med_ecommerce_session')) {
        const scope = getScope();
        const session = authService.getCurrentUser(scope);
        setUser(session);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [getScope]);

  const openAuthModal = (callback = null) => {
    setPendingCallback(() => callback);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingCallback(null);
  };

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    setIsAuthModalOpen(false);
    if (typeof pendingCallback === 'function') {
      const cb = pendingCallback;
      setPendingCallback(null);
      cb(authenticatedUser);
    }
  };

  const login = async (email, password, expectedRole) => {
    const loggedInUser = await authService.login(email, password, expectedRole);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const registerUser = async (userData) => {
    const newUser = await authService.registerUser(userData);
    setUser(newUser);
    return newUser;
  };

  const registerSeller = async (sellerData) => {
    const newSeller = await authService.registerSeller(sellerData);
    setUser(newSeller);
    return newSeller;
  };

  const logout = (roleOverride) => {
    const scope = roleOverride || getScope();
    authService.logout(scope);
    setUser(null);
  };

  const value = {
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    loading,
    login,
    registerUser,
    registerSeller,
    logout,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    handleAuthSuccess
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
