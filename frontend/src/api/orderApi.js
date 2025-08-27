import axios from 'axios';

const API_BASE_URL = 'http://localhost:7267/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getOrders = async (params) => {
  const response = await api.get('/orders/my', { params });
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await api.get(`/orders/my/${orderId}`);
  return response.data;
};

export const cancelOrder = async (orderId) => {
  const response = await api.patch(`/orders/my/${orderId}/cancel`);
  return response.data;
};

export const getAllOrders = async (params) => {
  const response = await api.get('/orders/admin/all', { params });
  return response.data;
};

export const updateOrderStatus = async (orderId, statusData) => {
  const response = await api.patch(`/orders/admin/${orderId}/status`, statusData);
  return response.data;
};

export const getOrderStats = async () => {
  const response = await api.get('/orders/admin/stats');
  return response.data;
};

export default {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
};
