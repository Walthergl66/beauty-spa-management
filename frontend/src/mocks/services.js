// Catálogo canónico de servicios (única fuente de verdad).
// Cuando el backend esté conectado, este archivo se reemplaza por
// services del módulo catalog (ver frontend-data-contracts).
export const services = [
  {
    id: '1',
    name: 'Limpieza Facial Profunda',
    category: 'Facial',
    duration: 60,
    price: 45,
    description:
      'Limpieza profunda con exfoliación, mascarilla hidratante y masaje facial revitalizante.',
    icon: '✦',
  },
  {
    id: '2',
    name: 'Tratamiento Anti-Edad',
    category: 'Facial',
    duration: 75,
    price: 65,
    description:
      'Tratamiento con colágeno y ácido hialurónico para reducir líneas de expresión.',
    icon: '❀',
  },
  {
    id: '3',
    name: 'Masaje Relajante Corporal',
    category: 'Masaje',
    duration: 90,
    price: 55,
    description:
      'Masaje de cuerpo completo con aceites esenciales para liberar tensión y estrés.',
    icon: '♡',
  },
  {
    id: '4',
    name: 'Masaje con Piedras Calientes',
    category: 'Masaje',
    duration: 75,
    price: 70,
    description:
      'Terapia con piedras volcánicas calientes que alivian la tensión muscular.',
    icon: '✧',
  },
  {
    id: '5',
    name: 'Manicure Clásica',
    category: 'Uñas',
    duration: 45,
    price: 25,
    description: 'Limado, cutícula, exfoliación e hidratación con esmaltado perfecto.',
    icon: '✦',
  },
  {
    id: '6',
    name: 'Pedicure Spa',
    category: 'Uñas',
    duration: 60,
    price: 35,
    description: 'Ritual completo con sales minerales, mascarilla y masaje reconfortante.',
    icon: '❀',
  },
  {
    id: '7',
    name: 'Peinado para Eventos',
    category: 'Cabello',
    duration: 60,
    price: 50,
    description: 'Peinados elegantes para ocasiones especiales con acabado profesional.',
    icon: '♡',
  },
  {
    id: '8',
    name: 'Colorimetría y Tinte',
    category: 'Cabello',
    duration: 120,
    price: 80,
    description: 'Asesoría de color personalizada y aplicación de tinte premium.',
    icon: '✧',
  },
];

export const serviceCategories = ['Todos', 'Facial', 'Masaje', 'Uñas', 'Cabello'];

// Detalle extendido (descripción larga + beneficios) solo disponible para
// estos ids; el resto usa la descripción del catálogo + defaultBenefits.
export const serviceDetails = {
  1: {
    description:
      'Nuestra limpieza facial profunda incluye exfoliación suave, extracción de impurezas, mascarilla hidratante personalizada según tu tipo de piel y un masaje facial revitalizante que estimula la circulación.',
    benefits: [
      'Piel más limpia y luminosa',
      'Reducción de poros abiertos',
      'Hidratación profunda',
      'Efecto relajante',
    ],
  },
  2: {
    description:
      'Tratamiento avanzado con colágeno y ácido hialurónico que ayuda a reducir líneas de expresión, mejorar la elasticidad y devolver la juventud a tu piel.',
    benefits: [
      'Reduce arrugas',
      'Reafirma la piel',
      'Hidratación intensa',
      'Resultados visibles',
    ],
  },
  3: {
    description:
      'Masaje de cuerpo completo con aceites esenciales que libera la tensión muscular, mejora la circulación y proporciona un estado profundo de relajación.',
    benefits: [
      'Alivio del estrés',
      'Relajación muscular',
      'Mejor circulación',
      'Bienestar general',
    ],
  },
};

export const defaultBenefits = [
  'Atención personalizada',
  'Productos premium',
  'Ambiente relajante',
  'Personal certificado',
];

export function getServiceById(id) {
  const service = services.find((s) => s.id === id) ?? services[0];
  const details = serviceDetails[service.id];
  return {
    ...service,
    description: details?.description ?? service.description,
    benefits: details?.benefits ?? defaultBenefits,
  };
}
