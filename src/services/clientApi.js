import axios from 'axios';
import { useClientAuthStore } from '../store/clientAuthStore.js';

const clientApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4001/api/v1',
});

clientApi.interceptors.request.use((config) => {
  const token = useClientAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

clientApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useClientAuthStore.getState().clearClientAuth();
      if (!window.location.pathname.startsWith('/client/login')) {
        window.location.href = '/client/login';
      }
    }
    return Promise.reject(err);
  }
);

export default clientApi;
