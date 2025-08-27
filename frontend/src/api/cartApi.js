import axios from 'axios';

const API_BASE_URL = 'http://localhost:7267/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data;
};

export const addToCart = async (cartData) => {
  const response = await api.post('/cart/add', cartData);
  return response.data;
};

export const updateCartItem = async (itemId, updateData) => {
  const response = await api.put(`/cart/item/${itemId}`, updateData);
  return response.data;
};

export const removeFromCart = async (itemId) => {
  const response = await api.delete(`/cart/item/${itemId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete('/cart/clear');
  return response.data;
};

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
