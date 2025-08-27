import axios from 'axios';

const API_BASE_URL = 'http://localhost:7267/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default {
  healthCheck,
};
