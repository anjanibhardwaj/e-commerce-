import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import UserLayout from '../layouts/UserLayout';
import SellerLayout from '../layouts/SellerLayout';
import AdminLayout from '../layouts/AdminLayout';
import SuperAdminLayout from '../layouts/SuperAdminLayout';

// Route Guards
import ProtectedRoute from './ProtectedRoute';

// User Panel Pages
import HomePage from '../pages/user/HomePage';
import ProductListingPage from '../pages/user/ProductListingPage';
import ProductDetailPage from '../pages/user/ProductDetailPage';
import CartPage from '../pages/user/CartPage';
import CheckoutPage from '../pages/user/CheckoutPage';
import UserLoginPage from '../pages/user/UserLoginPage';
import UserRegisterPage from '../pages/user/UserRegisterPage';
import AccountDashboardPage from '../pages/user/AccountDashboardPage';
import OrdersHistoryPage from '../pages/user/OrdersHistoryPage';
import AddressesPage from '../pages/user/AddressesPage';
import WishlistPage from '../pages/user/WishlistPage';

// Seller Panel Pages
import SellerLoginPage from '../pages/seller/SellerLoginPage';
import SellerRegisterPage from '../pages/seller/SellerRegisterPage';
import SellerDashboardPage from '../pages/seller/SellerDashboardPage';
import SellerProductsPage from '../pages/seller/SellerProductsPage';
import SellerAddProductPage from '../pages/seller/SellerAddProductPage';
import SellerOrdersPage from '../pages/seller/SellerOrdersPage';
import SellerInventoryPage from '../pages/seller/SellerInventoryPage';
import SellerReportsPage from '../pages/seller/SellerReportsPage';
import SellerSettingsPage from '../pages/seller/SellerSettingsPage';

// Admin Panel Pages
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminSellersPage from '../pages/admin/AdminSellersPage';
import AdminProductsPage from '../pages/admin/AdminProductsPage';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';
import AdminPrescriptionsPage from '../pages/admin/AdminPrescriptionsPage';
import AdminCategoriesPage from '../pages/admin/AdminCategoriesPage';
import AdminReportsPage from '../pages/admin/AdminReportsPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';

// SuperAdmin Panel Pages
import SuperAdminLoginPage from '../pages/superadmin/SuperAdminLoginPage';
import SuperAdminDashboardPage from '../pages/superadmin/SuperAdminDashboardPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* =========================================
          1. USER PANEL (Storefront & Customer Area)
          ========================================= */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListingPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        
        {/* Guarded Checkout */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute requiredRole="user">
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        {/* Customer Account Area */}
        <Route
          path="/account"
          element={
            <ProtectedRoute requiredRole="user">
              <AccountDashboardPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/account/orders" replace />} />
          <Route path="orders" element={<OrdersHistoryPage />} />
          <Route path="addresses" element={<AddressesPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
        </Route>

        {/* User Auth */}
        <Route path="/login" element={<UserLoginPage />} />
        <Route path="/register" element={<UserRegisterPage />} />
      </Route>

      {/* =========================================
          2. SELLER PANEL (Merchant Pharmacy Hub)
          ========================================= */}
      <Route path="/seller/login" element={<SellerLoginPage />} />
      <Route path="/seller/register" element={<SellerRegisterPage />} />

      <Route
        path="/seller"
        element={
          <ProtectedRoute requiredRole="seller">
            <SellerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/seller/dashboard" replace />} />
        <Route path="dashboard" element={<SellerDashboardPage />} />
        <Route path="products" element={<SellerProductsPage />} />
        <Route path="products/add" element={<SellerAddProductPage />} />
        <Route path="orders" element={<SellerOrdersPage />} />
        <Route path="inventory" element={<SellerInventoryPage />} />
        <Route path="reports" element={<SellerReportsPage />} />
        <Route path="settings" element={<SellerSettingsPage />} />
      </Route>

      {/* =========================================
          3. ADMIN PANEL (Platform Operations Center)
          ========================================= */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="sellers" element={<AdminSellersPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="prescriptions" element={<AdminPrescriptionsPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* =========================================
          4. SUPERADMIN PANEL (Executive Governance)
          ========================================= */}
      <Route path="/superadmin/login" element={<SuperAdminLoginPage />} />

      <Route
        path="/superadmin"
        element={
          <ProtectedRoute requiredRole="superadmin">
            <SuperAdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/superadmin/dashboard" replace />} />
        <Route path="dashboard" element={<SuperAdminDashboardPage />} />
      </Route>

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
