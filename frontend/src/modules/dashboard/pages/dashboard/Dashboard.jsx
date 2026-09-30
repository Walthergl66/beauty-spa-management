import { useEffect, useState } from 'react';
import { dashboardApi } from '@/services/index.js';
import { StatusBadge } from '@/shared/index.js';
import { formatPrice } from '@/modules/catalog/index.js';
import './Dashboard.css';

function clientName(appointment) {
  const client = appointment.client;
  const full = `${client?.firstName ?? ''} ${client?.lastName ?? ''}`.trim();
  return full || 'Cliente';
}

function formatDateTime(iso) {
  return new Date(iso).toLocaleString('es-EC', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [topServices, setTopServices] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      dashboardApi.summary(),
      dashboardApi.topServices({ limit: 5 }),
      dashboardApi.history(),
    ])
      .then(([summaryData, topData, historyData]) => {
        if (cancelled) return;
        setSummary(summaryData);
        setTopServices(Array.isArray(topData) ? topData : []);
        setRecent((Array.isArray(historyData) ? historyData : []).slice(0, 5));
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const kpis = summary
    ? [
        { icon: '📅', label: 'Total Citas', value: summary.total },
        { icon: '💰', label: 'Ingresos Completados', value: formatPrice(summary.revenueCompleted) },
        { icon: '📈', label: 'Ingresos Proyectados', value: formatPrice(summary.revenueProjected) },
        { icon: '❌', label: 'Tasa Cancelación', value: `${(summary.cancelRate * 100).toFixed(1)}%` },
      ]
    : [];

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
          {loading && <p className="text-center">Cargando indicadores…</p>}
          {loadError && (
            <p className="text-center" role="alert">
              No se pudo cargar el dashboard: {loadError}
            </p>
          )}
          {!loading && !loadError && (
            <>
              <div className="dashboard__kpis">
                {kpis.map((kpi) => (
                  <div key={kpi.label} className="dashboard__kpi card">
                    <span className="dashboard__kpi-icon">{kpi.icon}</span>
                    <div className="dashboard__kpi-content">
                      <span className="dashboard__kpi-label">{kpi.label}</span>
                      <span className="dashboard__kpi-value">{kpi.value}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="dashboard__grid">
                <div className="dashboard__card card">
                  <h3 className="dashboard__card-title">Citas Recientes</h3>
                  <div className="dashboard__table">
                    {recent.length === 0 ? (
                      <p className="dashboard__empty">Sin citas registradas.</p>
                    ) : (
                      recent.map((apt) => (
                        <div key={apt.id} className="dashboard__table-row">
                          <div className="dashboard__table-info">
                            <strong>{clientName(apt)}</strong>
                            <span>{apt.service?.name}</span>
                          </div>
                          <div className="dashboard__table-meta">
                            <span className="dashboard__table-time">{formatDateTime(apt.startTime)}</span>
                            <StatusBadge status={apt.status} />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="dashboard__card card">
                  <h3 className="dashboard__card-title">Servicios Más Populares</h3>
                  <div className="dashboard__services">
                    {topServices.length === 0 ? (
                      <p className="dashboard__empty">Sin datos de servicios.</p>
                    ) : (
                      topServices.map((service) => (
                        <div key={service.serviceId} className="dashboard__service">
                          <div className="dashboard__service-info">
                            <strong>{service.serviceName}</strong>
                            <span>{service.bookings} reservas</span>
                          </div>
                          <span className="dashboard__service-revenue">{formatPrice(service.revenue)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
