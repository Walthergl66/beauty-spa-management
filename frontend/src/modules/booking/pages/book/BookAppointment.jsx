import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { servicesApi, employeesApi, availabilityApi, appointmentsApi } from '@/services/index.js';
import { useRequireAuth } from '@/modules/auth/index.js';
import { formatPrice } from '@/modules/catalog/index.js';
import { ROUTES } from '@/routes/index.js';
import './BookAppointment.css';

function todayYmd() {
  return new Date().toISOString().slice(0, 10);
}

function employeeDisplayName(employee) {
  const user = employee?.user;
  const full = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();
  return full || 'Especialista';
}

function employeeInitials(employee) {
  const user = employee?.user;
  return `${user?.firstName?.charAt(0) ?? ''}${user?.lastName?.charAt(0) ?? ''}` || 'SF';
}

export default function BookAppointment() {
  useRequireAuth();
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get('service');

  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(preselectedService ?? '');
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [date, setDate] = useState(todayYmd());
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [created, setCreated] = useState(null);

  useEffect(() => {
    let cancelled = false;
    servicesApi
      .listActive()
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : [];
        setServices(list);
        if (preselectedService && !list.some((service) => service.id === preselectedService)) {
          setSelectedServiceId('');
        }
      })
      .catch((err) => {
        if (!cancelled) setFormError(`No se pudieron cargar los servicios: ${err.message}`);
      });
    return () => {
      cancelled = true;
    };
  }, [preselectedService]);

  useEffect(() => {
    if (!selectedServiceId) {
      setEmployees([]);
      setSelectedEmployeeId('');
      return;
    }
    let cancelled = false;
    employeesApi
      .listByService(selectedServiceId)
      .then((data) => {
        if (cancelled) return;
        const list = (Array.isArray(data) ? data : []).filter((employee) => employee.isActive !== false);
        setEmployees(list);
        setSelectedEmployeeId((prev) => (list.some((employee) => employee.id === prev) ? prev : ''));
      })
      .catch((err) => {
        if (!cancelled) setFormError(`No se pudieron cargar los especialistas: ${err.message}`);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedServiceId]);

  useEffect(() => {
    setSelectedSlot(null);
    if (!selectedServiceId || !date) {
      setSlots([]);
      return;
    }
    let cancelled = false;
    setSlotsLoading(true);
    availabilityApi
      .getSlots({ serviceId: selectedServiceId, date, employeeId: selectedEmployeeId || undefined })
      .then((data) => {
        if (!cancelled) setSlots(data?.availableSlots ?? []);
      })
      .catch((err) => {
        if (!cancelled) {
          setSlots([]);
          setFormError(`No se pudo consultar disponibilidad: ${err.message}`);
        }
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedServiceId, selectedEmployeeId, date]);

  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId),
    [services, selectedServiceId],
  );
  const selectedEmployee = useMemo(
    () => employees.find((employee) => employee.id === selectedEmployeeId),
    [employees, selectedEmployeeId],
  );

  const handleConfirm = async () => {
    setFormError(null);
    if (!selectedServiceId || !selectedSlot) return;
    setSubmitting(true);
    try {
      const appointment = await appointmentsApi.create({
        serviceId: selectedServiceId,
        employeeId: selectedSlot.employeeId,
        startTime: selectedSlot.startTime,
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      });
      setCreated(appointment);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const step = !selectedServiceId ? 1 : !selectedEmployeeId && employees.length > 0 ? 2 : !selectedSlot ? 3 : 4;

  return (
    <div className="book-page">
      <section className="book__header">
        <div className="container">
          <h1 className="book__title">Reservar Cita</h1>
          <p className="book__subtitle">Completa los pasos para agendar tu cita</p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="book__steps">
            <div className={`book__step ${step >= 1 ? 'book__step--active' : ''}`}>
              <span className="book__step-number">1</span>
              <span className="book__step-label">Servicio</span>
            </div>
            <div className="book__step-line"></div>
            <div className={`book__step ${step >= 2 ? 'book__step--active' : ''}`}>
              <span className="book__step-number">2</span>
              <span className="book__step-label">Especialista</span>
            </div>
            <div className="book__step-line"></div>
            <div className={`book__step ${step >= 3 ? 'book__step--active' : ''}`}>
              <span className="book__step-number">3</span>
              <span className="book__step-label">Fecha y Hora</span>
            </div>
            <div className="book__step-line"></div>
            <div className={`book__step ${step >= 4 ? 'book__step--active' : ''}`}>
              <span className="book__step-number">4</span>
              <span className="book__step-label">Confirmar</span>
            </div>
          </div>

          {formError && (
            <p className="book__form-error" role="alert">
              {formError}
            </p>
          )}
          {created && (
            <div className="book__form-success" role="status">
              ¡Reserva creada para el {new Date(created.startTime).toLocaleString('es-EC')}!{' '}
              <Link to={ROUTES.appointments}>Ver mis citas</Link>
            </div>
          )}

          <div className="book__content">
            <div className="book__main">
              <div className="card">
                <h2 className="book__section-title">Selecciona un Servicio</h2>
                <div className="book__services">
                  {services.map((service) => (
                    <label key={service.id} className="book__service">
                      <input
                        type="radio"
                        name="service"
                        className="book__service-radio"
                        checked={selectedServiceId === service.id}
                        onChange={() => setSelectedServiceId(service.id)}
                      />
                      <div className="book__service-info">
                        <span className="book__service-name">{service.name}</span>
                        <span className="book__service-meta">
                          {service.durationMinutes} min · {formatPrice(service.price)}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="card mt-xl">
                <h2 className="book__section-title">Selecciona un Especialista</h2>
                {!selectedServiceId ? (
                  <p className="book__empty">Primero elige un servicio.</p>
                ) : employees.length === 0 ? (
                  <p className="book__empty">No hay especialistas disponibles para este servicio.</p>
                ) : (
                  <div className="book__specialists">
                    {employees.map((employee) => (
                      <label key={employee.id} className="book__specialist">
                        <input
                          type="radio"
                          name="specialist"
                          className="book__specialist-radio"
                          checked={selectedEmployeeId === employee.id}
                          onChange={() => setSelectedEmployeeId(employee.id)}
                        />
                        <div className="book__specialist-avatar">{employeeInitials(employee)}</div>
                        <div className="book__specialist-info">
                          <span className="book__specialist-name">{employeeDisplayName(employee)}</span>
                          <span className="book__specialist-specialty">{employee.specialty}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="card mt-xl">
                <h2 className="book__section-title">Selecciona Fecha y Hora</h2>
                <div className="book__datetime">
                  <div className="book__date">
                    <label className="book__label">Fecha</label>
                    <input
                      type="date"
                      className="input"
                      value={date}
                      min={todayYmd()}
                      onChange={(event) => setDate(event.target.value)}
                    />
                  </div>
                  <div className="book__time">
                    <label className="book__label">Hora</label>
                    {slotsLoading ? (
                      <p className="book__empty">Buscando horarios libres…</p>
                    ) : !selectedServiceId ? (
                      <p className="book__empty">Elige un servicio para ver horarios.</p>
                    ) : slots.length === 0 ? (
                      <p className="book__empty">Sin horarios libres en esta fecha.</p>
                    ) : (
                      <div className="book__slots">
                        {slots.map((slot) => (
                          <button
                            key={`${slot.employeeId}-${slot.startTime}`}
                            type="button"
                            className={`book__slot ${selectedSlot?.startTime === slot.startTime && selectedSlot?.employeeId === slot.employeeId ? 'book__slot--selected' : ''}`}
                            onClick={() => setSelectedSlot(slot)}
                            title={slot.employeeName}
                          >
                            {slot.startTimeFormatted}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="book__date mt-lg">
                  <label className="book__label">Notas (opcional)</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Preferencias o indicaciones especiales"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                  />
                </div>
              </div>
            </div>

            <aside className="book__sidebar">
              <div className="card book__summary">
                <h3 className="book__summary-title">Resumen</h3>
                <div className="book__summary-row">
                  <span>Servicio</span>
                  <span className="book__summary-value">{selectedService?.name ?? 'Por seleccionar'}</span>
                </div>
                <div className="book__summary-row">
                  <span>Especialista</span>
                  <span className="book__summary-value">
                    {selectedSlot?.employeeName
                      ?? (selectedEmployee ? employeeDisplayName(selectedEmployee) : 'Por seleccionar')}
                  </span>
                </div>
                <div className="book__summary-row">
                  <span>Fecha</span>
                  <span className="book__summary-value">
                    {selectedSlot ? new Date(selectedSlot.startTime).toLocaleDateString('es-EC') : 'Por seleccionar'}
                  </span>
                </div>
                <div className="book__summary-row">
                  <span>Hora</span>
                  <span className="book__summary-value">{selectedSlot?.startTimeFormatted ?? 'Por seleccionar'}</span>
                </div>
                <hr className="book__summary-divider" />
                <div className="book__summary-row">
                  <strong>Total</strong>
                  <strong className="book__summary-total">
                    {selectedService ? formatPrice(selectedService.price) : '—'}
                  </strong>
                </div>
                <button
                  type="button"
                  className="btn btn--primary btn--block"
                  disabled={!selectedServiceId || !selectedSlot || submitting}
                  onClick={handleConfirm}
                >
                  {submitting ? 'Reservando…' : 'Confirmar Reserva'}
                </button>
                <p className="book__note">
                  * Todos los campos son obligatorios
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
