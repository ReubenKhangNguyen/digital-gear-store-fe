import axiosClient from '../utils/axiosClient';

const userService = {
  getAllUsers: () => {
    return axiosClient.get('/users');
  },

  getMyInfo: () => {
    return axiosClient.get('/users/myinfo'); 
  },

  updateMyInfo: (data) => {
    return axiosClient.put('/users/myinfo', data);
  },

  changePassword: (data) => {
    return axiosClient.patch('/users/password', data);
  },

  updateUserStatus: (userId, isActive) => {
    return axiosClient.patch(`/users/${userId}/status`, null, {
      params: { isActive }
    });
  }

};

export default userService;
