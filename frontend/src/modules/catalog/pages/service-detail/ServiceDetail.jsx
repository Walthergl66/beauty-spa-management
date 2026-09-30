import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { servicesApi } from '@/services/index.js';
import { formatPrice } from '@/modules/catalog/index.js';
import { ROUTES } from '@/routes/index.js';
import './ServiceDetail.css';

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    servicesApi
      .getById(id)
      .then((data) => {
        if (!cancelled) setService(data);
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
  }, [id]);

  return (
    <div className="service-detail">
      <section className="service-detail__hero">
        <div className="container">
          <Link to={ROUTES.services} className="service-detail__back">
            ← Volver a Servicios
          </Link>
          {loading && <p>Cargando servicio…</p>}
          {loadError && <p role="alert">No se pudo cargar el servicio: {loadError}</p>}
          {!loading && !loadError && service && (
            <div className="service-detail__header">
              {service.imageUrl ? (
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="service-detail__icon service-detail__image"
                />
              ) : (
                <span className="service-detail__icon">
                  {(service.category ?? service.name ?? '?').charAt(0)}
                </span>
              )}
              <div>
                {service.category && (
                  <span className="badge badge--blush">{service.category}</span>
                )}
                <h1 className="service-detail__title">{service.name}</h1>
              </div>
            </div>
          )}
        </div>
      </section>

      {!loading && !loadError && service && (
        <section className="section">
          <div className="container">
            <div className="service-detail__content">
              <div className="service-detail__main">
                <div className="card">
                  <h2 className="service-detail__section-title">Descripción</h2>
                  <p className="service-detail__description">
                    {service.description ?? 'Sin descripción disponible.'}
                  </p>
                </div>
              </div>

              <aside className="service-detail__sidebar">
                <div className="card service-detail__booking">
                  <h3 className="service-detail__booking-title">Reservar</h3>
                  <div className="service-detail__info">
                    <div className="service-detail__info-row">
                      <span>Duración</span>
                      <strong>{service.durationMinutes} minutos</strong>
                    </div>
                    <div className="service-detail__info-row">
                      <span>Precio</span>
                      <strong className="service-detail__price">{formatPrice(service.price)}</strong>
                    </div>
                  </div>
                  <Link
                    to={`${ROUTES.book}?service=${service.id}`}
                    className="btn btn--primary btn--block"
                  >
                    Reservar Ahora
                  </Link>
                  <p className="service-detail__note">
                    * Recibirás confirmación por correo electrónico
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
