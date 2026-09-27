import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">
              <img src="/LogoSF.png" alt="Shirley Franco" className="footer__logo-img" />
            </div>
            <p className="footer__description">
              Tu espacio de belleza y bienestar. Reserva tus citas y disfruta de
              una experiencia única de relajación.
            </p>
          </div>

          <div className="footer__column">
            <h4 className="footer__title">Navegación</h4>
            <Link to="/" className="footer__link">Inicio</Link>
            <Link to="/services" className="footer__link">Servicios</Link>
            <Link to="/book" className="footer__link">Reservar Cita</Link>
            <Link to="/assistant" className="footer__link">Asistente Virtual</Link>
          </div>

          <div className="footer__column">
            <h4 className="footer__title">Cuenta</h4>
            <Link to="/login" className="footer__link">Iniciar Sesión</Link>
            <Link to="/register" className="footer__link">Registrarse</Link>
            <Link to="/profile" className="footer__link">Mi Perfil</Link>
            <Link to="/appointments" className="footer__link">Mis Citas</Link>
          </div>

          <div className="footer__column">
            <h4 className="footer__title">Contacto</h4>
            <p className="footer__text">Av. Principal 1234</p>
            <p className="footer__text">Quito, Ecuador</p>
            <p className="footer__text">+593 99 999 9999</p>
            <p className="footer__text">hola@sherleyfranco.com</p>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            &copy; {new Date().getFullYear()} Shirley Franco. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
