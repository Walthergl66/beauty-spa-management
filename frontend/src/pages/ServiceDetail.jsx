import { useParams, Link } from 'react-router-dom';
import './ServiceDetail.css';

const serviceData = {
  '1': {
    name: 'Limpieza Facial Profunda',
    category: 'Facial',
    duration: 60,
    price: 45,
    description: 'Nuestra limpieza facial profunda incluye exfoliación suave, extracción de impurezas, mascarilla hidratante personalizada según tu tipo de piel y un masaje facial revitalizante que estimula la circulación.',
    benefits: ['Piel más limpia y luminosa', 'Reducción de poros abiertos', 'Hidratación profunda', 'Efecto relajante'],
    icon: '✦',
  },
  '2': {
    name: 'Tratamiento Anti-Edad',
    category: 'Facial',
    duration: 75,
    price: 65,
    description: 'Tratamiento avanzado con colágeno y ácido hialurónico que ayuda a reducir líneas de expresión, mejorar la elasticidad y devolver la juventud a tu piel.',
    benefits: ['Reduce arrugas', 'Reafirma la piel', 'Hidratación intensa', 'Resultados visibles'],
    icon: '❀',
  },
  '3': {
    name: 'Masaje Relajante Corporal',
    category: 'Masaje',
    duration: 90,
    price: 55,
    description: 'Masaje de cuerpo completo con aceites esenciales que libera la tensión muscular, mejora la circulación y proporciona un estado profundo de relajación.',
    benefits: ['Alivio del estrés', 'Relajación muscular', 'Mejor circulación', 'Bienestar general'],
    icon: '♡',
  },
};

export default function ServiceDetail() {
  const { id } = useParams();
  const service = serviceData[id] || serviceData['1'];

  return (
    <div className="service-detail">
      <section className="service-detail__hero">
        <div className="container">
          <Link to="/services" className="service-detail__back">
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

                <h3 className="service-detail__section-title" style={{ marginTop: 'var(--spacing-xl)' }}>
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
                <Link to="/book" className="btn btn--primary btn--block">
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
