/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from "react";
import authService from "../services/authService";

// Tạo một Context dùng chung để mọi Component trong App đều có thể truy cập
// các biến như: isAuthenticated (Đã đăng nhập chưa), user (thông tin user), login, logout.
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // -----------------------------------------------------------------------------
  // HÀM XỬ LÝ LOGOUT 
  // Xóa Token khỏi trình duyệt (localStorage), reset state về rỗng.
  // -----------------------------------------------------------------------------
  function handleLogout() {
    localStorage.removeItem("accessToken");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }

  // -----------------------------------------------------------------------------
  // KIỂM TRA ĐĂNG NHẬP MỖI KHI F5 (RELOAD TRANG)
  // - Lấy Token từ kho localStorage.
  // - Gửi Token lên Backend (API /auth/introspect) để kiểm tra xem Token có bị giả mạo hay hết hạn không.
  // - Bắt buộc làm vậy để bảo mật, tránh việc User tự ấn F12 sửa localStorage nhập token rác.
  // -----------------------------------------------------------------------------
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("accessToken");
      if (storedToken) {
        try {
          // Gọi sang Backend để verify Token
          const response = await authService.introspect(storedToken);
          // Backend trả về: { result: { valid: true, fullName: '...' } }
          if (response?.result?.valid) {
             setToken(storedToken);
             setIsAuthenticated(true);
             setUser({
                fullName: response.result.fullName // Lưu tên hiển thị lên Header Admin
             });
          } else {
             handleLogout(); // Token vớ vẩn -> Đẩy ra ngoài
          }
        } catch (error) {
          console.error("Lỗi khi kiểm định Token (Introspect):", error);
          handleLogout();
        }
      }
      setIsLoading(false); // Quét xong thì tắt Loading màn hình
    };

    initializeAuth();
  }, []);

  // -----------------------------------------------------------------------------
  // HÀM XỬ LÝ LOGIN (Được gọi bên form LoginPage khi nhập đúng pass)
  // - Lưu Token mới vào localStorage. Set biến state để các giao diện mở khóa.
  // -----------------------------------------------------------------------------
  const handleLogin = (newToken, userData) => {
    localStorage.setItem("accessToken", newToken);
    setToken(newToken);
    setIsAuthenticated(true);
    setUser(userData);
  };

  // Cung cấp các biến và hàm này xuống Toàn bộ APP
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login: handleLogin, logout: handleLogout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
