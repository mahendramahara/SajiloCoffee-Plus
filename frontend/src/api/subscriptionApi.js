import axios from 'axios';

const API_BASE_URL = 'http://localhost:7267/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const getSubscriptionPlans = async () => {
  const response = await api.get('/subscriptions/plans');
  return response.data;
};

export const subscribeToPlan = async (subscriptionData) => {
  const response = await api.post('/subscriptions/subscribe', subscriptionData);
  return response.data;
};

export const getMySubscription = async () => {
  const response = await api.get('/subscriptions/my');
  return response.data;
};

export const cancelSubscription = async () => {
  const response = await api.patch('/subscriptions/cancel');
  return response.data;
};

export const renewSubscription = async (renewData) => {
  const response = await api.post('/subscriptions/renew', renewData);
  return response.data;
};

export const getAllSubscriptions = async () => {
  const response = await api.get('/subscriptions/admin/all');
  return response.data;
};

export const getSubscriptionStats = async () => {
  const response = await api.get('/subscriptions/admin/stats');
  return response.data;
};

export default {
  getSubscriptionPlans,
  subscribeToPlan,
  getMySubscription,
  cancelSubscription,
  renewSubscription,
  getAllSubscriptions,
  getSubscriptionStats,
};
