import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/modules/auth/index.js';
import { servicesApi } from '@/services/index.js';
import { formatPrice } from '@/modules/catalog/index.js';
import { ROUTES } from '@/routes/index.js';
import HomeLanding from './HomeLanding.jsx';
import './Home.css';

const QUICK_ACTIONS = [
  {
    title: 'Reservar Cita',
    description: 'Agenda tu próxima sesión',
    to: ROUTES.book,
    primary: true,
  },
  {
    title: 'Ver Servicios',
    description: 'Explora nuestro catálogo',
    to: ROUTES.services,
  },
  {
    title: 'Mis Citas',
    description: 'Consulta tus reservas',
    to: ROUTES.appointments,
  },
  {
    title: 'Mi Perfil',
    description: 'Tu información personal',
    to: ROUTES.profile,
  },
];

const TIPS = [
  {
    title: 'Hidratación',
    description: 'Bebe al menos 8 vasos de agua al día para mantener tu piel radiante.',
  },
  {
    title: 'Protección Solar',
    description: 'Usa protector solar todos los días, incluso en días nublados.',
  },
  {
    title: 'Descanso',
    description: 'Duerme 7-8 horas para permitir la regeneración celular.',
  },
  {
    title: 'Alimentación',
    description: 'Incluye frutas y verduras ricas en antioxidantes en tu dieta.',
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Buenos días');
    else if (hour < 18) setGreeting('Buenas tardes');
    else setGreeting('Buenas noches');
  }, []);

  useEffect(() => {
    let cancelled = false;
    servicesApi
      .listActive()
      .then((data) => {
        if (!cancelled) setFeatured((Array.isArray(data) ? data : []).slice(0, 4));
      })
      .catch(() => {
        if (!cancelled) setFeatured([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Si no está autenticado, mostrar la landing page de presentación
  if (!isAuthenticated) {
    return <HomeLanding />;
  }

  // Vista para clientas autenticadas
  return (
    <div className="home">
      {/* Header con saludo */}
      <section className="home__header">
        <div className="container">
          <h1 className="home__greeting">
            {greeting}, <span className="text-gold">bienvenida</span>
          </h1>
          <p className="home__subtitle">
            ¿Qué te gustaría hacer hoy?
          </p>
        </div>
      </section>

      {/* Tips recomendados */}
      <section className="home__section home__tips-section">
        <div className="container">
          <h2 className="home__section-title">Tips para tu bienestar</h2>
          <div className="home__tips">
            {TIPS.map((tip) => (
              <div key={tip.title} className="home__tip">
                <h3 className="home__tip-title">{tip.title}</h3>
                <p className="home__tip-desc">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Acciones rápidas */}
      <section className="home__section">
        <div className="container">
          <div className="home__actions">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.title}
                to={action.to}
                className={`home__action-card ${action.primary ? 'home__action-card--primary' : ''}`}
              >
                <h3 className="home__action-title">{action.title}</h3>
                <p className="home__action-desc">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios destacados */}
      <section className="home__section home__section--blush">
        <div className="container">
          <div className="home__section-header">
            <h2 className="home__section-title">Servicios Populares</h2>
            <Link to={ROUTES.services} className="home__section-link">
              Ver todos
            </Link>
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
                    <p className="home__service-meta">
                      {service.durationMinutes} min · {formatPrice(service.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info del spa */}
      <section className="home__section">
        <div className="container">
          <div className="home__info">
            <div className="home__info-card">
              <h3>Horario</h3>
              <p>Lun - Sáb: 9:00 - 19:00</p>
              <p>Domingo: 10:00 - 14:00</p>
            </div>
            <div className="home__info-card">
              <h3>Contacto</h3>
              <p>(02) 123-4567</p>
              <p>Av. Principal 123</p>
            </div>
            <div className="home__info-card">
              <h3>Reserva</h3>
              <p>En línea o por teléfono</p>
              <p>Cancelación gratuita 2h antes</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
