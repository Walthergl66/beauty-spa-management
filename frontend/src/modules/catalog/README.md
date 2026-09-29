# Módulo catalog

Catálogo de servicios: lista (`/services`) y detalle (`/services/:id`).

- Páginas: `pages/services/` (filtro por categoría), `pages/service-detail/`.
- Datos: backend (`GET /services/active`, `GET /services/:id`) vía `@/services/index.js`.
- Navega a: `ROUTES.serviceDetail(id)`, `ROUTES.services`, `ROUTES.book`.
