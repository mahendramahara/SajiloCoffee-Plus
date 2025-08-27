import axios from 'axios';

const API_BASE_URL = 'http://localhost:7267/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const searchProducts = async (params) => {
  const response = await api.get('/search/products', { params });
  return response.data;
};

export const getSearchSuggestions = async (params) => {
  const response = await api.get('/search/suggestions', { params });
  return response.data;
};

export const getTrendingSearches = async () => {
  const response = await api.get('/search/trending');
  return response.data;
};

export default {
  searchProducts,
  getSearchSuggestions,
  getTrendingSearches,
};
