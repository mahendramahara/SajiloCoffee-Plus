import axios from 'axios';

const API_BASE_URL = 'http://localhost:7267/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminAccessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminAccessToken');
      localStorage.removeItem('admin');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const adminApi = {
  login: async (credentials) => {
    const response = await api.post('/admin/login', credentials);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/admin/logout');
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/admin/me');
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/dashboard/admin');
    return response.data;
  },

  getAllOrders: async (params = {}) => {
    const response = await api.get('/orders/all', { params });
    return response.data;
  },

  getOrderStats: async () => {
    const response = await api.get('/orders/stats');
    return response.data;
  },

  updateOrderStatus: async (orderId, data) => {
    const response = await api.put(`/orders/${orderId}/status`, data);
    return response.data;
  },

  deleteOrder: async (orderId) => {
    const response = await api.delete(`/orders/${orderId}`);
    return response.data;
  },

  getUsers: async (params = {}) => {
    const response = await api.get('/user/users', { params });
    return response.data;
  },

  suspendUser: async (userId) => {
    const response = await api.put(`/users/${userId}/suspend`);
    return response.data;
  },

  activateUser: async (userId) => {
    const response = await api.put(`/users/${userId}/activate`);
    return response.data;
  },

  getSubscriptionPlans: async () => {
    const response = await api.get('/subscriptions/plans');
    return response.data;
  },

  createSubscriptionPlan: async (planData) => {
    const response = await api.post('/subscriptions/plans', planData);
    return response.data;
  },

  updateSubscriptionPlan: async (planId, planData) => {
    const response = await api.put(`/subscriptions/plans/${planId}`, planData);
    return response.data;
  },

  deleteSubscriptionPlan: async (planId) => {
    const response = await api.delete(`/subscriptions/plans/${planId}`);
    return response.data;
  },

  getSubscriptions: async (params = {}) => {
    const response = await api.get('/subscriptions/all', { params });
    return response.data;
  },

  getTables: async (params = {}) => {
    const response = await api.get('/tables', { params });
    return response.data;
  },

  createTable: async (tableData) => {
    const response = await api.post('/tables', tableData);
    return response.data;
  },

  updateTable: async (tableId, tableData) => {
    const response = await api.put(`/tables/${tableId}`, tableData);
    return response.data;
  },

  deleteTable: async (tableId) => {
    const response = await api.delete(`/tables/${tableId}`);
    return response.data;
  },

  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  updateProduct: async (productId, productData) => {
    const response = await api.put(`/products/${productId}`, productData);
    return response.data;
  },

  deleteProduct: async (productId) => {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  },

  getAdmins: async () => {
    const response = await api.get('/admin');
    return response.data;
  },

  createAdmin: async (adminData) => {
    const response = await api.post('/admin/create', adminData);
    return response.data;
  },

  updateAdmin: async (adminId, adminData) => {
    const response = await api.put(`/admin/${adminId}`, adminData);
    return response.data;
  },

  deleteAdmin: async (adminId) => {
    const response = await api.delete(`/admin/${adminId}`);
    return response.data;
  }
};

export default adminApi;
