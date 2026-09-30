// Barrel de servicios — única puerta de entrada al backend.
// Regla: importar `@/services/index.js`, nunca rutas profundas.
export {
  api,
  ApiError,
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from './apiClient.js';
export {
  authApi,
  usersApi,
  servicesApi,
  employeesApi,
  availabilityApi,
  appointmentsApi,
  dashboardApi,
  assistantApi,
} from './spaApi.js';
