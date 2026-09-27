import { Link } from 'react-router-dom';
import './Profile.css';

const user = {
  firstName: 'María',
  lastName: 'González',
  email: 'maria@email.com',
  phone: '+593 99 123 4567',
  role: 'Cliente',
  avatar: 'MG',
  memberSince: 'Enero 2024',
  totalAppointments: 24,
  completedAppointments: 20,
  cancelledAppointments: 4,
};

const recentActivity = [
  { id: 1, type: 'appointment', description: 'Limpieza Facial Profunda', date: '28 Sep 2026', status: 'confirmed' },
  { id: 2, type: 'appointment', description: 'Masaje Relajante Corporal', date: '2 Oct 2026', status: 'pending' },
  { id: 3, type: 'payment', description: 'Pago de Manicure Clásica - $25', date: '20 Sep 2026', status: 'completed' },
  { id: 4, type: 'appointment', description: 'Tratamiento Anti-Edad', date: '15 Sep 2026', status: 'completed' },
];

export default function Profile() {
  return (
    <div className="profile-page">
      <section className="profile__header">
        <div className="container">
          <h1 className="profile__title">Mi Perfil</h1>
          <p className="profile__subtitle">Gestiona tu información personal</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 'var(--spacing-xl)' }}>
        <div className="container">
          <div className="profile__layout">
            {/* Profile Card */}
            <div className="profile__card card">
              <div className="profile__avatar">{user.avatar}</div>
              <h2 className="profile__name">{user.firstName} {user.lastName}</h2>
              <p className="profile__role">{user.role}</p>
              <p className="profile__member">Miembro desde {user.memberSince}</p>

              <div className="profile__stats">
                <div className="profile__stat">
                  <span className="profile__stat-value">{user.totalAppointments}</span>
                  <span className="profile__stat-label">Total Citas</span>
                </div>
                <div className="profile__stat">
                  <span className="profile__stat-value">{user.completedAppointments}</span>
                  <span className="profile__stat-label">Completadas</span>
                </div>
                <div className="profile__stat">
                  <span className="profile__stat-value">{user.cancelledAppointments}</span>
                  <span className="profile__stat-label">Canceladas</span>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="profile__details">
              <div className="card">
                <h3 className="profile__section-title">Información Personal</h3>
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
                    <span className="profile__info-value">{user.phone}</span>
                  </div>
                  <div className="profile__info-row">
                    <span className="profile__info-label">Rol</span>
                    <span className="badge badge--gold">{user.role}</span>
                  </div>
                </div>
                <button className="btn btn--secondary btn--block" style={{ marginTop: 'var(--spacing-lg)' }}>
                  Editar Información
                </button>
              </div>

              <div className="card" style={{ marginTop: 'var(--spacing-xl)' }}>
                <h3 className="profile__section-title">Actividad Reciente</h3>
                <div className="profile__activity">
                  {recentActivity.map((item) => (
                    <div key={item.id} className="profile__activity-item">
                      <div className="profile__activity-info">
                        <span className="profile__activity-desc">{item.description}</span>
                        <span className="profile__activity-date">{item.date}</span>
                      </div>
                      <span className={`badge ${
                        item.status === 'confirmed' ? 'badge--green' :
                        item.status === 'pending' ? 'badge--gold' :
                        item.status === 'completed' ? 'badge--blush' : 'badge--red'
                      }`}>
                        {item.status === 'confirmed' ? 'Confirmada' :
                         item.status === 'pending' ? 'Pendiente' :
                         item.status === 'completed' ? 'Completada' : 'Cancelada'}
                      </span>
                    </div>
                  ))}
                </div>
                <Link to="/appointments" className="btn btn--ghost btn--block" style={{ marginTop: 'var(--spacing-lg)' }}>
                  Ver Todas las Citas
                </Link>
              </div>

              <div className="card" style={{ marginTop: 'var(--spacing-xl)' }}>
                <h3 className="profile__section-title">Configuración</h3>
                <div className="profile__settings">
                  <button className="profile__setting">
                    <span>Cambiar Contraseña</span>
                    <span>→</span>
                  </button>
                  <button className="profile__setting">
                    <span>Notificaciones Push</span>
                    <span>→</span>
                  </button>
                  <button className="profile__setting">
                    <span>Preferencias de Notificación</span>
                    <span>→</span>
                  </button>
                  <button className="profile__setting profile__setting--danger">
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
