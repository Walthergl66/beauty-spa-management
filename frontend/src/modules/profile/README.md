# Módulo profile

Perfil del cliente (`/profile`, protegida): tarjeta usuario, stats, actividad, settings.

- Página: `pages/profile/` (editar info vía `PATCH /users/profile`, cambio de contraseña vía `POST /auth/change-password`, stats y actividad desde `GET /appointments/my`).
- Datos: backend vía `@/services/index.js` + `StatusBadge` de `@/shared`.
- Navega a: `ROUTES.appointments`.
