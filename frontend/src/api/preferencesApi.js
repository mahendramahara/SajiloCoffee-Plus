import axios from 'axios';

const API_BASE_URL = 'http://localhost:7267/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const getUserPreferences = async () => {
  const response = await api.get('/preferences');
  return response.data;
};

export const updateUserPreferences = async (preferencesData) => {
  const response = await api.put('/preferences', preferencesData);
  return response.data;
};

export const resetUserPreferences = async () => {
  const response = await api.post('/preferences/reset');
  return response.data;
};

export default {
  getUserPreferences,
  updateUserPreferences,
  resetUserPreferences,
};
