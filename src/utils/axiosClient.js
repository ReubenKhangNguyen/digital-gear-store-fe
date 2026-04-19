import axios from 'axios';

// -----------------------------------------------------------------------------
// [1] CAU HINH AXIOS TỔNG (Axios Instance)
// - Tại sao dùng axios.create? 
//   Để tạo một phiên bản axios dùng chung 1 cấu hình (như đường dẫn API gốc và các Header cơ bản).
// - Lấy dữ liệu API gốc (baseURL) từ file .env qua `import.meta.env.VITE_API_URL`
//   Thường sẽ trỏ về: http://localhost:8080/digital-store-api/v1
// -----------------------------------------------------------------------------
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// -----------------------------------------------------------------------------
// [2] REQUEST INTERCEPTOR (Bảo vệ phía gửi đi)
// - Cơ chế: Bất cứ khi nào ứng dụng gọi API (POST, GET...), hàm này sẽ chạy TRƯỚC TIÊN.
// - Nhiệm vụ: Vào kho localStorage tìm xem có `accessToken` không. 
//   Nếu có -> Gắn chuỗi "Bearer <token>" vào trong Header Authorization.
//   Nhờ vậy Backend Spring Boot (có cấu hình JWT Filter) mới biết user là ai.
// -----------------------------------------------------------------------------
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // JWT chuẩn phải có chữ Bearer
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// -----------------------------------------------------------------------------
// [3] RESPONSE INTERCEPTOR (Bảo vệ phía nhận về)
// - Cơ chế: Khi Backend trả kết quả về (Status 200 OK, 400 ERROR...), hàm này chạy trước khi tới component.
// - Nhiệm vụ 1: Rút gọn `response.data` về (Thay vì phải gọi res.data.result liên tục trong component).
// - Nhiệm vụ 2: Bắt lỗi Toàn cục. Ví dụ, nếu Server báo 401 Unauthorized (Token hết hạn, sai token),
//   nó sẽ LẬP TỨC đá người dùng văng ra màn hình '/login' và xóa cờ Token cũ.
// -----------------------------------------------------------------------------
axiosClient.interceptors.response.use((response) => {
  return response.data; // Trả thẳng data của response cho component
}, (error) => {
  if (error.response && error.response.status === 401) {
    // 401: Token hết hạn hoặc không có quyền truy cập
    localStorage.removeItem('accessToken');
    window.location.href = '/login'; // Điều hướng về trang đăng nhập
  }
  return Promise.reject(error);
});

export default axiosClient;