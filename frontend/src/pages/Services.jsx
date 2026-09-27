import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Services.css';

const services = [
  {
    id: '1',
    name: 'Limpieza Facial Profunda',
    category: 'Facial',
    duration: 60,
    price: 45,
    description: 'Limpieza profunda con exfoliación, mascarilla hidratante y masaje facial revitalizante.',
    icon: '✦',
  },
  {
    id: '2',
    name: 'Tratamiento Anti-Edad',
    category: 'Facial',
    duration: 75,
    price: 65,
    description: 'Tratamiento con colágeno y ácido hialurónico para reducir líneas de expresión.',
    icon: '❀',
  },
  {
    id: '3',
    name: 'Masaje Relajante Corporal',
    category: 'Masaje',
    duration: 90,
    price: 55,
    description: 'Masaje de cuerpo completo con aceites esenciales para liberar tensión y estrés.',
    icon: '♡',
  },
  {
    id: '4',
    name: 'Masaje con Piedras Calientes',
    category: 'Masaje',
    duration: 75,
    price: 70,
    description: 'Terapia con piedras volcánicas calientes que alivian la tensión muscular.',
    icon: '✧',
  },
  {
    id: '5',
    name: 'Manicure Clásica',
    category: 'Uñas',
    duration: 45,
    price: 25,
    description: 'Limado, cutícula, exfoliación e hidratación con esmaltado perfecto.',
    icon: '✦',
  },
  {
    id: '6',
    name: 'Pedicure Spa',
    category: 'Uñas',
    duration: 60,
    price: 35,
    description: 'Ritual completo con sales minerales, mascarilla y masaje reconfortante.',
    icon: '❀',
  },
  {
    id: '7',
    name: 'Peinado para Eventos',
    category: 'Cabello',
    duration: 60,
    price: 50,
    description: 'Peinados elegantes para ocasiones especiales con acabado profesional.',
    icon: '♡',
  },
  {
    id: '8',
    name: 'Colorimetría y Tinte',
    category: 'Cabello',
    duration: 120,
    price: 80,
    description: 'Asesoría de color personalizada y aplicación de tinte premium.',
    icon: '✧',
  },
];

const categories = ['Todos', 'Facial', 'Masaje', 'Uñas', 'Cabello'];

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
            {categories.map((category) => (
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
                <Link to={`/services/${service.id}`} className="btn btn--primary btn--block">
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
