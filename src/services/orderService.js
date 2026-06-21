import axiosClient from '../utils/axiosClient';

const orderService = {
  checkout: async (data) => {
    const response = await axiosClient.post('/orders/checkout', data);
    return response;
  },

  getMyOrders: async () => {
    const response = await axiosClient.get('/orders/my-orders');
    return response;
  },

  getOrderById: async (orderId) => {
    const response = await axiosClient.get(`/orders/${orderId}`);
    return response;
  },

  cancelOrder: async (orderId) => {
    const response = await axiosClient.put(`/orders/${orderId}/cancel`);
    return response;
  }
};

export default orderService;
