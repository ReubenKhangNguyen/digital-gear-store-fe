import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import '../../../assets/css/admin-style.css'; // Import Theming

export default function AdminLayout() {
  // Thêm class cho body để chống xung đột với các CSS public, mặc dù admin-style.css phần lớn class độc lập.
  useEffect(() => {
    document.body.classList.add('admin-body');
    return () => {
      document.body.classList.remove('admin-body');
    };
  }, []);

  return (
    <div className="admin-wrapper">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
