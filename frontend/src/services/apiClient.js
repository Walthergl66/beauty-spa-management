// Cliente HTTP único hacia el backend NestJS (vía proxy Vite /api → :3000).
// - Desenvuelve el envelope { success, data, timestamp } del TransformInterceptor.
// - Normaliza errores al formato { success:false, message } del AllExceptionsFilter.
// - Adjunta el access token y renueva la sesión una vez ante un 401.

const API_BASE = '/api/v1';
const ACCESS_KEY = 'spa_access_token';
const REFRESH_KEY = 'spa_refresh_token';

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function saveTokens({ accessToken, refreshToken }) {
  if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export class ApiError extends Error {
  constructor(message, { status, details } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

function backendMessage(payload, fallback) {
  const message = payload?.message;
  if (Array.isArray(message)) return message.join('. ');
  if (typeof message === 'string' && message.length > 0) return message;
  return fallback;
}

// Single-flight: una sola renovación aunque fallen varias peticiones a la vez.
let refreshPromise = null;

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) throw new ApiError('Sesión expirada', { status: 401 });
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new ApiError(backendMessage(payload, 'Sesión expirada'), { status: res.status });
      }
      const tokens = payload?.data ?? payload;
      saveTokens(tokens);
      return tokens.accessToken;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

async function request(path, { method = 'GET', body, auth = true, retried = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && auth && !retried && getRefreshToken()) {
    try {
      await refreshAccessToken();
      return request(path, { method, body, auth, retried: true });
    } catch {
      clearTokens();
      throw new ApiError('Sesión expirada. Inicia sesión de nuevo.', { status: 401 });
    }
  }

  const payload = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(backendMessage(payload, `Error ${res.status}`), {
      status: res.status,
      details: payload,
    });
  }
  if (payload && typeof payload === 'object' && 'success' in payload && 'data' in payload) {
    return payload.data;
  }
  return payload;
}

function buildQuery(params = {}) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') search.append(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : '';
}

export const api = {
  get: (path, { params, ...options } = {}) => request(`${path}${buildQuery(params)}`, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  del: (path, options) => request(path, { ...options, method: 'DELETE' }),
};
