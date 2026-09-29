import './Appointments.css';

const appointments = [
  {
    id: 1,
    service: 'Limpieza Facial Profunda',
    specialist: 'Dra. Elena Vargas',
    date: '2026-09-28',
    time: '10:00',
    status: 'confirmed',
    price: 45,
  },
  {
    id: 2,
    service: 'Masaje Relajante Corporal',
    specialist: 'Lic. Carmen Morales',
    date: '2026-10-02',
    time: '14:00',
    status: 'pending',
    price: 55,
  },
  {
    id: 3,
    service: 'Manicure Clásica',
    specialist: 'Lic. Sofia Reyes',
    date: '2026-09-20',
    time: '11:00',
    status: 'completed',
    price: 25,
  },
  {
    id: 4,
    service: 'Tratamiento Anti-Edad',
    specialist: 'Dra. Elena Vargas',
    date: '2026-09-15',
    time: '09:00',
    status: 'completed',
    price: 65,
  },
  {
    id: 5,
    service: 'Pedicure Spa',
    specialist: 'Lic. Carmen Morales',
    date: '2026-09-10',
    time: '16:00',
    status: 'cancelled',
    price: 35,
  },
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

export default function Appointments() {
  return (
    <div className="appointments-page">
      <section className="appointments__header">
        <div className="container">
          <h1 className="appointments__title">Mis Citas</h1>
          <p className="appointments__subtitle">Gestiona y revisa tus reservas</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 'var(--spacing-xl)' }}>
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
                  <span className={`badge ${statusClasses[apt.status]}`}>
                    {statusLabels[apt.status]}
                  </span>
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
