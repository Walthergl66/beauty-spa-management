# Sherley Franco — Frontend

Sistema de gestión de citas para Spas de Belleza. Frontend en React con PWA.

## Requisitos

- Node.js 18+
- npm o yarn

## Instalación

```bash
cd frontend
npm install
```

## Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Build de Producción

```bash
npm run build
npm run preview
```

## Estructura del Proyecto

```
frontend/
├── public/
│   ├── favicon.svg
│   └── icons/
├── src/
│   ├── components/       # Componentes reutilizables
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── pages/           # Páginas de la aplicación
│   │   ├── Home.jsx
│   │   ├── Services.jsx
│   │   ├── ServiceDetail.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Appointments.jsx
│   │   ├── BookAppointment.jsx
│   │   ├── Assistant.jsx
│   │   ├── Profile.jsx
│   │   └── NotFound.jsx
│   ├── styles/          # Estilos globales
│   │   └── global.css
│   ├── App.jsx          # Rutas principales
│   └── main.jsx         # Punto de entrada
├── index.html
├── package.json
└── vite.config.js
```

## Paleta de Colores

| Color | Uso |
|-------|-----|
| Blanco (#FFFFFF) | Fondo principal |
| Rosa Palo (#F8E1E7) | Acentos, badges, gradientes |
| Dorado (#D4AF37) | Botones primarios, detalles elegantes |

## PWA

La aplicación está configurada como Progressive Web App con:
- Manifest para instalación
- Service Worker para caché offline
- Iconos para diferentes tamaños

## Notas

- Este frontend es **estático** — no tiene conexión al backend aún
- Los datos mostrados son de ejemplo (mock data)
- El backend NestJS está en la carpeta `../backend`
