import './Appointments.css';
import { appointments } from '@/mocks/index.js';
import { StatusBadge } from '@/shared/index.js';

export default function Appointments() {
  return (
    <div className="appointments-page">
      <section className="appointments__header">
        <div className="container">
          <h1 className="appointments__title">Mis Citas</h1>
          <p className="appointments__subtitle">Gestiona y revisa tus reservas</p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="appointments__list">
            {appointments.map((apt) => (
              <div key={apt.id} className="appointment-card card">
                <div className="appointment-card__main">
                  <div className="appointment-card__info">
                    <h3 className="appointment-card__service">{apt.service}</h3>
                    <p className="appointment-card__specialist">con {apt.specialist}</p>
                  </div>
                  <div className="appointment-card__details">
                    <div className="appointment-card__detail">
                      <span className="appointment-card__label">Fecha</span>
                      <span className="appointment-card__value">
                        {new Date(apt.date).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                        })}
                      </span>
                    </div>
                    <div className="appointment-card__detail">
                      <span className="appointment-card__label">Hora</span>
                      <span className="appointment-card__value">{apt.time}</span>
                    </div>
                    <div className="appointment-card__detail">
                      <span className="appointment-card__label">Precio</span>
                      <span className="appointment-card__value appointment-card__price">
                        ${apt.price}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="appointment-card__footer">
                  <StatusBadge status={apt.status} />
                  {apt.status === 'pending' && (
                    <div className="appointment-card__actions">
                      <button className="btn btn--sm btn--secondary">Reprogramar</button>
                      <button className="btn btn--sm btn--ghost">Cancelar</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
