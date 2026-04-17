import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Tự động lấy URL từ file .env
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.response.use((response) => {
  return response.data; // Rút gọn dữ liệu trả về
}, (error) => {
  return Promise.reject(error);
});

export default axiosClient;