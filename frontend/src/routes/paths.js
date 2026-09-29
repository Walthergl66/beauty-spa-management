// Rutas centrales — ninguna página o componente hardcodea strings de ruta.
// Importar siempre desde aquí: `import { ROUTES } from '@/routes';`
export const ROUTES = {
  home: '/',
  services: '/services',
  serviceDetail: (id) => `/services/${id}`,
  book: '/book',
  appointments: '/appointments',
  dashboard: '/dashboard',
  assistant: '/assistant',
  profile: '/profile',
  login: '/login',
  register: '/register',
};
