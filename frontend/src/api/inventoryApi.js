import axios from 'axios';

const API_BASE_URL = 'http://localhost:7267/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const createProduct = async (productData) => {
  const response = await api.post('/inventory/products', productData);
  return response.data;
};

export const updateProduct = async (productId, productData) => {
  const response = await api.put(`/inventory/products/${productId}`, productData);
  return response.data;
};

export const deleteProduct = async (productId) => {
  const response = await api.delete(`/inventory/products/${productId}`);
  return response.data;
};

export const toggleProductAvailability = async (productId) => {
  const response = await api.patch(`/inventory/products/${productId}/toggle`);
  return response.data;
};

export const getProductStats = async () => {
  const response = await api.get('/inventory/products/stats');
  return response.data;
};

export default {
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductAvailability,
  getProductStats,
};
