import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/index.js';
import { useAuth } from '@/modules/auth/index.js';
import '../../Auth.css';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);
    if (form.password !== form.confirmPassword) {
      setFormError('Las contraseñas no coinciden.');
      return;
    }
    setSubmitting(true);
    try {
      await register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
        password: form.password,
      });
      const target = typeof from === 'string' && from.startsWith('/') ? from : ROUTES.appointments;
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
          <img src="/1.2_w-removebg-preview.png" alt="Shirley Franco" className="auth-card__logo" />
          <h1 className="auth-card__title">Crear Cuenta</h1>
          <p className="auth-card__subtitle">Únete a Shirley Franco Spa y disfruta de nuestros servicios</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__row">
            <div className="auth-form__group">
              <label className="auth-form__label">Nombre</label>
              <input
                type="text"
                name="firstName"
                className="input"
                placeholder="María"
                value={form.firstName}
                onChange={handleChange}
                required
                autoComplete="given-name"
              />
            </div>
            <div className="auth-form__group">
              <label className="auth-form__label">Apellido</label>
              <input
                type="text"
                name="lastName"
                className="input"
                placeholder="González"
                value={form.lastName}
                onChange={handleChange}
                required
                autoComplete="family-name"
              />
            </div>
          </div>

          <div className="auth-form__group">
            <label className="auth-form__label">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              className="input"
              placeholder="tu@email.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-form__group">
            <label className="auth-form__label">Teléfono (opcional, 10 dígitos)</label>
            <input
              type="tel"
              name="phone"
              className="input"
              placeholder="0991234567"
              value={form.phone}
              onChange={handleChange}
              autoComplete="tel"
            />
          </div>

          <div className="auth-form__group">
            <label className="auth-form__label">Contraseña (mínimo 8 caracteres)</label>
            <input
              type="password"
              name="password"
              className="input"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <div className="auth-form__group">
            <label className="auth-form__label">Confirmar Contraseña</label>
            <input
              type="password"
              name="confirmPassword"
              className="input"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>

          {formError && (
            <p className="auth-form__error" role="alert">
              {formError}
            </p>
          )}

          <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
            {submitting ? 'Creando cuenta…' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="auth-card__footer">
          <p>
            ¿Ya tienes cuenta?{' '}
            <Link to={ROUTES.login} className="auth-card__link">
              Inicia Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
