import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes/index.js';
import './Footer.css';

// Datos de contacto del negocio (copy del sitio, editable aquí).
const CONTACT = {
  addressLines: ['Av. Principal 1234', 'Quito, Ecuador'],
  phone: '+593 99 999 9999',
  email: 'hola@sherleyfranco.com',
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">
              <img src="/si.png" alt="Shirley Franco" className="footer__logo-img" />
            </div>
            <p className="footer__description">
              Tu espacio de belleza y bienestar. Reserva tus citas y disfruta de
              una experiencia única de relajación.
            </p>
          </div>

          <div className="footer__column">
            <h4 className="footer__title">Navegación</h4>
            <Link to={ROUTES.home} className="footer__link">Inicio</Link>
            <Link to={ROUTES.services} className="footer__link">Servicios</Link>
            <Link to={ROUTES.book} className="footer__link">Reservar Cita</Link>
            <Link to={ROUTES.assistant} className="footer__link">Asistente Virtual</Link>
          </div>

          <div className="footer__column">
            <h4 className="footer__title">Cuenta</h4>
            <Link to={ROUTES.login} className="footer__link">Iniciar Sesión</Link>
            <Link to={ROUTES.register} className="footer__link">Registrarse</Link>
            <Link to={ROUTES.profile} className="footer__link">Mi Perfil</Link>
            <Link to={ROUTES.appointments} className="footer__link">Mis Citas</Link>
          </div>

          <div className="footer__column">
            <h4 className="footer__title">Contacto</h4>
            {CONTACT.addressLines.map((line) => (
              <p key={line} className="footer__text">{line}</p>
            ))}
            <p className="footer__text">{CONTACT.phone}</p>
            <p className="footer__text">{CONTACT.email}</p>
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
