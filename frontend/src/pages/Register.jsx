import { Link } from 'react-router-dom';
import './Auth.css';

export default function Register() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <img src="/LogoSF.png" alt="Shirley Franco" className="auth-card__logo" />
          <h1 className="auth-card__title">Crear Cuenta</h1>
          <p className="auth-card__subtitle">Únete a Shirley Franco Spa y disfruta de nuestros servicios</p>
        </div>

        <form className="auth-form">
          <div className="auth-form__row">
            <div className="auth-form__group">
              <label className="auth-form__label">Nombre</label>
              <input type="text" className="input" placeholder="María" defaultValue="María" />
            </div>
            <div className="auth-form__group">
              <label className="auth-form__label">Apellido</label>
              <input type="text" className="input" placeholder="González" defaultValue="González" />
            </div>
          </div>

          <div className="auth-form__group">
            <label className="auth-form__label">Correo Electrónico</label>
            <input
              type="email"
              className="input"
              placeholder="tu@email.com"
              defaultValue="maria@email.com"
            />
          </div>

          <div className="auth-form__group">
            <label className="auth-form__label">Teléfono</label>
            <input
              type="tel"
              className="input"
              placeholder="+593 99 999 9999"
              defaultValue="+593 99 123 4567"
            />
          </div>

          <div className="auth-form__group">
            <label className="auth-form__label">Contraseña</label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              defaultValue="password123"
            />
          </div>

          <div className="auth-form__group">
            <label className="auth-form__label">Confirmar Contraseña</label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              defaultValue="password123"
            />
          </div>

          <button type="submit" className="btn btn--primary btn--block">
            Crear Cuenta
          </button>
        </form>

        <div className="auth-card__footer">
          <p>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="auth-card__link">
              Inicia Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
