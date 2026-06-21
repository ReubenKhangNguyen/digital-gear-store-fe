import axiosClient from '../utils/axiosClient';

const userAddressService = {
  getMyAddresses: async () => {
    const response = await axiosClient.get('/addresses');
    return response;
  },

  createAddress: async (data) => {
    const response = await axiosClient.post('/addresses', data);
    return response;
  },

  updateAddress: async (addressId, data) => {
    const response = await axiosClient.put(`/addresses/${addressId}`, data);
    return response;
  },

  deleteAddress: async (addressId) => {
    const response = await axiosClient.delete(`/addresses/${addressId}`);
    return response;
  },

  setDefaultAddress: async (addressId) => {
    const response = await axiosClient.patch(`/addresses/${addressId}/default`);
    return response;
  }
};

export default userAddressService;
