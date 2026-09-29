import './BookAppointment.css';
import { services, specialists, timeSlots } from '@/mocks/index.js';

export default function BookAppointment() {
  return (
    <div className="book-page">
      <section className="book__header">
        <div className="container">
          <h1 className="book__title">Reservar Cita</h1>
          <p className="book__subtitle">Completa los pasos para agendar tu cita</p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="book__steps">
            <div className="book__step book__step--active">
              <span className="book__step-number">1</span>
              <span className="book__step-label">Servicio</span>
            </div>
            <div className="book__step-line"></div>
            <div className="book__step">
              <span className="book__step-number">2</span>
              <span className="book__step-label">Especialista</span>
            </div>
            <div className="book__step-line"></div>
            <div className="book__step">
              <span className="book__step-number">3</span>
              <span className="book__step-label">Fecha y Hora</span>
            </div>
            <div className="book__step-line"></div>
            <div className="book__step">
              <span className="book__step-number">4</span>
              <span className="book__step-label">Confirmar</span>
            </div>
          </div>

          <div className="book__content">
            <div className="book__main">
              <div className="card">
                <h2 className="book__section-title">Selecciona un Servicio</h2>
                <div className="book__services">
                  {services.map((service) => (
                    <label key={service.id} className="book__service">
                      <input type="radio" name="service" className="book__service-radio" />
                      <div className="book__service-info">
                        <span className="book__service-name">{service.name}</span>
                        <span className="book__service-meta">
                          {service.duration} min · ${service.price}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="card mt-xl">
                <h2 className="book__section-title">Selecciona un Especialista</h2>
                <div className="book__specialists">
                  {specialists.map((specialist) => (
                    <label key={specialist.id} className="book__specialist">
                      <input type="radio" name="specialist" className="book__specialist-radio" />
                      <div className="book__specialist-avatar">{specialist.avatar}</div>
                      <div className="book__specialist-info">
                        <span className="book__specialist-name">{specialist.name}</span>
                        <span className="book__specialist-specialty">{specialist.specialty}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="card mt-xl">
                <h2 className="book__section-title">Selecciona Fecha y Hora</h2>
                <div className="book__datetime">
                  <div className="book__date">
                    <label className="book__label">Fecha</label>
                    <input type="date" className="input" defaultValue="2026-09-28" />
                  </div>
                  <div className="book__time">
                    <label className="book__label">Hora</label>
                    <div className="book__slots">
                      {timeSlots.map((slot) => (
                        <button key={slot} className="book__slot">
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="book__sidebar">
              <div className="card book__summary">
                <h3 className="book__summary-title">Resumen</h3>
                <div className="book__summary-row">
                  <span>Servicio</span>
                  <span className="book__summary-value">Por seleccionar</span>
                </div>
                <div className="book__summary-row">
                  <span>Especialista</span>
                  <span className="book__summary-value">Por seleccionar</span>
                </div>
                <div className="book__summary-row">
                  <span>Fecha</span>
                  <span className="book__summary-value">Por seleccionar</span>
                </div>
                <div className="book__summary-row">
                  <span>Hora</span>
                  <span className="book__summary-value">Por seleccionar</span>
                </div>
                <hr className="book__summary-divider" />
                <div className="book__summary-row">
                  <strong>Total</strong>
                  <strong className="book__summary-total">—</strong>
                </div>
                <button className="btn btn--primary btn--block" disabled>
                  Confirmar Reserva
                </button>
                <p className="book__note">
                  * Todos los campos son obligatorios
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
