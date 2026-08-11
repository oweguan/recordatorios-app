import { getReminderById, setReminderStatus, rescheduleRecurring } from './db/index.js';
import { syncCreateToCalendar, syncUpdateToCalendar, syncDeleteFromCalendar } from './calendarSync.js';

const RECURRENCE_MS = {
  daily: 24 * 60 * 60 * 1000,
  weekly: 7 * 24 * 60 * 60 * 1000,
  monthly: 30 * 24 * 60 * 60 * 1000,
};

// Completa una tarea de forma no destructiva: pasa a status "done" (visible en Explorar >
// Completadas, recuperable) en vez de borrarla. Las tareas recurrentes no se "completan": se
// reprograman a la siguiente ocurrencia, igual que si el aviso se hubiera disparado solo.
export async function completeReminder(id) {
  const existing = await getReminderById(id);
  if (!existing) return null;

  if (existing.recurrence && RECURRENCE_MS[existing.recurrence] && existing.due_at) {
    const delta = RECURRENCE_MS[existing.recurrence];
    const nextDue = new Date(new Date(existing.due_at).getTime() + delta);
    const nextNotify = new Date(new Date(existing.notify_at ?? existing.due_at).getTime() + delta);
    await rescheduleRecurring(id, nextDue.toISOString(), nextNotify.toISOString());
    const updated = await getReminderById(id);
    syncUpdateToCalendar(updated);
    return updated;
  }

  const updated = await setReminderStatus(id, 'done');
  syncDeleteFromCalendar(existing);
  return updated;
}

// Deshace una tarea completada: vuelve a "pending" y recrea el evento de Calendar si tenia fecha.
export async function uncompleteReminder(id) {
  const existing = await getReminderById(id);
  if (!existing) return null;

  const updated = await setReminderStatus(id, 'pending');
  if (updated.due_at) syncCreateToCalendar(updated);
  return updated;
}
