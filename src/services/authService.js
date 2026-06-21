import axiosClient from '../utils/axiosClient';

// -----------------------------------------------------------------------------
// GIAO TIẾP API XÁC THỰC (AUTHENTICATION)
// Chứa mã gọi Data trực tiếp xuống các Controller bên Spring Boot
// -----------------------------------------------------------------------------
const authService = {
  // Đăng ký tài khoản (Gọi xuống UserController.java)
  register: (userData) => {
    return axiosClient.post('/users', userData);
  },

  // Đăng nhập để lấy token (Gọi xuống AuthenticationController.java)
  // Payload: { "username": "...", "password": "..." }
  login: (username, password) => {
    return axiosClient.post('/auth/login', { username, password });
  },

  // Kiểm tra token có hợp lệ không (Gọi xuống AuthenticationController.java)
  introspect: (token) => {
    return axiosClient.post('/auth/introspect', { token });
  },

  // Quên mật khẩu - Yêu cầu gửi OTP
  forgotPassword: (email) => {
    return axiosClient.post('/auth/forgot-password', { email });
  },

  // Đổi mật khẩu mới với OTP
  resetPassword: (email, otpCode, newPassword) => {
    return axiosClient.post('/auth/reset-password', { email, otpCode, newPassword });
  }
};

export default authService;
