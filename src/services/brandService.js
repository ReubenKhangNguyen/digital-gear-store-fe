import axiosClient from '../utils/axiosClient';

const brandService = {
  getAllBrands: () => {
    return axiosClient.get('/brands');
  },
  getBrandById: (id) => {
    return axiosClient.get(`/brands/${id}`);
  }
};

export default brandService;