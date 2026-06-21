import axiosClient from '../utils/axiosClient';

const adminOrderService = {
  getAllOrders: async (page = 0, size = 10, sortBy = 'createdAt', direction = 'desc') => {
    const response = await axiosClient.get('/admin/orders', {
      params: { page, size, sortBy, direction }
    });
    return response;
  },

  updateOrderStatus: async (orderId, newStatus) => {
    const response = await axiosClient.patch(`/admin/orders/${orderId}/status`, null, {
      params: { newStatus }
    });
    return response;
  }
};

export default adminOrderService;
