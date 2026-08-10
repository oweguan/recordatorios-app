import cron from 'node-cron';
import { getDueReminders, markSent, rescheduleRecurring, listReminders } from './db/index.js';
import { sendReminderMessage, sendDailySummaryMessage } from './telegram.js';
import { sendPushToAll } from './push.js';

const RECURRENCE_MS = {
  daily: 24 * 60 * 60 * 1000,
  weekly: 7 * 24 * 60 * 60 * 1000,
  monthly: 30 * 24 * 60 * 60 * 1000,
};

function formatMadridTime(date) {
  return date.toLocaleString('es-ES', {
    timeZone: 'Europe/Madrid',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function isTodayInMadrid(dueAtIso) {
  const fmt = (d) => d.toLocaleDateString('en-CA', { timeZone: 'Europe/Madrid' });
  return fmt(new Date()) === fmt(new Date(dueAtIso));
}

export async function sendDailySummary() {
  const chatId = process.env.OWNER_CHAT_ID;
  if (!chatId) return;

  const all = await listReminders();
  const todayPending = all
    .filter((r) => r.status === 'pending' && isTodayInMadrid(r.due_at))
    .sort((a, b) => new Date(a.due_at) - new Date(b.due_at));

  await sendDailySummaryMessage(chatId, todayPending);
}

export function startScheduler() {
  cron.schedule('* * * * *', async () => {
    const nowIso = new Date().toISOString();
    const due = await getDueReminders(nowIso);

    for (const reminder of due) {
      try {
        const isEarlyNotice = new Date(reminder.notify_at).getTime() < new Date(reminder.due_at).getTime();
        await sendReminderMessage(
          reminder.chat_id,
          reminder.id,
          reminder.task,
          isEarlyNotice ? new Date(reminder.due_at) : null,
          reminder.recurrence
        );
        const pushBody = isEarlyNotice
          ? `${reminder.task} (hoy a las ${formatMadridTime(new Date(reminder.due_at))})`
          : reminder.task;
        await sendPushToAll({ title: 'Recordatorio', body: pushBody });

        console.log(`Enviado recordatorio #${reminder.id}: ${reminder.task}`);

        if (reminder.recurrence && RECURRENCE_MS[reminder.recurrence]) {
          const delta = RECURRENCE_MS[reminder.recurrence];
          const nextDue = new Date(new Date(reminder.due_at).getTime() + delta);
          const nextNotify = new Date(new Date(reminder.notify_at).getTime() + delta);
          await rescheduleRecurring(reminder.id, nextDue.toISOString(), nextNotify.toISOString());
        } else {
          await markSent(reminder.id);
        }
      } catch (err) {
        console.error(`Error enviando recordatorio #${reminder.id}:`, err.message);
      }
    }
  });

  cron.schedule(
    '0 9 * * *',
    () => {
      sendDailySummary().catch((err) => console.error('Error enviando resumen diario:', err.message));
    },
    { timezone: 'Europe/Madrid' }
  );

  console.log('Scheduler activo: revisando recordatorios cada minuto y resumen diario a las 9:00 (Madrid).');
}
