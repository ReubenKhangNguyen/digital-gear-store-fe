import axiosClient from '../utils/axiosClient';

const brandService = {
  getAllBrands: () => {
    return axiosClient.get('/brands');
  },
  getBrandById: (id) => {
    return axiosClient.get(`/brands/${id}`);
  },
  createBrand: (data) => {
    return axiosClient.post('/brands', data);
  },
  updateBrand: (id, data) => {
    return axiosClient.put(`/brands/${id}`, data);
  },
  deleteBrand: (id) => {
    return axiosClient.delete(`/brands/${id}`);
  }
};

export default brandService;