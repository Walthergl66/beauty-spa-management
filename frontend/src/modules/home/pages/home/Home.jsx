import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { servicesApi } from '@/services/index.js';
import { formatPrice } from '@/modules/catalog/index.js';
import { ROUTES } from '@/routes/index.js';
import './Home.css';

// Activos de presentación del home (carrusel y propuesta de valor).
// Los servicios destacados sí vienen del backend.
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1200&q=80',
  'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&q=80',
  'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1200&q=80',
  'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=1200&q=80',
  'https://images.unsplash.com/photo-1509967199874-51c8fb92d195?w=1200&q=80',
];

const FEATURES = [
  {
    icon: '✦',
    title: 'Reserva Fácil',
    description: 'Agenda tu cita en pocos clics, disponibles 24/7 desde cualquier dispositivo.',
  },
  {
    icon: '❀',
    title: 'Personal Certificado',
    description:
      'Nuestro equipo de especialistas está altamente capacitado para brindarte la mejor atención.',
  },
  {
    icon: '♡',
    title: 'Ambiente Relajante',
    description: 'Disfruta de un espacio diseñado para tu confort y bienestar integral.',
  },
  {
    icon: '✧',
    title: 'Productos Premium',
    description: 'Utilizamos productos de alta calidad para resultados excepcionales.',
  },
];

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let cancelled = false;
    servicesApi
      .listActive()
      .then((data) => {
        if (!cancelled) setFeatured((Array.isArray(data) ? data : []).slice(0, 3));
      })
      .catch(() => {
        if (!cancelled) setFeatured([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="home__hero">
        {HERO_IMAGES.map((src, index) => (
          <div
            key={src}
            className={`home__hero-slide ${index === currentImage ? 'home__hero-slide--active' : ''}`}
            aria-hidden={index !== currentImage}
          >
            <img src={src} alt="" className="home__hero-img" loading={index === 0 ? 'eager' : 'lazy'} />
          </div>
        ))}
        <div className="home__hero-overlay" />
        <div className="container home__hero-content">
          <div className="home__hero-text">
            <h1 className="home__hero-title">
              Tu espacio de <span className="text-gold">belleza</span> y bienestar
            </h1>
            <p className="home__hero-description">
              Descubre una experiencia única de relajación y cuidado personal.
              Reserva tus citas y déjanos consentirte como mereces.
            </p>
            <div className="home__hero-actions">
              <Link to={ROUTES.book} className="btn btn--primary">
                Reservar Ahora
              </Link>
              <Link to={ROUTES.services} className="btn btn--secondary">
                Ver Servicios
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section section--blush">
        <div className="container">
          <div className="text-center">
            <h2 className="home__section-title">¿Por qué elegirnos?</h2>
            <hr className="divider" />
          </div>
          <div className="home__features">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="home__feature card">
                <span className="home__feature-icon">{feature.icon}</span>
                <h3 className="home__feature-title">{feature.title}</h3>
                <p className="home__feature-text">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview (datos reales) */}
      <section className="section">
        <div className="container">
          <div className="text-center">
            <h2 className="home__section-title">Nuestros Servicios</h2>
            <hr className="divider" />
            <p className="home__section-subtitle">
              Descubre nuestra variedad de tratamientos diseñados para tu bienestar
            </p>
          </div>
          {featured.length > 0 && (
            <div className="home__services">
              {featured.map((service) => (
                <Link
                  key={service.id}
                  to={ROUTES.serviceDetail(service.id)}
                  className="home__service-card"
                >
                  <div className="home__service-image">
                    <span>{(service.category ?? service.name).charAt(0)}</span>
                  </div>
                  <div className="home__service-content">
                    <h3>{service.name}</h3>
                    <p>
                      {service.durationMinutes} min · {formatPrice(service.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-2xl">
            <Link to={ROUTES.services} className="btn btn--outline">
              Ver Todos los Servicios
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section home__cta">
        <div className="container text-center">
          <h2 className="home__cta-title">¿Lista para consentirte?</h2>
          <p className="home__cta-text">
            Reserva tu cita hoy y vive la experiencia Shirley Franco
          </p>
          <Link to={ROUTES.book} className="btn btn--primary">
            Reservar Mi Cita
          </Link>
        </div>
      </section>
    </div>
  );
}
