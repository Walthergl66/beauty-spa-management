import { useCallback, useEffect, useState } from 'react';
import { appointmentsApi } from '@/services/index.js';
import { useRequireAuth } from '@/modules/auth/index.js';
import { StatusBadge } from '@/shared/index.js';
import { formatPrice } from '@/modules/catalog/index.js';
import './Appointments.css';

const ACTIONABLE = ['PENDING', 'CONFIRMED'];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('es-EC', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('es-EC', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function employeeName(appointment) {
  const user = appointment.employee?.user;
  const full = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();
  return full || 'Especialista';
}

export default function Appointments() {
  useRequireAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [actionFor, setActionFor] = useState(null);
  const [actionValue, setActionValue] = useState('');
  const [acting, setActing] = useState(false);
  const [actionError, setActionError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await appointmentsApi.my();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openAction = (id, mode) => {
    setActionFor({ id, mode });
    setActionValue('');
    setActionError(null);
  };

  const submitAction = async () => {
    if (!actionFor) return;
    setActing(true);
    setActionError(null);
    try {
      if (actionFor.mode === 'cancel') {
        await appointmentsApi.cancel(actionFor.id, actionValue.trim() || undefined);
      } else {
        if (!actionValue) {
          setActionError('Elige la nueva fecha y hora.');
          setActing(false);
          return;
        }
        await appointmentsApi.reschedule(actionFor.id, new Date(actionValue).toISOString());
      }
      setActionFor(null);
      setActionValue('');
      await load();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActing(false);
    }
  };

  return (
    <div className="appointments-page">
      <section className="appointments__header">
        <div className="container">
          <h1 className="appointments__title">Mis Citas</h1>
          <p className="appointments__subtitle">Gestiona y revisa tus reservas</p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          {loading && <p className="text-center">Cargando tus citas…</p>}
          {loadError && (
            <p className="text-center" role="alert">
              No se pudieron cargar tus citas: {loadError}
            </p>
          )}
          {!loading && !loadError && appointments.length === 0 && (
            <p className="text-center">Aún no tienes citas reservadas.</p>
          )}
          <div className="appointments__list">
            {appointments.map((apt) => (
              <div key={apt.id} className="appointment-card card">
                <div className="appointment-card__main">
                  <div className="appointment-card__info">
                    <h3 className="appointment-card__service">{apt.service?.name}</h3>
                    <p className="appointment-card__specialist">con {employeeName(apt)}</p>
                  </div>
                  <div className="appointment-card__details">
                    <div className="appointment-card__detail">
                      <span className="appointment-card__label">Fecha</span>
                      <span className="appointment-card__value">{formatDate(apt.startTime)}</span>
                    </div>
                    <div className="appointment-card__detail">
                      <span className="appointment-card__label">Hora</span>
                      <span className="appointment-card__value">{formatTime(apt.startTime)}</span>
                    </div>
                    <div className="appointment-card__detail">
                      <span className="appointment-card__label">Precio</span>
                      <span className="appointment-card__value appointment-card__price">
                        {formatPrice(apt.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="appointment-card__footer">
                  <StatusBadge status={apt.status} />
                  {ACTIONABLE.includes(apt.status) && actionFor?.id !== apt.id && (
                    <div className="appointment-card__actions">
                      <button
                        type="button"
                        className="btn btn--sm btn--secondary"
                        onClick={() => openAction(apt.id, 'reschedule')}
                      >
                        Reprogramar
                      </button>
                      <button
                        type="button"
                        className="btn btn--sm btn--ghost"
                        onClick={() => openAction(apt.id, 'cancel')}
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
                {actionFor?.id === apt.id && (
                  <div className="appointment-card__action-form">
                    {actionFor.mode === 'cancel' ? (
                      <input
                        type="text"
                        className="input"
                        placeholder="Motivo (opcional)"
                        value={actionValue}
                        onChange={(event) => setActionValue(event.target.value)}
                      />
                    ) : (
                      <input
                        type="datetime-local"
                        className="input"
                        value={actionValue}
                        onChange={(event) => setActionValue(event.target.value)}
                      />
                    )}
                    {actionError && (
                      <p className="appointment-card__action-error" role="alert">
                        {actionError}
                      </p>
                    )}
                    <div className="appointment-card__actions">
                      <button
                        type="button"
                        className="btn btn--sm btn--primary"
                        disabled={acting}
                        onClick={submitAction}
                      >
                        {acting
                          ? 'Guardando…'
                          : actionFor.mode === 'cancel'
                            ? 'Confirmar cancelación'
                            : 'Confirmar nuevo horario'}
                      </button>
                      <button
                        type="button"
                        className="btn btn--sm btn--ghost"
                        disabled={acting}
                        onClick={() => setActionFor(null)}
                      >
                        Volver
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
