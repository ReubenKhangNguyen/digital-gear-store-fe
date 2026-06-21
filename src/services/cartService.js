import axiosClient from '../utils/axiosClient';

const cartService = {
  getMyCart: async () => {
    return await axiosClient.get('/carts/my-cart');
  },

  addToCart: async (productId, quantity = 1) => {
    return await axiosClient.post('/carts/items', { productId, quantity });
  },

  updateCartItem: async (cartItemId, quantity) => {
    return await axiosClient.put(`/carts/items/${cartItemId}?quantity=${quantity}`);
  },

  removeCartItem: async (cartItemId) => {
    return await axiosClient.delete(`/carts/items/${cartItemId}`);
  },

  clearCart: async () => {
    return await axiosClient.delete('/carts/items');
  }
};

export default cartService;
