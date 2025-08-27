import axios from 'axios';

const API_BASE_URL = 'http://localhost:7267/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (!config.headers['Content-Type'] && !(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('tokenExpiresIn');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const register = async (userData) => {
  const response = await api.post('/user/register', userData);
  return response.data;
};

export const verifyEmail = async (verificationData) => {
  const response = await api.post('/user/verify-email', verificationData);
  return response.data;
};

export const resendVerificationOTP = async (email) => {
  const response = await api.post('/user/resend-otp', { email });
  return response.data;
};

export const login = async (loginData) => {
  const response = await api.post('/user/login', loginData);
  return response.data;
};

export const forgetPassword = async (email) => {
  const response = await api.post('/user/forget-password', { email });
  return response.data;
};

export const resetPassword = async (resetData) => {
  const response = await api.post('/user/reset-password', resetData);
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.post('/user/change-password', passwordData);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/user/me');
  return response.data;
};

export const updateUser = async (userData) => {
  console.log('Updating user with data type:', userData instanceof FormData ? 'FormData' : 'JSON');
  
  const response = await api.put('/user/update', userData);
  return response.data;
};

export const deleteUser = async () => {
  const response = await api.delete('/user/delete');
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/user/logout');
  return response.data;
};

export const getCoffeePreferences = async () => {
  const response = await api.get('/user/coffee-preferences');
  return response.data;
};

export const updateCoffeePreferences = async (preferences) => {
  const response = await api.put('/user/coffee-preferences', preferences);
  return response.data;
};

export default {
  register,
  verifyEmail,
  resendVerificationOTP,
  login,
  forgetPassword,
  resetPassword,
  changePassword,
  getMe,
  updateUser,
  deleteUser,
  logout,
  getCoffeePreferences,
  updateCoffeePreferences,
};