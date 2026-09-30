import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usersApi, authApi, appointmentsApi } from '@/services/index.js';
import { useAuth } from '@/modules/auth/index.js';
import { StatusBadge } from '@/shared/index.js';
import { ROUTES } from '@/routes/index.js';
import './Profile.css';

function initials(user) {
  if (!user) return 'SF';
  return `${user.firstName?.charAt(0) ?? ''}${user.lastName?.charAt(0) ?? ''}` || 'SF';
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('es-EC', { day: 'numeric', month: 'short' });
}

export default function Profile() {
  const { user, isAdmin, refreshUser, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [editing, setEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', phone: '' });
  const [profileError, setProfileError] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [passwordError, setPasswordError] = useState(null);
  const [passwordOk, setPasswordOk] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    let cancelled = false;
    appointmentsApi
      .my()
      .then((data) => {
        if (!cancelled) setAppointments(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setAppointments([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        phone: user.phone ?? '',
      });
    }
  }, [user]);

  const stats = useMemo(
    () => ({
      total: appointments.length,
      completed: appointments.filter((apt) => apt.status === 'COMPLETED').length,
      cancelled: appointments.filter((apt) => apt.status === 'CANCELLED').length,
    }),
    [appointments],
  );

  const recentActivity = useMemo(
    () =>
      [...appointments]
        .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
        .slice(0, 4)
        .map((apt) => ({
          id: apt.id,
          description: `${apt.service?.name ?? 'Cita'} — ${formatDate(apt.startTime)}`,
          date: formatDate(apt.startTime),
          status: apt.status,
        })),
    [appointments],
  );

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setProfileError(null);
    setSavingProfile(true);
    try {
      await usersApi.updateProfile({
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
        phone: profileForm.phone.trim(),
      });
      await refreshUser();
      setEditing(false);
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setPasswordError(null);
    setPasswordOk(false);
    setSavingPassword(true);
    try {
      await authApi.changePassword(passwordForm);
      setPasswordOk(true);
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.home);
  };

  if (!user) return <p className="text-center">Cargando perfil…</p>;

  return (
    <div className="profile-page">
      <section className="profile__header">
        <div className="container">
          <h1 className="profile__title">Mi Perfil</h1>
          <p className="profile__subtitle">Gestiona tu información personal</p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="profile__layout">
            <div className="profile__card card">
              <div className="profile__avatar">{initials(user)}</div>
              <h2 className="profile__name">{user.firstName} {user.lastName}</h2>
              <p className="profile__role">{user.role}</p>
              <p className="profile__member">
                Miembro desde {new Date(user.createdAt).toLocaleDateString('es-EC', { month: 'long', year: 'numeric' })}
              </p>

              <div className="profile__stats">
                <div className="profile__stat">
                  <span className="profile__stat-value">{stats.total}</span>
                  <span className="profile__stat-label">Total Citas</span>
                </div>
                <div className="profile__stat">
                  <span className="profile__stat-value">{stats.completed}</span>
                  <span className="profile__stat-label">Completadas</span>
                </div>
                <div className="profile__stat">
                  <span className="profile__stat-value">{stats.cancelled}</span>
                  <span className="profile__stat-label">Canceladas</span>
                </div>
              </div>
            </div>

            <div className="profile__details">
              <div className="card">
                <h3 className="profile__section-title">Información Personal</h3>
                {editing ? (
                  <form onSubmit={handleSaveProfile}>
                    <div className="profile__info">
                      <div className="profile__info-row">
                        <span className="profile__info-label">Nombre</span>
                        <input
                          className="input"
                          value={profileForm.firstName}
                          onChange={(event) => setProfileForm((prev) => ({ ...prev, firstName: event.target.value }))}
                          required
                        />
                      </div>
                      <div className="profile__info-row">
                        <span className="profile__info-label">Apellido</span>
                        <input
                          className="input"
                          value={profileForm.lastName}
                          onChange={(event) => setProfileForm((prev) => ({ ...prev, lastName: event.target.value }))}
                          required
                        />
                      </div>
                      <div className="profile__info-row">
                        <span className="profile__info-label">Teléfono</span>
                        <input
                          className="input"
                          value={profileForm.phone}
                          onChange={(event) => setProfileForm((prev) => ({ ...prev, phone: event.target.value }))}
                        />
                      </div>
                    </div>
                    {profileError && (
                      <p className="profile__form-error" role="alert">
                        {profileError}
                      </p>
                    )}
                    <button type="submit" className="btn btn--primary btn--block mt-lg" disabled={savingProfile}>
                      {savingProfile ? 'Guardando…' : 'Guardar Cambios'}
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost btn--block mt-lg"
                      onClick={() => setEditing(false)}
                    >
                      Cancelar
                    </button>
                  </form>
                ) : (
                  <>
                    <div className="profile__info">
                      <div className="profile__info-row">
                        <span className="profile__info-label">Nombre</span>
                        <span className="profile__info-value">{user.firstName} {user.lastName}</span>
                      </div>
                      <div className="profile__info-row">
                        <span className="profile__info-label">Correo</span>
                        <span className="profile__info-value">{user.email}</span>
                      </div>
                      <div className="profile__info-row">
                        <span className="profile__info-label">Teléfono</span>
                        <span className="profile__info-value">{user.phone ?? '—'}</span>
                      </div>
                      <div className="profile__info-row">
                        <span className="profile__info-label">Rol</span>
                        <span className="badge badge--gold">{user.role}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn--secondary btn--block mt-lg"
                      onClick={() => setEditing(true)}
                    >
                      Editar Información
                    </button>
                  </>
                )}
              </div>

              <div className="card mt-xl">
                <h3 className="profile__section-title">Actividad Reciente</h3>
                <div className="profile__activity">
                  {recentActivity.length === 0 ? (
                    <p className="profile__empty">Sin actividad reciente.</p>
                  ) : (
                    recentActivity.map((item) => (
                      <div key={item.id} className="profile__activity-item">
                        <div className="profile__activity-info">
                          <span className="profile__activity-desc">{item.description}</span>
                          <span className="profile__activity-date">{item.date}</span>
                        </div>
                        <StatusBadge status={item.status} />
                      </div>
                    ))
                  )}
                </div>
                <Link to={ROUTES.appointments} className="btn btn--ghost btn--block mt-lg">
                  Ver Todas las Citas
                </Link>
              </div>

              <div className="card mt-xl">
                <h3 className="profile__section-title">Configuración</h3>
                <div className="profile__settings">
                  {isAdmin && (
                    <Link to={ROUTES.dashboard} className="profile__setting">
                      <span>Panel Administrativo</span>
                      <span>→</span>
                    </Link>
                  )}
                  <button
                    type="button"
                    className="profile__setting"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    <span>Cambiar Contraseña</span>
                    <span>→</span>
                  </button>
                  {showPassword && (
                    <form className="profile__password-form" onSubmit={handleChangePassword}>
                      <input
                        type="password"
                        className="input"
                        placeholder="Contraseña actual"
                        value={passwordForm.currentPassword}
                        onChange={(event) => setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))}
                        required
                        autoComplete="current-password"
                      />
                      <input
                        type="password"
                        className="input"
                        placeholder="Nueva contraseña (mínimo 8 caracteres)"
                        value={passwordForm.newPassword}
                        onChange={(event) => setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))}
                        required
                        minLength={8}
                        autoComplete="new-password"
                      />
                      {passwordError && (
                        <p className="profile__form-error" role="alert">
                          {passwordError}
                        </p>
                      )}
                      {passwordOk && (
                        <p className="profile__form-success" role="status">
                          Contraseña actualizada.
                        </p>
                      )}
                      <button type="submit" className="btn btn--primary btn--block" disabled={savingPassword}>
                        {savingPassword ? 'Guardando…' : 'Actualizar Contraseña'}
                      </button>
                    </form>
                  )}
                  <button type="button" className="profile__setting profile__setting--danger" onClick={handleLogout}>
                    <span>Cerrar Sesión</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
