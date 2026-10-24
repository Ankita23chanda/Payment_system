import { api } from './api';

export const orderService = {
  /**
   * Submit checkout and generate authoritative Order.
   * Links the order to the authenticated customer's permanent Customer ID.
   */
  checkout: async (checkoutData) => {
    return await api.post('/orders/checkout/', checkoutData);
  },

  /**
   * List all orders for the authenticated customer.
   * Orders are fetched by Customer ID via JWT — no email/phone params needed.
   * Returns 401 if not authenticated.
   */
  getOrders: async () => {
    return await api.get('/orders/');
  },

  /**
   * Get single order details by order_number.
   * Server enforces ownership — only the customer who placed the order can see it.
   */
  getOrderDetails: async (orderNumber) => {
    return await api.get(`/orders/${orderNumber}/`);
  },
};
