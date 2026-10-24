import { api } from './api';

export const cartService = {
  /**
   * Fetch current cart with server calculations
   */
  getCart: async () => {
    return await api.get('/cart/');
  },

  /**
   * Add product to cart with quantity
   */
  addToCart: async (productId, quantity = 1) => {
    return await api.post('/cart/add/', {
      product_id: productId,
      quantity,
    });
  },

  /**
   * Update item quantity
   */
  updateQuantity: async (itemId, quantity) => {
    return await api.put(`/cart/items/${itemId}/`, {
      quantity,
    });
  },

  /**
   * Remove item from cart
   */
  removeItem: async (itemId) => {
    return await api.delete(`/cart/items/${itemId}/remove/`);
  },

  /**
   * Clear all items in cart
   */
  clearCart: async () => {
    return await api.post('/cart/clear/', {});
  },
};
