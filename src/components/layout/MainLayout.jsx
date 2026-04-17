import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main>
        {/* If using nested routes render Outlet, otherwise render children */}
        <Outlet />
        {children}
      </main>
      <Footer />
    </>
  );
}
