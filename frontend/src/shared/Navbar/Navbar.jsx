import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/index.js';
import { useAuth } from '@/modules/auth/index.js';
import './Navbar.css';

// Top bar: en desktop muestra menú + acciones; en mobile solo logo + avatar
// (la navegación vive en el BottomNav estilo app).
export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
  };

  const avatarLabel = isAuthenticated
    ? `${user?.firstName?.charAt(0) ?? ''}${user?.lastName?.charAt(0) ?? ''}`.trim() || 'P'
    : null;

  return (
    <header className="navbar">
      <div className="container navbar__container">
        <Link to={ROUTES.home} className="navbar__logo">
          <img src="/1.2_w-removebg-preview.png" alt="Shirley Franco - Técnica en belleza" className="navbar__logo-img" />
        </Link>

        {isAuthenticated && (
          <nav className="navbar__menu" aria-label="Navegación de escritorio">
            <NavLink to={ROUTES.home} className="navbar__link">
              Inicio
            </NavLink>
            <NavLink to={ROUTES.services} className="navbar__link">
              Servicios
            </NavLink>
            <NavLink to={ROUTES.book} className="navbar__link">
              Reservar
            </NavLink>
            <NavLink to={ROUTES.appointments} className="navbar__link">
              Mis Citas
            </NavLink>
            {isAdmin && (
              <NavLink to={ROUTES.dashboard} className="navbar__link">
                Dashboard
              </NavLink>
            )}
          </nav>
        )}

        <div className="navbar__actions">
          {isAuthenticated ? (
            <>
              <Link to={ROUTES.profile} className="btn btn--ghost btn--sm">
                {user?.firstName ?? 'Mi Perfil'}
              </Link>
              <span className="navbar__divider" aria-hidden="true"></span>
              <button type="button" className="btn btn--ghost btn--sm" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => navigate(ROUTES.login)}
              >
                Iniciar Sesión
              </button>
              <span className="navbar__divider" aria-hidden="true"></span>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => navigate(ROUTES.register)}
              >
                Registrarse
              </button>
            </>
          )}
        </div>

        <Link
          to={isAuthenticated ? ROUTES.profile : ROUTES.login}
          className="navbar__avatar"
          aria-label={isAuthenticated ? 'Ir a mi perfil' : 'Iniciar sesión'}
        >
          {avatarLabel ?? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" />
            </svg>
          )}
        </Link>
      </div>
    </header>
  );
}
