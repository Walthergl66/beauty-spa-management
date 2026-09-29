# Módulo auth

Autenticación: login (`/login`) y registro (`/register`).

- Páginas: `pages/login/`, `pages/register/` (comparten `Auth.css` del módulo).
- Sesión: `context/AuthContext.jsx` (`AuthProvider`, `useAuth`, `useRequireAuth`) contra el backend (`POST /auth/login|register|refresh|logout`, `GET /auth/me`).
