import axios from 'axios';

const API_BASE_URL = 'http://localhost:7267/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const getDashboardStats = async () => {
  const response = await api.get('/admin/analytics/dashboard');
  return response.data;
};

export const getSalesAnalytics = async () => {
  const response = await api.get('/admin/analytics/sales');
  return response.data;
};

export const getOrderStats = async () => {
  const response = await api.get('/admin/analytics/orders/stats');
  return response.data;
};

export const getSubscriptionStats = async () => {
  const response = await api.get('/admin/analytics/subscriptions/stats');
  return response.data;
};

export const getAllOrders = async () => {
  const response = await api.get('/admin/analytics/orders');
  return response.data;
};

export const updateOrderStatus = async (orderId, statusData) => {
  const response = await api.patch(`/admin/analytics/orders/${orderId}/status`, statusData);
  return response.data;
};

export const getAllSubscriptions = async () => {
  const response = await api.get('/admin/analytics/subscriptions');
  return response.data;
};

export default {
  getDashboardStats,
  getSalesAnalytics,
  getOrderStats,
  getSubscriptionStats,
  getAllOrders,
  updateOrderStatus,
  getAllSubscriptions,
};
