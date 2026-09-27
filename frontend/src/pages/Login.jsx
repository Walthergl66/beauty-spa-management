import { Link } from 'react-router-dom';
import './Auth.css';

export default function Login() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <img src="/LogoSF.png" alt="Shirley Franco" className="auth-card__logo" />
          <h1 className="auth-card__title">Bienvenida de vuelta</h1>
          <p className="auth-card__subtitle">Ingresa a Shirley Franco Spa</p>
        </div>

        <form className="auth-form">
          <div className="auth-form__group">
            <label className="auth-form__label">Correo Electrónico</label>
            <input
              type="email"
              className="input"
              placeholder="tu@email.com"
              defaultValue="cliente@sherleyfranco.com"
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

          <div className="auth-form__options">
            <label className="auth-form__remember">
              <input type="checkbox" defaultChecked />
              <span>Recordarme</span>
            </label>
            <a href="#" className="auth-form__forgot">¿Olvidaste tu contraseña?</a>
          </div>

          <button type="submit" className="btn btn--primary btn--block">
            Iniciar Sesión
          </button>
        </form>

        <div className="auth-card__footer">
          <p>
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="auth-card__link">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
