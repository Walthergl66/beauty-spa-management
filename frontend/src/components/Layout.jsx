import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import FloatingAssistant from './FloatingAssistant.jsx';

export default function Layout() {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout__main">
        <Outlet />
      </main>
      <Footer />
      <FloatingAssistant />
    </div>
  );
}
