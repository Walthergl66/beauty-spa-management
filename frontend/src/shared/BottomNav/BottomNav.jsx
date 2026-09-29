import { NavLink, useLocation } from 'react-router-dom';
import { ROUTES } from '@/routes/index.js';
import './BottomNav.css';

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  );
}

function ServicesIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3c.9 2.2 2.1 3.9 4.5 4.9-2.4 1-3.6 2.7-4.5 4.9-.9-2.2-2.1-3.9-4.5-4.9 2.4-1 3.6-2.7 4.5-4.9Z" />
      <path d="M19 14c.5 1.2 1.1 2.1 2.4 2.6-1.3.5-1.9 1.4-2.4 2.6-.5-1.2-1.1-2.1-2.4-2.6 1.3-.5 1.9-1.4 2.4-2.6Z" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M8 2v4M16 2v4M3 9h18" />
      <path d="M12 13v4M10 15h4" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M8 2v4M16 2v4M3 9h18" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" />
    </svg>
  );
}

// Sin tabs en login/registro: como en una app nativa, la autenticación es pantalla completa.
const FULLSCREEN_ROUTES = [ROUTES.login, ROUTES.register];

export default function BottomNav() {
  const { pathname } = useLocation();

  if (FULLSCREEN_ROUTES.includes(pathname)) return null;

  return (
    <nav className="bottomnav" aria-label="Navegación principal">
      <NavLink
        to={ROUTES.home}
        end
        className={({ isActive }) => `bottomnav__tab ${isActive ? 'bottomnav__tab--active' : ''}`}
      >
        <HomeIcon />
        <span className="bottomnav__label">Inicio</span>
      </NavLink>

      <NavLink
        to={ROUTES.services}
        className={({ isActive }) => `bottomnav__tab ${isActive ? 'bottomnav__tab--active' : ''}`}
      >
        <ServicesIcon />
        <span className="bottomnav__label">Servicios</span>
      </NavLink>

      <NavLink
        to={ROUTES.book}
        className={({ isActive }) => `bottomnav__fab ${isActive ? 'bottomnav__fab--active' : ''}`}
        aria-label="Reservar cita"
      >
        <span className="bottomnav__fab-circle">
          <BookIcon />
        </span>
        <span className="bottomnav__label">Reservar</span>
      </NavLink>

      <NavLink
        to={ROUTES.appointments}
        className={({ isActive }) => `bottomnav__tab ${isActive ? 'bottomnav__tab--active' : ''}`}
      >
        <CalendarIcon />
        <span className="bottomnav__label">Citas</span>
      </NavLink>

      <NavLink
        to={ROUTES.profile}
        className={({ isActive }) => `bottomnav__tab ${isActive ? 'bottomnav__tab--active' : ''}`}
      >
        <ProfileIcon />
        <span className="bottomnav__label">Perfil</span>
      </NavLink>
    </nav>
  );
}
