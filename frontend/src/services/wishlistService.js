import { api } from './api';

export const wishlistService = {
  /**
   * Get all wishlist items for the authenticated customer.
   */
  getWishlist: async () => {
    return await api.get('/users/wishlist/');
  },

  /**
   * Add a product to the customer's wishlist.
   * @param {number} productId
   */
  addToWishlist: async (productId) => {
    return await api.post('/users/wishlist/', { product_id: productId });
  },

  /**
   * Remove a product from the customer's wishlist.
   * @param {number} productId
   */
  removeFromWishlist: async (productId) => {
    return await api.delete(`/users/wishlist/${productId}/`);
  },
};
