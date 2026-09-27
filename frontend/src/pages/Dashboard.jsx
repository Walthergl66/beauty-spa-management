import './Dashboard.css';

const kpis = [
  { label: 'Citas Hoy', value: '12', change: '+3', icon: '📅' },
  { label: 'Ingresos del Mes', value: '$2,450', change: '+12%', icon: '💰' },
  { label: 'Tasa de Cancelación', value: '4.2%', change: '-1.2%', icon: '📊' },
  { label: 'Clientes Nuevos', value: '28', change: '+8', icon: '👥' },
];

const recentAppointments = [
  { id: 1, client: 'María González', service: 'Limpieza Facial', time: '09:00', status: 'confirmed' },
  { id: 2, client: 'Carolina Ruiz', service: 'Masaje Relajante', time: '10:30', status: 'pending' },
  { id: 3, client: 'Ana Martínez', service: 'Manicure Clásica', time: '12:00', status: 'confirmed' },
  { id: 4, client: 'Laura Sánchez', service: 'Tratamiento Anti-Edad', time: '14:00', status: 'completed' },
  { id: 5, client: 'Patricia López', service: 'Pedicure Spa', time: '16:30', status: 'cancelled' },
];

const topServices = [
  { name: 'Limpieza Facial Profunda', bookings: 45, revenue: 2025 },
  { name: 'Masaje Relajante Corporal', bookings: 38, revenue: 2090 },
  { name: 'Manicure Clásica', bookings: 32, revenue: 800 },
  { name: 'Tratamiento Anti-Edad', bookings: 28, revenue: 1820 },
];

const statusLabels = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
};

const statusClasses = {
  pending: 'badge--gold',
  confirmed: 'badge--green',
  completed: 'badge--blush',
  cancelled: 'badge--red',
};

export default function Dashboard() {
  return (
    <div className="dashboard">
      <section className="dashboard__header">
        <div className="container">
          <h1 className="dashboard__title">Dashboard</h1>
          <p className="dashboard__subtitle">Resumen general del spa</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 'var(--spacing-xl)' }}>
        <div className="container">
          {/* KPIs */}
          <div className="dashboard__kpis">
            {kpis.map((kpi, index) => (
              <div key={index} className="dashboard__kpi card">
                <span className="dashboard__kpi-icon">{kpi.icon}</span>
                <div className="dashboard__kpi-content">
                  <span className="dashboard__kpi-label">{kpi.label}</span>
                  <span className="dashboard__kpi-value">{kpi.value}</span>
                  <span className="dashboard__kpi-change">{kpi.change}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="dashboard__grid">
            {/* Recent Appointments */}
            <div className="dashboard__card card">
              <h3 className="dashboard__card-title">Citas Recientes</h3>
              <div className="dashboard__table">
                {recentAppointments.map((apt) => (
                  <div key={apt.id} className="dashboard__table-row">
                    <div className="dashboard__table-info">
                      <strong>{apt.client}</strong>
                      <span>{apt.service}</span>
                    </div>
                    <div className="dashboard__table-meta">
                      <span className="dashboard__table-time">{apt.time}</span>
                      <span className={`badge ${statusClasses[apt.status]}`}>
                        {statusLabels[apt.status]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Services */}
            <div className="dashboard__card card">
              <h3 className="dashboard__card-title">Servicios Más Populares</h3>
              <div className="dashboard__services">
                {topServices.map((service, index) => (
                  <div key={index} className="dashboard__service">
                    <div className="dashboard__service-info">
                      <strong>{service.name}</strong>
                      <span>{service.bookings} reservas</span>
                    </div>
                    <span className="dashboard__service-revenue">${service.revenue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
