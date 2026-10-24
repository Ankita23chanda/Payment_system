import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    total_items_count: 0,
    summary: {
      subtotal: '0.00',
      discount_amount: '0.00',
      effective_subtotal: '0.00',
      shipping_fee: '0.00',
      tax_amount: '0.00',
      total_amount: '0.00',
      free_shipping_threshold: '999.00',
      free_shipping_applied: false,
    },
  });
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const fetchCart = async () => {
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      const res = await cartService.addToCart(productId, quantity);
      if (res.cart) {
        setCart(res.cart);
      }
      showToast('Item added to cart', 'success');
      return res;
    } catch (err) {
      showToast(err.message || 'Failed to add product', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await cartService.updateQuantity(itemId, quantity);
      if (res.cart) {
        setCart(res.cart);
      }
      return res;
    } catch (err) {
      showToast(err.message || 'Failed to update quantity', 'error');
      throw err;
    }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await cartService.removeItem(itemId);
      if (res.cart) {
        setCart(res.cart);
      }
      showToast('Item removed from cart', 'info');
      return res;
    } catch (err) {
      showToast(err.message || 'Failed to remove item', 'error');
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      const res = await cartService.clearCart();
      if (res.cart) {
        setCart(res.cart);
      }
      return res;
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        toastMessage,
        fetchCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
