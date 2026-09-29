export const specialists = [
  { id: '1', name: 'Dra. Elena Vargas', specialty: 'Facial', avatar: 'EV' },
  { id: '2', name: 'Lic. Carmen Morales', specialty: 'Masaje', avatar: 'CM' },
  { id: '3', name: 'Lic. Sofia Reyes', specialty: 'Uñas', avatar: 'SR' },
  { id: '4', name: 'Lic. Andrea Torres', specialty: 'Cabello', avatar: 'AT' },
];

export const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
];

export const appointments = [
  {
    id: 1,
    service: 'Limpieza Facial Profunda',
    specialist: 'Dra. Elena Vargas',
    date: '2026-09-28',
    time: '10:00',
    status: 'confirmed',
    price: 45,
  },
  {
    id: 2,
    service: 'Masaje Relajante Corporal',
    specialist: 'Lic. Carmen Morales',
    date: '2026-10-02',
    time: '14:00',
    status: 'pending',
    price: 55,
  },
  {
    id: 3,
    service: 'Manicure Clásica',
    specialist: 'Lic. Sofia Reyes',
    date: '2026-09-20',
    time: '11:00',
    status: 'completed',
    price: 25,
  },
  {
    id: 4,
    service: 'Tratamiento Anti-Edad',
    specialist: 'Dra. Elena Vargas',
    date: '2026-09-15',
    time: '09:00',
    status: 'completed',
    price: 65,
  },
  {
    id: 5,
    service: 'Pedicure Spa',
    specialist: 'Lic. Carmen Morales',
    date: '2026-09-10',
    time: '16:00',
    status: 'cancelled',
    price: 35,
  },
];
