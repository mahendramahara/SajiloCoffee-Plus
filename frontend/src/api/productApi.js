import axios from 'axios';

const API_BASE_URL = 'http://localhost:7267/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const getProducts = async (params) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProductById = async (productId) => {
  const response = await api.get(`/products/${productId}`);
  return response.data;
};

export const getProductBySlug = async (slug) => {
  const response = await api.get(`/products/slug/${slug}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/products/categories');
  return response.data;
};

export const getFeaturedProducts = async () => {
  const response = await api.get('/products/featured');
  return response.data;
};

export const getPopularProducts = async () => {
  const response = await api.get('/products/popular');
  return response.data;
};

export const rateProduct = async (productId, ratingData) => {
  const response = await api.post(`/products/${productId}/rate`, ratingData);
  return response.data;
};

export const getProductRatings = async (productId) => {
  const response = await api.get(`/products/${productId}/ratings`);
  return response.data;
};

export default {
  getProducts,
  getProductById,
  getProductBySlug,
  getCategories,
  getFeaturedProducts,
  getPopularProducts,
  rateProduct,
  getProductRatings,
};
