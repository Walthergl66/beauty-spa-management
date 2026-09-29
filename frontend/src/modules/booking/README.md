# Módulo booking

Reservas: wizard de reserva (`/book`) y mis citas (`/appointments`).

- Páginas: `pages/book/` (wizard visual, aún sin estado), `pages/appointments/`.
- Datos: `@/mocks` (`services`, `specialists`, `timeSlots`, `appointments`) + `StatusBadge` de `@/shared`.
- Pendiente: wizard controlado + `services/booking.service.js` contra el backend.
