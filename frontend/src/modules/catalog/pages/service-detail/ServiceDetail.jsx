import { useParams, Link } from 'react-router-dom';
import { getServiceById } from '@/mocks/index.js';
import { ROUTES } from '@/routes/index.js';
import './ServiceDetail.css';

export default function ServiceDetail() {
  const { id } = useParams();
  const service = getServiceById(id);

  return (
    <div className="service-detail">
      <section className="service-detail__hero">
        <div className="container">
          <Link to={ROUTES.services} className="service-detail__back">
            ← Volver a Servicios
          </Link>
          <div className="service-detail__header">
            <span className="service-detail__icon">{service.icon}</span>
            <div>
              <span className="badge badge--blush">{service.category}</span>
              <h1 className="service-detail__title">{service.name}</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="service-detail__content">
            <div className="service-detail__main">
              <div className="card">
                <h2 className="service-detail__section-title">Descripción</h2>
                <p className="service-detail__description">{service.description}</p>

                <h3 className="service-detail__section-title mt-xl">
                  Beneficios
                </h3>
                <ul className="service-detail__benefits">
                  {service.benefits.map((benefit, index) => (
                    <li key={index}>
                      <span className="service-detail__check">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <aside className="service-detail__sidebar">
              <div className="card service-detail__booking">
                <h3 className="service-detail__booking-title">Reservar</h3>
                <div className="service-detail__info">
                  <div className="service-detail__info-row">
                    <span>Duración</span>
                    <strong>{service.duration} minutos</strong>
                  </div>
                  <div className="service-detail__info-row">
                    <span>Precio</span>
                    <strong className="service-detail__price">${service.price}</strong>
                  </div>
                </div>
                <Link to={ROUTES.book} className="btn btn--primary btn--block">
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
    </div>
  );
}
