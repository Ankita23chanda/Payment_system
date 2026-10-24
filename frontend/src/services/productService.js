import { api } from './api';

export const productService = {
  /**
   * Get all active agriculture categories
   */
  getCategories: async () => {
    return await api.get('/products/categories/');
  },

  /**
   * Get filterable list of agricultural products
   */
  getProducts: async (filters = {}) => {
    const query = new URLSearchParams();
    if (filters.search) query.append('search', filters.search);
    if (filters.category) query.append('category', filters.category);
    if (filters.brand) query.append('brand', filters.brand);
    if (filters.min_price) query.append('min_price', filters.min_price);
    if (filters.max_price) query.append('max_price', filters.max_price);
    if (filters.in_stock) query.append('in_stock', 'true');
    if (filters.sort) query.append('sort', filters.sort);

    const queryString = query.toString();
    const endpoint = queryString ? `/products/?${queryString}` : '/products/';
    return await api.get(endpoint);
  },

  /**
   * Get comprehensive product dossier with specs & safety info
   */
  getProductById: async (idOrSlug) => {
    return await api.get(`/products/${idOrSlug}/`);
  },
};
