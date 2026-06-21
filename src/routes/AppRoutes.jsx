import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import HomePage from '../pages/public/HomePage';
import StorePage from '../pages/public/StorePage';
import ProductDetailPage from '../pages/public/ProductDetailPage';
import ProfilePage from '../pages/public/ProfilePage';
import CartPage from '../pages/public/CartPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import OAuth2RedirectPage from '../pages/auth/OAuth2RedirectPage';
import CheckoutPage from '../pages/public/CheckoutPage';
import CheckoutSuccessPage from '../pages/public/CheckoutSuccessPage';
import OrderHistoryPage from '../pages/public/OrderHistoryPage';
import OrderDetailPage from '../pages/public/OrderDetailPage';

// --- ADMIN IMPORTS ---
import AdminLayout from '../components/admin/layout/AdminLayout';
import DashboardPage from '../pages/admin/DashboardPage';
import ProductListPage from '../pages/admin/ProductListPage';
import CreateProductPage from '../pages/admin/CreateProductPage';
import UpdateProductPage from '../pages/admin/UpdateProductPage';
import CategoryListPage from '../pages/admin/CategoryListPage';
import BrandListPage from '../pages/admin/BrandListPage';
import UserListPage from '../pages/admin/UserListPage';
import AdminOrderListPage from '../pages/admin/AdminOrderListPage';
import AdminRoute from './AdminRoutes';
import PrivateRoute from './PrivateRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. PUBLIC ROUTES (Main Layout) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/cart" element={
          <PrivateRoute>
            <CartPage />
          </PrivateRoute>
        } />
        <Route path="/checkout" element={
          <PrivateRoute>
            <CheckoutPage />
          </PrivateRoute>
        } />
        <Route path="/checkout-success" element={
          <PrivateRoute>
            <CheckoutSuccessPage />
          </PrivateRoute>
        } />
        <Route path="/my-orders" element={
          <PrivateRoute>
            <OrderHistoryPage />
          </PrivateRoute>
        } />
        <Route path="/my-orders/:id" element={
          <PrivateRoute>
            <OrderDetailPage />
          </PrivateRoute>
        } />
      </Route>

      {/* 2. AUTH ROUTES (No Layout / Blank) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/oauth2/redirect" element={<OAuth2RedirectPage />} />

      {/* 3. ADMIN ROUTES (Admin Layout) */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductListPage />} />
          <Route path="products/create" element={<CreateProductPage />} />
          <Route path="products/update/:id" element={<UpdateProductPage />} />

          {/* API-driven Pages */}
          <Route path="categories" element={<CategoryListPage />} />
          <Route path="brands" element={<BrandListPage />} />
          <Route path="users" element={<UserListPage />} />
          <Route path="orders" element={<AdminOrderListPage />} />
        </Route>
      </Route>

      {/* 4. ERROR ROUTES */}
      <Route path="*" element={<h1 className="text-center" style={{ marginTop: '50px' }}>404 - Không tìm thấy trang</h1>} />
    </Routes>
  );
}
