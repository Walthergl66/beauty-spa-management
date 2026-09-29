// Barrel shared — único punto de entrada entre módulos.
// Regla: importar `@/shared`, nunca rutas profundas como
// `@/shared/Navbar/Navbar.jsx`.
export { Layout } from './Layout/index.js';
export { Navbar } from './Navbar/index.js';
export { Footer } from './Footer/index.js';
export { FloatingAssistant } from './FloatingAssistant/index.js';
export { NotFound } from './NotFound/index.js';
export { StatusBadge } from './StatusBadge/index.js';
