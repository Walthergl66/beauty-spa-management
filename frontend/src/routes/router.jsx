import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/shared/index.js';
import { HomePage } from '@/modules/home/index.js';
import { ServicesPage, ServiceDetailPage } from '@/modules/catalog/index.js';
import { BookPage, AppointmentsPage } from '@/modules/booking/index.js';
import { LoginPage, RegisterPage } from '@/modules/auth/index.js';
import { DashboardPage } from '@/modules/dashboard/index.js';
import { AssistantPage } from '@/modules/assistant/index.js';
import { ProfilePage } from '@/modules/profile/index.js';
import { NotFound } from '@/shared/index.js';
import { ROUTES } from './paths.js';
import { RequireAuth } from './RequireAuth.jsx';

// Tabla de rutas — fina: solo monta páginas de módulos bajo el shell shared.
// Privada toda la app salvo inicio, login, registro y 404.
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={ROUTES.home} element={<HomePage />} />
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.register} element={<RegisterPage />} />
        <Route
          path={ROUTES.services}
          element={<RequireAuth><ServicesPage /></RequireAuth>}
        />
        <Route
          path="/services/:id"
          element={<RequireAuth><ServiceDetailPage /></RequireAuth>}
        />
        <Route
          path={ROUTES.dashboard}
          element={<RequireAuth role="ADMIN"><DashboardPage /></RequireAuth>}
        />
        <Route
          path={ROUTES.appointments}
          element={<RequireAuth><AppointmentsPage /></RequireAuth>}
        />
        <Route
          path={ROUTES.book}
          element={<RequireAuth><BookPage /></RequireAuth>}
        />
        <Route
          path={ROUTES.assistant}
          element={<RequireAuth><AssistantPage /></RequireAuth>}
        />
        <Route
          path={ROUTES.profile}
          element={<RequireAuth><ProfilePage /></RequireAuth>}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
