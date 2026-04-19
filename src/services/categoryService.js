import axiosClient from '../utils/axiosClient';

const categoryService = {
  getCategoryTree: () => {
    return axiosClient.get('/categories/tree');
  },
  getCategoryById: (id) => {
    return axiosClient.get(`/categories/${id}`);
  }
};

export default categoryService;