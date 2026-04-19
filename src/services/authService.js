import axiosClient from '../utils/axiosClient';

// -----------------------------------------------------------------------------
// KHỐI GIAO TIẾP API XÁC THỰC (AUTHENTICATION)
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
  }
};

export default authService;
