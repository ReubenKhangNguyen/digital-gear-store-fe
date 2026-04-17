import axiosClient from '../utils/axiosClient';

const categoryService = {
  // Tương đương hàm getCategoryTree() bên Spring Boot
  getCategoryTree: () => {
    return axiosClient.get('/categories/tree');
  }
};

export default categoryService;