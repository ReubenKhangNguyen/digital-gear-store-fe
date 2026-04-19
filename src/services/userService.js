import axiosClient from '../utils/axiosClient';

const userService = {
  getAllUsers: () => {
    return axiosClient.get('/users');
  }
};

export default userService;
