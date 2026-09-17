import api from './api.js';

export async function login(payload) {
  const { data } = await api.post('/auth/login', payload);
  return data.data;
}

export async function getMe() {
  const { data } = await api.get('/auth/me');
  return data.data;
}

export async function updateProfile(payload) {
  const { data } = await api.patch('/auth/profile', payload);
  return data.data;
}

export async function getDashboard() {
  const { data } = await api.get('/dashboard');
  return data.data;
}

export async function getBusinessDashboard() {
  const { data } = await api.get('/business-dashboard');
  return data.data;
}

export async function listLeads(params = {}) {
  const { data } = await api.get('/leads', { params });
  return data.data;
}

export async function getLead(id) {
  const { data } = await api.get(`/leads/${id}`);
  return data.data;
}

export async function createLead(payload) {
  const { data } = await api.post('/leads', payload);
  return data.data;
}

export async function updateLead(id, payload) {
  const { data } = await api.patch(`/leads/${id}`, payload);
  return data.data;
}

export async function deleteLead(id) {
  const { data } = await api.delete(`/leads/${id}`);
  return data;
}

export async function updateLeadStage(id, stage, note) {
  const { data } = await api.patch(`/leads/${id}/stage`, { stage, note });
  return data.data;
}

export async function convertLead(id, payload = {}) {
  const { data } = await api.post(`/leads/${id}/convert`, payload);
  return data.data;
}

export async function listLeadActivities(id) {
  const { data } = await api.get(`/leads/${id}/activities`);
  return data.data;
}

export async function addLeadActivity(id, payload) {
  const { data } = await api.post(`/leads/${id}/activities`, payload);
  return data.data;
}

export async function submitPublicLead(payload) {
  const { data } = await api.post('/public/leads', payload);
  return data;
}

export async function getPublicReviews(slug) {
  const { data } = await api.get(`/public/reviews/${slug}`);
  return data.data;
}

export async function submitPublicReview(payload) {
  const { data } = await api.post('/public/reviews', payload);
  return data.data;
}

export async function getReportOverview() {
  const { data } = await api.get('/reports/overview');
  return data.data;
}

export async function getReportBySource() {
  const { data } = await api.get('/reports/by-source');
  return data.data;
}

export async function getReportByRep() {
  const { data } = await api.get('/reports/by-rep');
  return data.data;
}

// Generic user CRUD is gone — team membership is now managed through
// company.js (listMembers/addTeamLead/addSalesperson/updateMember/removeMember),
// which is properly tenant- and role-scoped.

function resource(path) {
  return {
    list: async (params = {}) => (await api.get(path, { params })).data.data,
    get: async (id) => (await api.get(`${path}/${id}`)).data.data,
    create: async (payload) => (await api.post(path, payload)).data.data,
    update: async (id, payload) => (await api.patch(`${path}/${id}`, payload)).data.data,
    remove: async (id) => (await api.delete(`${path}/${id}`)).data,
  };
}

export const clientsApi = resource('/clients');
export const projectsApi = resource('/projects');
export const retainersApi = resource('/retainers');
export const paymentsApi = resource('/payments');
export const messagesApi = {
  list: async (params = {}) => (await api.get('/messages', { params })).data.data,
  create: async (payload) => (await api.post('/messages', payload)).data.data,
  update: async (id, payload) => (await api.patch(`/messages/${id}`, payload)).data.data,
  remove: async (id) => (await api.delete(`/messages/${id}`)).data,
};
export const meetingsApi = {
  list: async (params = {}) => (await api.get('/meetings', { params })).data.data,
  create: async (payload) => (await api.post('/meetings', payload)).data.data,
  update: async (id, payload) => (await api.patch(`/meetings/${id}`, payload)).data.data,
  remove: async (id) => (await api.delete(`/meetings/${id}`)).data,
};
export const tasksApi = {
  list: async (params = {}) => (await api.get('/tasks', { params })).data.data,
  create: async (payload) => (await api.post('/tasks', payload)).data.data,
  update: async (id, payload) => (await api.patch(`/tasks/${id}`, payload)).data.data,
  remove: async (id) => (await api.delete(`/tasks/${id}`)).data,
};

export async function getOrganization() {
  const { data } = await api.get('/settings/organization');
  return data.data;
}

export async function updateOrganization(payload) {
  const { data } = await api.patch('/settings/organization', payload);
  return data.data;
}


export const callsApi = {
  dashboard: async () => (await api.get('/calls/dashboard')).data.data,
  list: async (params = {}) => (await api.get('/calls', { params })).data.data,
  initiate: async (payload) => (await api.post('/calls/initiate', payload)).data.data,
  get: async (id) => (await api.get(`/calls/${id}`)).data.data,
  event: async (id, payload) => (await api.post(`/calls/${id}/events`, payload)).data.data,
  talkTime: async (date) => (await api.get('/agents/me/talk-time', { params: date ? { date } : {} })).data.data,
  myDevice: async () => (await api.get('/devices/me')).data.data,
  registerDevice: async (payload) => (await api.post('/devices/register', payload)).data.data,
  heartbeat: async (payload) => (await api.post('/devices/heartbeat', payload)).data.data,
  pendingCommands: async () => (await api.get('/devices/me/commands')).data.data,
  ackCommand: async (id, status) => (await api.post(`/devices/commands/${id}/ack`, { status })).data.data,
};
