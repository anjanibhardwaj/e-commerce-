import demoData from '../data/demoUsers.json';
import { apiClient } from './apiClient';

const SESSION_STORAGE_KEY = 'med_ecommerce_session';
const REGISTERED_USERS_KEY = 'med_ecommerce_registered_users';
const REGISTERED_SELLERS_KEY = 'med_ecommerce_registered_sellers';

/**
 * Authentication Service
 * Seamlessly integrates live Node.js + MongoDB backend API
 * with graceful demo fallback for offline or quick demonstration.
 */
export const authService = {
  /**
   * Log in user, seller, or admin
   * @param {string} email
   * @param {string} password
   * @param {'user'|'seller'|'admin'} expectedRole
   */
  async login(email, password, expectedRole) {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Map frontend 'user' to backend 'customer'
    const backendRole = expectedRole === 'user' ? 'customer' : expectedRole;

    try {
      // 1. Attempt Live Backend API login
      const response = await apiClient.post('/auth/login', {
        email: cleanEmail,
        password: cleanPassword,
        role: backendRole
      });

      if (response && response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;
        apiClient.setTokens(accessToken, refreshToken);

        // Normalize role for frontend expectations
        const normalizedUser = {
          ...user,
          role: user.role === 'customer' ? 'user' : user.role
        };

        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(normalizedUser));
        return normalizedUser;
      }
    } catch (apiErr) {
      console.warn('[authService] Live API login attempt failed or server offline, checking fallback:', apiErr.message);
      // If error was explicitly INVALID_CREDENTIALS or ACCOUNT_SUSPENDED from the server, do not fallback to mock
      if (apiErr.code === 'INVALID_CREDENTIALS' || apiErr.code === 'ACCOUNT_SUSPENDED' || apiErr.code === 'ACCOUNT_BLOCKED') {
        throw apiErr;
      }
    }

    // 2. Demo Local Fallback (ensures uninterrupted testing)
    const registeredUsers = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]');
    const registeredSellers = JSON.parse(localStorage.getItem(REGISTERED_SELLERS_KEY) || '[]');

    let pool = [];
    if (expectedRole === 'user') {
      pool = [...demoData.users, ...registeredUsers];
    } else if (expectedRole === 'seller') {
      pool = [...demoData.sellers, ...registeredSellers];
    } else if (expectedRole === 'admin') {
      pool = demoData.admins;
    } else {
      throw new Error(`Unsupported role: ${expectedRole}`);
    }

    const matched = pool.find(
      (account) => account.email.toLowerCase() === cleanEmail && account.password === cleanPassword
    );

    if (!matched) {
      throw new Error(
        `Invalid ${expectedRole.toUpperCase()} credentials. Please check your email and password.`
      );
    }

    if (matched.role === 'seller' && matched.status === 'suspended') {
      throw new Error('Your seller account has been suspended by administration. Please contact support.');
    }

    const { password: _, ...safeSession } = matched;
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(safeSession));
    return safeSession;
  },

  /**
   * Register a new customer
   */
  async registerUser(userData) {
    const cleanEmail = userData.email.trim().toLowerCase();

    try {
      const response = await apiClient.post('/auth/register', {
        name: userData.name,
        email: cleanEmail,
        password: userData.password,
        phone: userData.phone
      });

      if (response && response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;
        apiClient.setTokens(accessToken, refreshToken);

        const normalizedUser = {
          ...user,
          role: 'user',
          addresses: userData.address ? [
            {
              id: `addr-${Date.now()}`,
              tag: 'Home',
              street: userData.address,
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400001',
              isDefault: true
            }
          ] : []
        };

        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(normalizedUser));
        return normalizedUser;
      }
    } catch (apiErr) {
      console.warn('[authService] Live API registration failed, checking fallback:', apiErr.message);
      if (apiErr.code === 'USER_EXISTS') {
        throw apiErr;
      }
    }

    // Fallback registration
    const registeredUsers = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]');
    const allUsers = [...demoData.users, ...registeredUsers];

    if (allUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email already exists. Please log in.');
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: cleanEmail,
      phone: userData.phone || '+91 9999999999',
      role: 'user',
      isPlusMember: false,
      addresses: userData.address ? [
        {
          id: `addr-${Date.now()}`,
          tag: 'Home',
          street: userData.address,
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          isDefault: true
        }
      ] : []
    };

    registeredUsers.push(newUser);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredUsers));

    const { password: _, ...safeSession } = newUser;
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(safeSession));
    return safeSession;
  },

  /**
   * Register a new pharmacy seller
   */
  async registerSeller(sellerData) {
    const cleanEmail = sellerData.email.trim().toLowerCase();
    const registeredSellers = JSON.parse(localStorage.getItem(REGISTERED_SELLERS_KEY) || '[]');
    const allSellers = [...demoData.sellers, ...registeredSellers];

    if (allSellers.some((s) => s.email.toLowerCase() === cleanEmail)) {
      throw new Error('A seller with this email is already registered.');
    }

    const newSeller = {
      id: `seller-${Date.now()}`,
      name: sellerData.businessName,
      contactPerson: sellerData.contactPerson,
      email: cleanEmail,
      phone: sellerData.phone,
      role: 'seller',
      status: 'pending',
      licenseNumber: sellerData.licenseNumber || `DL-${Math.floor(10000 + Math.random() * 90000)}`,
      gstin: sellerData.gstin || '27AAACB9999Z1',
      city: sellerData.city || 'Mumbai',
      address: sellerData.address || '',
      rating: 5.0,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    registeredSellers.push(newSeller);
    localStorage.setItem(REGISTERED_SELLERS_KEY, JSON.stringify(registeredSellers));

    const { password: _, ...safeSession } = newSeller;
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(safeSession));
    return safeSession;
  },

  /**
   * Read current session from localStorage
   */
  getCurrentUser() {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  /**
   * Terminate active session
   */
  logout() {
    apiClient.clearTokens();
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return true;
  }
};
