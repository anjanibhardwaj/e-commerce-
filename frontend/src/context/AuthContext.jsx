import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session on page refresh
    const session = authService.getCurrentUser();
    if (session) {
      setUser(session);
    }
    setLoading(false);
  }, []);

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

  const logout = () => {
    authService.logout();
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
    logout
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
