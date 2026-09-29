// Badge de estado único — etiquetas y clases alineadas al enum
// AppointmentStatus del backend (PENDING/CONFIRMED/COMPLETED/CANCELLED/NO_SHOW).
const statusLabels = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
  NO_SHOW: 'No asistió',
};

const statusClasses = {
  PENDING: 'badge--gold',
  CONFIRMED: 'badge--green',
  COMPLETED: 'badge--blush',
  CANCELLED: 'badge--red',
  NO_SHOW: 'badge--red',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`badge ${statusClasses[status] ?? 'badge--blush'}`}>
      {statusLabels[status] ?? status}
    </span>
  );
}
