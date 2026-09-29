import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { heroImages, features, testimonials } from '@/mocks/index.js';
import { ROUTES } from '@/routes/index.js';
import './Home.css';

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="home__hero">
        {heroImages.map((src, index) => (
          <div
            key={index}
            className={`home__hero-slide ${index === currentImage ? 'home__hero-slide--active' : ''}`}
            style={{ backgroundImage: `url(${src})` }}
          />
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
            {features.map((feature, index) => (
              <div key={index} className="home__feature card">
                <span className="home__feature-icon">{feature.icon}</span>
                <h3 className="home__feature-title">{feature.title}</h3>
                <p className="home__feature-text">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section">
        <div className="container">
          <div className="text-center">
            <h2 className="home__section-title">Nuestros Servicios</h2>
            <hr className="divider" />
            <p className="home__section-subtitle">
              Descubre nuestra variedad de tratamientos diseñados para tu bienestar
            </p>
          </div>
          <div className="home__services">
            <div className="home__service-card">
              <div className="home__service-image">
                <span>✦</span>
              </div>
              <div className="home__service-content">
                <h3>Faciales</h3>
                <p>Tratamientos rejuvenecedores y limpieza profunda para tu piel.</p>
              </div>
            </div>
            <div className="home__service-card">
              <div className="home__service-image">
                <span>❀</span>
              </div>
              <div className="home__service-content">
                <h3>Masajes</h3>
                <p>Relajación total con nuestros terapeutas certificados.</p>
              </div>
            </div>
            <div className="home__service-card">
              <div className="home__service-image">
                <span>♡</span>
              </div>
              <div className="home__service-content">
                <h3>Uñas</h3>
                <p>Manicure, pedicure y diseños exclusivos para ti.</p>
              </div>
            </div>
          </div>
          <div className="text-center mt-2xl">
            <Link to={ROUTES.services} className="btn btn--outline">
              Ver Todos los Servicios
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section section--blush">
        <div className="container">
          <div className="text-center">
            <h2 className="home__section-title">Lo que dicen nuestras clientas</h2>
            <hr className="divider" />
          </div>
          <div className="home__testimonials">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="home__testimonial card">
                <div className="home__testimonial-stars">
                  {'★'.repeat(testimonial.rating)}
                </div>
                <p className="home__testimonial-text">"{testimonial.text}"</p>
                <div className="home__testimonial-author">
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.service}</span>
                </div>
              </div>
            ))}
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
