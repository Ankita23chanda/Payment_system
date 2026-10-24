import { api } from './api';

export const paymentService = {
  /**
   * Create payment gateway order/session (Authoritative server amount)
   */
  createSession: async (orderNumber) => {
    return await api.post('/payments/create-session/', {
      order_number: orderNumber,
    });
  },

  /**
   * Submit transaction verification to backend
   */
  verifyPayment: async (payload) => {
    return await api.post('/payments/verify/', payload);
  },

  /**
   * Poll or check payment status
   */
  getStatus: async (orderNumber) => {
    return await api.get(`/payments/${orderNumber}/status/`);
  },
};
