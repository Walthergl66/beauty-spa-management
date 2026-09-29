import { useState } from 'react';
import { Link } from 'react-router-dom';
import { services, serviceCategories } from '@/mocks/index.js';
import { ROUTES } from '@/routes/index.js';
import './Services.css';

export default function Services() {
  const [activeCategory, setActiveCategory] = useState('Todos');

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
          <div className="services-filter">
            {serviceCategories.map((category) => (
              <button
                key={category}
                className={`services-filter__btn ${category === activeCategory ? 'services-filter__btn--active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="services-grid">
            {filteredServices.map((service) => (
              <div key={service.id} className="service-card card">
                <div className="service-card__header">
                  <span className="service-card__icon">{service.icon}</span>
                  <span className="badge badge--blush">{service.category}</span>
                </div>
                <h3 className="service-card__name">{service.name}</h3>
                <p className="service-card__description">{service.description}</p>
                <div className="service-card__meta">
                  <span className="service-card__duration">
                    ⏱ {service.duration} min
                  </span>
                  <span className="service-card__price">${service.price}</span>
                </div>
                <Link to={ROUTES.serviceDetail(service.id)} className="btn btn--primary btn--block">
                  Reservar
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
