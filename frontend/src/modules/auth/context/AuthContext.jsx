import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, saveTokens, clearTokens, getAccessToken } from '@/services/index.js';
import { ROUTES } from '@/routes/index.js';

const USER_KEY = 'spa_user';

const AuthContext = createContext(null);

function readCachedUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Sesión global: guarda tokens + usuario del backend y los restaura al recargar.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(readCachedUser);
  const [loading, setLoading] = useState(() => Boolean(getAccessToken()));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!getAccessToken()) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((me) => {
        setUser(me);
        localStorage.setItem(USER_KEY, JSON.stringify(me));
      })
      .catch(() => {
        clearTokens();
        localStorage.removeItem(USER_KEY);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setError(null);
    const { user: me, tokens } = await authApi.login({ email, password });
    saveTokens(tokens);
    setUser(me);
    localStorage.setItem(USER_KEY, JSON.stringify(me));
    return me;
  }, []);

  const register = useCallback(async (dto) => {
    setError(null);
    const { user: me, tokens } = await authApi.register(dto);
    saveTokens(tokens);
    setUser(me);
    localStorage.setItem(USER_KEY, JSON.stringify(me));
    return me;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout({ all: true });
    } catch {
      // Aunque falle el backend, la sesión local siempre se cierra.
    }
    clearTokens();
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'ADMIN',
      login,
      register,
      logout,
      setError,
    }),
    [user, loading, error, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}

// Guardia para páginas protegidas: redirige a login (o a home si pide otro rol).
export function useRequireAuth(requiredRole) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate(ROUTES.login, { replace: true });
    else if (requiredRole && user.role !== requiredRole) navigate(ROUTES.home, { replace: true });
  }, [user, loading, requiredRole, navigate]);

  const authorized = Boolean(user) && (!requiredRole || user?.role === requiredRole);
  return { user, loading, authorized };
}
