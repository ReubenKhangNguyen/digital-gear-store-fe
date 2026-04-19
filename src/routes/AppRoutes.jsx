import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import HomePage from '../pages/public/HomePage';
import StorePage from '../pages/public/StorePage';
import ProductDetailPage from '../pages/public/ProductDetailPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// --- ADMIN IMPORTS ---
import AdminLayout from '../components/admin/layout/AdminLayout';
import DashboardPage from '../pages/admin/DashboardPage';
import ProductListPage from '../pages/admin/ProductListPage';
import CreateProductPage from '../pages/admin/CreateProductPage';
import CategoryListPage from '../pages/admin/CategoryListPage';
import BrandListPage from '../pages/admin/BrandListPage';
import UserListPage from '../pages/admin/UserListPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. PUBLIC ROUTES (Main Layout) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        {/* Có thể thêm các trang public khác ở đây: Checkout, Cart... */}
      </Route>

      {/* 2. AUTH ROUTES (No Layout / Blank) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* 3. ADMIN ROUTES (Admin Layout) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="products/create" element={<CreateProductPage />} />
        
        {/* API-driven Pages */}
        <Route path="categories" element={<CategoryListPage />} />
        <Route path="brands" element={<BrandListPage />} />
        <Route path="users" element={<UserListPage />} />
        
        {/* Placeholder cho các modules chưa có backend API */}
        <Route path="orders" element={<div><h2 style={{margin: '30px', fontWeight: 'bold'}}>Orders Manager (TBD)</h2></div>} />
      </Route>
      
      {/* 4. ERROR ROUTES */}
      <Route path="*" element={<h1 className="text-center" style={{marginTop: '50px'}}>404 - Không tìm thấy trang</h1>} />
    </Routes>
  );
}
