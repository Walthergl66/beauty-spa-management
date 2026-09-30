import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { servicesApi } from '@/services/index.js';
import { formatPrice } from '@/modules/catalog/index.js';
import { ROUTES } from '@/routes/index.js';
import './Services.css';

export default function Services() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    servicesApi
      .listActive()
      .then((data) => {
        if (!cancelled) setServices(Array.isArray(data) ? data : []);
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

  const categories = useMemo(() => {
    const unique = [...new Set(services.map((service) => service.category).filter(Boolean))];
    return ['Todos', ...unique];
  }, [services]);

  const filteredServices = activeCategory === 'Todos'
    ? services
    : services.filter((service) => service.category === activeCategory);

  return (
    <div className="services-page">
      <section className="services-hero">
        <div className="container text-center">
          <h1 className="services-hero__title">Nuestros Servicios</h1>
          <hr className="divider" />
          <p className="services-hero__subtitle">
            Descubre nuestra variedad de tratamientos diseñados para tu belleza y bienestar
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading && <p className="text-center">Cargando servicios…</p>}
          {loadError && (
            <p className="text-center" role="alert">
              No se pudieron cargar los servicios: {loadError}
            </p>
          )}
          {!loading && !loadError && (
            <>
              <div className="services-filter">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`services-filter__btn ${category === activeCategory ? 'services-filter__btn--active' : ''}`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {filteredServices.length === 0 ? (
                <p className="text-center">No hay servicios disponibles por el momento.</p>
              ) : (
                <div className="services-grid">
                  {filteredServices.map((service) => (
                    <div key={service.id} className="service-card card">
                      <div className="service-card__header">
                        {service.imageUrl ? (
                          <img
                            src={service.imageUrl}
                            alt={service.name}
                            className="service-card__image"
                          />
                        ) : (
                          <span className="service-card__icon">
                            {(service.category ?? service.name ?? '?').charAt(0)}
                          </span>
                        )}
                        {service.category && (
                          <span className="badge badge--blush">{service.category}</span>
                        )}
                      </div>
                      <h3 className="service-card__name">{service.name}</h3>
                      <p className="service-card__description">{service.description}</p>
                      <div className="service-card__meta">
                        <span className="service-card__duration">
                          ⏱ {service.durationMinutes} min
                        </span>
                        <span className="service-card__price">{formatPrice(service.price)}</span>
                      </div>
                      <Link to={ROUTES.serviceDetail(service.id)} className="btn btn--primary btn--block">
                        Reservar
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
