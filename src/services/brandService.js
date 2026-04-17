// src/services/brandService.js
import axiosClient from '../utils/axiosClient';

const brandService = {
  // TODO (Backend - Catalog): Đường dẫn này phải khớp với @GetMapping bên BrandController của em
  getAllBrands: () => {
    return axiosClient.get('/brands'); 
  }
};

export default brandService;