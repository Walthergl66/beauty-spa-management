import './Dashboard.css';
import { kpis, recentAppointments, topServices } from '@/mocks/index.js';
import { StatusBadge } from '@/shared/index.js';

export default function Dashboard() {
  return (
    <div className="dashboard">
      <section className="dashboard__header">
        <div className="container">
          <h1 className="dashboard__title">Dashboard</h1>
          <p className="dashboard__subtitle">Resumen general del spa</p>
        </div>
      </section>

      <section className="section section--tight">
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
                      <StatusBadge status={apt.status} />
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
