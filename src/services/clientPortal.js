import clientApi from './clientApi.js';
import api from './api.js';

export async function clientRegister(payload) {
  const { data } = await api.post('/client-auth/register', payload);
  return data.data;
}

export async function clientLogin(email, password) {
  const { data } = await api.post('/client-auth/login', { email, password });
  return data.data;
}

export async function getClientMe() {
  const { data } = await clientApi.get('/client-auth/me');
  return data.data;
}

export async function getClientDashboard() {
  const { data } = await clientApi.get('/client-portal/dashboard');
  return data.data;
}

export async function getGoogleStartUrl(mode = 'staff') {
  const { data } = await api.get('/auth/google/start', { params: { mode } });
  return data.data.url;
}
