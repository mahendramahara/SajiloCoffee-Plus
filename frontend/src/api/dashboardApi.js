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
  const response = await api.get('/dashboard/admin/overview');
  return response.data;
};

export const getSalesAnalytics = async () => {
  const response = await api.get('/dashboard/admin/sales');
  return response.data;
};

export const getUserDashboard = async () => {
  const response = await api.get('/dashboard/user/overview');
  return response.data;
};

export default {
  getDashboardStats,
  getSalesAnalytics,
  getUserDashboard,
};
