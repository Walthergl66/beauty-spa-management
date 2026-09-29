import { statusLabels, statusClasses } from '@/mocks/index.js';

// Badge de estado único — reemplaza las copias de
// statusLabels/statusClasses que vivían en cada página.
export default function StatusBadge({ status }) {
  return (
    <span className={`badge ${statusClasses[status] ?? 'badge--blush'}`}>
      {statusLabels[status] ?? status}
    </span>
  );
}
