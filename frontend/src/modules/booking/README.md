# Módulo booking

Reservas: wizard de reserva (`/book`) y mis citas (`/appointments`), ambas protegidas (login).

- Páginas: `pages/book/` (wizard controlado: servicio → especialista → fecha/hora → confirmar), `pages/appointments/` (cancelar/reprogramar).
- Datos: backend (`GET /services/active`, `GET /employees/service/:id`, `GET /availability`, `POST /appointments`, `GET /appointments/my`, `PATCH /appointments/:id/cancel|reschedule`) vía `@/services/index.js` + `StatusBadge` de `@/shared`.
