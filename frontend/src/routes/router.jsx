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

// Tabla de rutas — fina: solo monta páginas de módulos bajo el shell shared.
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={ROUTES.home} element={<HomePage />} />
        <Route path={ROUTES.services} element={<ServicesPage />} />
        <Route path="/services/:id" element={<ServiceDetailPage />} />
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.register} element={<RegisterPage />} />
        <Route path={ROUTES.dashboard} element={<DashboardPage />} />
        <Route path={ROUTES.appointments} element={<AppointmentsPage />} />
        <Route path={ROUTES.book} element={<BookPage />} />
        <Route path={ROUTES.assistant} element={<AssistantPage />} />
        <Route path={ROUTES.profile} element={<ProfilePage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
