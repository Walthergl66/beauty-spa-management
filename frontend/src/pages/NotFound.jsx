import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="notfound-page">
      <div className="container text-center">
        <div className="notfound__content">
          <img src="/LogoSF.png" alt="Shirley Franco" className="notfound__logo" />
          <h1 className="notfound__code">404</h1>
          <h2 className="notfound__title">Página no encontrada</h2>
          <p className="notfound__text">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
          <Link to="/" className="btn btn--primary">
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
