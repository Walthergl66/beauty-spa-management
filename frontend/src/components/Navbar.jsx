import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar__container">
        <Link to="/" className="navbar__logo" onClick={closeMenu}>
          <span className="navbar__logo-icon">SF</span>
          <span className="navbar__logo-text">Sherley Franco</span>
        </Link>

        <nav className={`navbar__menu ${isOpen ? 'navbar__menu--open' : ''}`}>
          <NavLink to="/" className="navbar__link" onClick={closeMenu}>
            Inicio
          </NavLink>
          <NavLink to="/services" className="navbar__link" onClick={closeMenu}>
            Servicios
          </NavLink>
          <NavLink to="/book" className="navbar__link" onClick={closeMenu}>
            Reservar
          </NavLink>
          <NavLink to="/assistant" className="navbar__link" onClick={closeMenu}>
            Asistente
          </NavLink>
          <NavLink to="/dashboard" className="navbar__link" onClick={closeMenu}>
            Dashboard
          </NavLink>
          <div className="navbar__actions">
            <Link to="/login" className="btn btn--ghost btn--sm" onClick={closeMenu}>
              Iniciar Sesión
            </Link>
            <Link to="/register" className="btn btn--primary btn--sm" onClick={closeMenu}>
              Registrarse
            </Link>
          </div>
        </nav>

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
