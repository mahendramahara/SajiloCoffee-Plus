import axios from 'axios';

const API_BASE_URL = 'http://localhost:7267/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const getRecommendations = async () => {
  const response = await api.get('/recommendations');
  return response.data;
};

export const refreshRecommendations = async () => {
  const response = await api.post('/recommendations/refresh');
  return response.data;
};

export default {
  getRecommendations,
  refreshRecommendations,
};
