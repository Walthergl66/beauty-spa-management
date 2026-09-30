import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/index.js';
import { useAuth } from '@/modules/auth/index.js';
import '../../Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      const me = await login({ email: email.trim(), password });
      const target =
        typeof from === 'string' && from.startsWith('/')
          ? from
          : me?.role === 'ADMIN'
            ? ROUTES.dashboard
            : ROUTES.appointments;
      navigate(target, { replace: true });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <img src="/S1.png" alt="Shirley Franco" className="auth-card__logo" />
          <h1 className="auth-card__title">Bienvenida de vuelta</h1>
          <p className="auth-card__subtitle">Ingresa a Shirley Franco Spa</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__group">
            <label className="auth-form__label">Correo Electrónico</label>
            <input
              type="email"
              className="input"
              placeholder="tu@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-form__group">
            <label className="auth-form__label">Contraseña</label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {formError && (
            <p className="auth-form__error" role="alert">
              {formError}
            </p>
          )}

          <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
            {submitting ? 'Ingresando…' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="auth-card__footer">
          <p>
            ¿No tienes cuenta?{' '}
            <Link to={ROUTES.register} className="auth-card__link">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
