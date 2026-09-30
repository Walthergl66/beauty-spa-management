// Puerta de entrada única al backend: un grupo de funciones por dominio.
// Cada función refleja un endpoint real del API (ver Swagger en /api/docs)
// y devuelve el `data` ya desenvuelto del envelope { success, data }.
import { api } from './apiClient.js';

export const authApi = {
  register: (dto) => api.post('/auth/register', dto, { auth: false }),
  login: (dto) => api.post('/auth/login', dto, { auth: false }),
  logout: (dto = {}) => api.post('/auth/logout', dto),
  me: () => api.get('/auth/me'),
  sessions: () => api.get('/auth/sessions'),
  changePassword: (dto) => api.post('/auth/change-password', dto),
};

export const usersApi = {
  updateProfile: (dto) => api.patch('/users/profile', dto),
};

export const servicesApi = {
  listActive: (category) => api.get('/services/active', { params: { category }, auth: false }),
  getById: (id) => api.get(`/services/${id}`, { auth: false }),
};

export const employeesApi = {
  list: () => api.get('/employees', { auth: false }),
  listByService: (serviceId) => api.get(`/employees/service/${serviceId}`, { auth: false }),
  getById: (id) => api.get(`/employees/${id}`, { auth: false }),
};

export const availabilityApi = {
  getSlots: ({ serviceId, date, employeeId }) =>
    api.get('/availability', { params: { serviceId, date, employeeId }, auth: false }),
};

export const appointmentsApi = {
  create: (dto) => api.post('/appointments', dto),
  my: () => api.get('/appointments/my'),
  cancel: (id, reason) => api.patch(`/appointments/${id}/cancel`, reason ? { reason } : {}),
  reschedule: (id, startTime) => api.patch(`/appointments/${id}/reschedule`, { startTime }),
};

export const dashboardApi = {
  summary: (params) => api.get('/dashboard/summary', { params }),
  topServices: (params) => api.get('/dashboard/top-services', { params }),
  occupancy: (params) => api.get('/dashboard/occupancy', { params }),
  history: (params) => api.get('/dashboard/history', { params }),
};

export const assistantApi = {
  chat: (message, conversationId) =>
    api.post('/assistant/chat', conversationId ? { message, conversationId } : { message }),
  conversations: () => api.get('/assistant/conversations'),
  conversation: (id) => api.get(`/assistant/conversations/${id}`),
};
