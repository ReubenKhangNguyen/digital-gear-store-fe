import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AdminRoute() {
    const { isAuthenticated, user, isLoading } = useContext(AuthContext);

    // 1. Chờ load token (nếu user F5 trang)
    if (isLoading) {
        return <div style={{ textAlign: "center", marginTop: "50px" }}>Đang kiểm tra quyền...</div>;
    }

    // 2. Chưa đăng nhập -> Đẩy ra trang Login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 3. Đã đăng nhập nhưng KHÔNG phải ADMIN -> Đẩy về trang chủ (hoặc trang 403)
    if (!user?.roles?.includes('ADMIN')) {
        return <Navigate to="/" replace />;
    }

    // 4. Mọi thứ OK -> Mở cửa (Outlet) cho vào trang Admin
    return <Outlet />;
}