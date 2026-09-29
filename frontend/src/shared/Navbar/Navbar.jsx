import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/index.js';
import { useAuth } from '@/modules/auth/index.js';
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = async () => {
    closeMenu();
    await logout();
    navigate(ROUTES.home);
  };

  return (
    <header className="navbar">
      <div className="container navbar__container">
        <Link to={ROUTES.home} className="navbar__logo" onClick={closeMenu}>
          <img src="/si.png" alt="Shirley Franco - Técnica en belleza" className="navbar__logo-img" />
        </Link>

        <nav className={`navbar__menu ${isOpen ? 'navbar__menu--open' : ''}`}>
          <NavLink to={ROUTES.home} className="navbar__link" onClick={closeMenu}>
            Inicio
          </NavLink>
          <NavLink to={ROUTES.services} className="navbar__link" onClick={closeMenu}>
            Servicios
          </NavLink>
          <NavLink to={ROUTES.book} className="navbar__link" onClick={closeMenu}>
            Reservar
          </NavLink>
          {isAuthenticated && (
            <NavLink to={ROUTES.appointments} className="navbar__link" onClick={closeMenu}>
              Mis Citas
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to={ROUTES.dashboard} className="navbar__link" onClick={closeMenu}>
              Dashboard
            </NavLink>
          )}
        </nav>

        <div className="navbar__actions">
          {isAuthenticated ? (
            <>
              <Link to={ROUTES.profile} className="btn btn--ghost btn--sm" onClick={closeMenu}>
                {user?.firstName ?? 'Mi Perfil'}
              </Link>
              <span className="navbar__divider" aria-hidden="true"></span>
              <button type="button" className="btn btn--ghost btn--sm" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to={ROUTES.login} className="btn btn--ghost btn--sm" onClick={closeMenu}>
                Iniciar Sesión
              </Link>
              <span className="navbar__divider" aria-hidden="true"></span>
              <Link to={ROUTES.register} className="btn btn--ghost btn--sm" onClick={closeMenu}>
                Registrarse
              </Link>
            </>
          )}
        </div>

        <button
          className={`navbar__toggle ${isOpen ? 'navbar__toggle--open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
