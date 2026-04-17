// src/services/productService.js
import axiosClient from '../utils/axiosClient';

const productService = {
  // Lấy danh sách sản phẩm (có thể kèm theo các filter như categoryId, brandId...)
  // TODO (Backend): Cập nhật endpoint cho khớp với Controller của em
  getProducts: (params) => {
    return axiosClient.get('/products', { params }); 
  },
  
  // (Dành cho trang Chi tiết sản phẩm sau này)
  getProductById: (id) => {
      return axiosClient.get(`/products/${id}`);
  }
};

export default productService;