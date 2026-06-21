// src/services/productService.js
import axiosClient from '../utils/axiosClient';

const productService = {
  // Lấy danh sách sản phẩm (có thể kèm theo các filter như categoryId, brandId...)
  // TODO (Backend): Cập nhật endpoint cho khớp với Controller
  searchProducts: (params) => {
    return axiosClient.get('/products/search', { params });
  },

  // (Dành cho trang Chi tiết sản phẩm sau này)
  getProductById: (id) => {
    return axiosClient.get(`/products/${id}`);
  },
  createProduct: (data) => {
    return axiosClient.post('/products', data);
  },
  updateProduct: (id, data) => {
    return axiosClient.put(`/products/${id}`, data);
  },
  deleteProduct: (id) => {
    return axiosClient.delete(`/products/${id}`);
  }
};

export default productService;