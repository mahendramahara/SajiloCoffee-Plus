import axios from 'axios';

const API_BASE_URL = 'http://localhost:7267/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const getTables = async () => {
  const response = await api.get('/tables');
  return response.data;
};

export const getTableById = async (tableId) => {
  const response = await api.get(`/tables/${tableId}`);
  return response.data;
};

export const getTableByNumber = async (tableNumber) => {
  const response = await api.get(`/tables/number/${tableNumber}`);
  return response.data;
};

export const createTable = async (tableData) => {
  const response = await api.post('/tables', tableData);
  return response.data;
};

export const updateTable = async (tableId, tableData) => {
  const response = await api.put(`/tables/${tableId}`, tableData);
  return response.data;
};

export const deleteTable = async (tableId) => {
  const response = await api.delete(`/tables/${tableId}`);
  return response.data;
};

export const reserveTable = async (tableNumber) => {
  const response = await api.put(`/tables/number/${tableNumber}/reserve`);
  return response.data;
};

export const releaseTable = async (tableNumber) => {
  const response = await api.put(`/tables/number/${tableNumber}/release`);
  return response.data;
};

export default {
  getTables,
  getTableById,
  getTableByNumber,
  createTable,
  updateTable,
  deleteTable,
  reserveTable,
  releaseTable,
};
