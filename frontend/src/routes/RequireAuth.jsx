import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/modules/auth/index.js';
import { ROUTES } from './paths.js';

// Guardia de rutas privadas: sin sesión redirige a login guardando
// la página solicitada para volver tras autenticarse.
// Públicas: inicio (/), login, registro y 404.
export function RequireAuth({ role, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="text-center">Verificando acceso…</p>;
  if (!user) {
    return (
      <Navigate
        to={ROUTES.login}
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }
  if (role && user.role !== role) return <Navigate to={ROUTES.home} replace />;
  return children;
}
