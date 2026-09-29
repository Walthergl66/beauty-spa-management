import { Outlet } from 'react-router-dom';
import { Navbar } from '../Navbar/index.js';
import { BottomNav } from '../BottomNav/index.js';
import { Footer } from '../Footer/index.js';
import { FloatingAssistant } from '../FloatingAssistant/index.js';

export default function Layout() {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout__main">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
      <FloatingAssistant />
    </div>
  );
}
