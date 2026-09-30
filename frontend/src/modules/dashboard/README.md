# Módulo dashboard

Panel administrativo (`/dashboard`, solo rol ADMIN): KPIs, citas recientes, top servicios.

- Página: `pages/dashboard/`.
- Datos: backend (`GET /dashboard/summary|top-services|history`) vía `@/services/index.js` + `StatusBadge` de `@/shared`.
