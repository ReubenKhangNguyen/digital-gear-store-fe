import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import HomePage from "../pages/public/HomePage";
import StorePage from "../pages/public/StorePage";
import ProductDetailPage from "../pages/public/ProductDetailPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="store" element={<StorePage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />
      </Route>
    </Routes>
  );
}
