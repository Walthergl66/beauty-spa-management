// Barrel de mocks — única puerta de entrada a los datos simulados.
// TEMPORAL: se elimina cuando cada módulo consuma el backend real
// (ver skill frontend-data-contracts: shared/api-client + data hooks).
export { services, serviceCategories, serviceDetails, defaultBenefits, getServiceById } from './services.js';
export { specialists, timeSlots, appointments } from './booking.js';
export { statusLabels, statusClasses } from './status.js';
export { initialMessages, quickActions, conversations, simulatedReply } from './assistant.js';
export { kpis, recentAppointments, topServices } from './dashboard.js';
export { user, recentActivity } from './user.js';
export { heroImages, features, testimonials } from './marketing.js';
export { contact } from './contact.js';
