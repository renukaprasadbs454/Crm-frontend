import axios from 'axios';
import { useAuthStore } from '../store/authStore.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4001/api/v1',
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      const path = window.location.pathname;
      const loginPath = path.startsWith('/platform-admin') || path.startsWith('/super-admin') ? '/super-admin/login' : path.startsWith('/organisation') || path.startsWith('/staff') ? '/organisation' : '/login';
      if (path !== loginPath) window.location.href = loginPath;
    }
    return Promise.reject(err);
  }
);

export default api;
