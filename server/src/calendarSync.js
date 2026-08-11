import { listReminders, updateReminderGoogleEventId, getGoogleAuth } from './db/index.js';
import { isGoogleConnected, createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from './google.js';

// La sincronizacion con Calendar es una funcion independiente de Drive: si el usuario la
// desactiva, no se crean ni actualizan eventos nuevos (pero borrar los ya existentes al
// eliminar/completar una tarea sigue funcionando, para no dejar basura huerfana).
export async function isCalendarSyncEnabled() {
  if (!(await isGoogleConnected())) return false;
  const auth = await getGoogleAuth();
  return auth?.calendar_enabled !== false;
}

export async function syncCreateToCalendar(reminder) {
  try {
    if (!(await isCalendarSyncEnabled())) return;
    const eventId = await createCalendarEvent(reminder);
    await updateReminderGoogleEventId(reminder.id, eventId);
  } catch (err) {
    console.warn('No se pudo sincronizar con Calendar:', err.message);
  }
}

export async function syncUpdateToCalendar(reminder) {
  try {
    if (!reminder.google_event_id) return;
    if (!(await isCalendarSyncEnabled())) return;
    await updateCalendarEvent(reminder.google_event_id, reminder);
  } catch (err) {
    console.warn('No se pudo actualizar el evento de Calendar:', err.message);
  }
}

export async function syncDeleteFromCalendar(reminder) {
  try {
    if (!reminder.google_event_id) return;
    await deleteCalendarEvent(reminder.google_event_id);
  } catch (err) {
    console.warn('No se pudo eliminar el evento de Calendar:', err.message);
  }
}

// Sincroniza todas las tareas activas (pendientes o avisadas-pero-no-completadas), no solo las
// estrictamente "pending", para que una tarea vencida-pero-no-hecha tambien tenga su evento.
export async function syncAllPendingToCalendar() {
  const all = await listReminders();
  const active = all.filter((r) => r.status !== 'done' && r.due_at);

  let synced = 0;
  for (const reminder of active) {
    try {
      if (reminder.google_event_id) {
        // recrea el evento para asegurarse de que vive en el calendario "Tareas"
        await deleteCalendarEvent(reminder.google_event_id);
      }
      const eventId = await createCalendarEvent(reminder);
      await updateReminderGoogleEventId(reminder.id, eventId);
      synced++;
    } catch (err) {
      console.warn(`No se pudo sincronizar el recordatorio #${reminder.id}:`, err.message);
    }
  }
  return synced;
}
