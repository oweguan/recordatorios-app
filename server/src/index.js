import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import multer from 'multer';
import { transcribeAudio } from './transcribe.js';
import {
  init,
  createReminder,
  listReminders,
  getReminderById,
  updateReminder,
  deleteReminder,
  savePushSubscription,
  deletePushSubscription,
  updateReminderGoogleEventId,
} from './db/index.js';
import { parseReminderText } from './parser.js';
import { parseWithLLM } from './llmParser.js';
import { startScheduler } from './scheduler.js';
import { isPushEnabled } from './push.js';
import {
  isGoogleConfigured,
  getAuthUrl,
  handleOAuthCallback,
  isGoogleConnected,
  disconnectGoogle,
  backupToDrive,
  listDriveBackups,
  downloadDriveBackup,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from './google.js';

async function syncCreateToCalendar(reminder) {
  try {
    if (!(await isGoogleConnected())) return;
    const eventId = await createCalendarEvent(reminder);
    await updateReminderGoogleEventId(reminder.id, eventId);
  } catch (err) {
    console.warn('No se pudo sincronizar con Calendar:', err.message);
  }
}

async function syncUpdateToCalendar(reminder) {
  try {
    if (!reminder.google_event_id) return;
    await updateCalendarEvent(reminder.google_event_id, reminder);
  } catch (err) {
    console.warn('No se pudo actualizar el evento de Calendar:', err.message);
  }
}

async function syncDeleteFromCalendar(reminder) {
  try {
    if (!reminder.google_event_id) return;
    await deleteCalendarEvent(reminder.google_event_id);
  } catch (err) {
    console.warn('No se pudo eliminar el evento de Calendar:', err.message);
  }
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.join(__dirname, '..', '..', 'client');

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

app.use(express.json());
app.use(express.static(clientDir));

app.get('/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Falta el archivo de audio' });
  }
  try {
    const text = await transcribeAudio(req.file.buffer, 'audio.webm', req.file.mimetype);
    res.json({ text });
  } catch (err) {
    console.error('Error transcribiendo audio:', err.message);
    res.status(502).json({ error: 'No se pudo transcribir el audio' });
  }
});

app.post('/api/reminders', async (req, res) => {
  const { text } = req.body;
  const chatId = req.body.chatId || process.env.OWNER_CHAT_ID;

  if (!text || !chatId) {
    return res.status(400).json({ error: 'Faltan campos: text es obligatorio y no hay OWNER_CHAT_ID configurado' });
  }

  let parsed = null;
  let usedLLM = false;

  if (process.env.GROQ_API_KEY) {
    try {
      parsed = await parseWithLLM(text);
      usedLLM = true;
    } catch (err) {
      console.warn('Groq no disponible, usando parser de reglas:', err.message);
    }
  }

  if (!parsed || !parsed.dueAt) {
    parsed = parseReminderText(text);
    usedLLM = false;
  }

  const { task, dueAt, notifyAt, leadMinutes, recurrence, matchedText } = parsed;

  if (!dueAt) {
    return res.status(422).json({
      error: 'No se pudo entender ninguna fecha/hora en el texto',
      task,
    });
  }

  const reminder = await createReminder({
    originalText: text,
    task,
    dueAt: dueAt.toISOString(),
    notifyAt: notifyAt.toISOString(),
    recurrence: req.body.recurrence ?? recurrence,
    chatId,
  });

  syncCreateToCalendar(reminder);

  res.status(201).json({ reminder, interpretedAs: matchedText, leadMinutes, usedLLM });
});

app.get('/api/reminders', async (req, res) => {
  res.json(await listReminders());
});

app.patch('/api/reminders/:id', async (req, res) => {
  const id = Number(req.params.id);
  const existing = await getReminderById(id);

  if (!existing) {
    return res.status(404).json({ error: 'Recordatorio no encontrado' });
  }

  const leadDeltaMs = new Date(existing.due_at).getTime() - new Date(existing.notify_at).getTime();

  const task = typeof req.body.task === 'string' && req.body.task.trim() ? req.body.task.trim() : existing.task;
  let dueAt = existing.due_at;
  let notifyAt = existing.notify_at;

  if (req.body.dueAt) {
    const newDueAt = new Date(req.body.dueAt);
    if (Number.isNaN(newDueAt.getTime())) {
      return res.status(400).json({ error: 'Fecha no válida' });
    }
    dueAt = newDueAt.toISOString();
    notifyAt = new Date(newDueAt.getTime() - leadDeltaMs).toISOString();
  }

  const updated = await updateReminder(id, { task, dueAt, notifyAt });
  syncUpdateToCalendar(updated);
  res.json(updated);
});

app.post('/api/reminders/:id/postpone', async (req, res) => {
  const id = Number(req.params.id);
  const minutes = Number(req.body.minutes);

  if (!minutes) {
    return res.status(400).json({ error: 'minutes es obligatorio' });
  }

  const existing = await getReminderById(id);
  if (!existing) {
    return res.status(404).json({ error: 'Recordatorio no encontrado' });
  }

  const deltaMs = minutes * 60000;
  const dueAt = new Date(new Date(existing.due_at).getTime() + deltaMs).toISOString();
  const notifyAt = new Date(new Date(existing.notify_at).getTime() + deltaMs).toISOString();

  const updated = await updateReminder(id, { task: existing.task, dueAt, notifyAt });
  syncUpdateToCalendar(updated);
  res.json(updated);
});

app.get('/api/push/vapid-public-key', (req, res) => {
  if (!isPushEnabled()) {
    return res.status(404).json({ error: 'Push no configurado en el servidor' });
  }
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

app.post('/api/push/subscribe', async (req, res) => {
  const { endpoint, keys } = req.body;
  if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
    return res.status(400).json({ error: 'Suscripción inválida' });
  }
  await savePushSubscription({ endpoint, p256dh: keys.p256dh, auth: keys.auth });
  res.status(201).json({ ok: true });
});

app.post('/api/push/unsubscribe', async (req, res) => {
  const { endpoint } = req.body;
  if (!endpoint) {
    return res.status(400).json({ error: 'endpoint es obligatorio' });
  }
  await deletePushSubscription(endpoint);
  res.status(204).end();
});

app.delete('/api/reminders/:id', async (req, res) => {
  const id = Number(req.params.id);
  const existing = await getReminderById(id);

  if (!existing) {
    return res.status(404).json({ error: 'Recordatorio no encontrado' });
  }

  await deleteReminder(id);
  syncDeleteFromCalendar(existing);
  res.status(204).end();
});

app.get('/api/google/status', async (req, res) => {
  res.json({ configured: isGoogleConfigured(), connected: isGoogleConfigured() && (await isGoogleConnected()) });
});

app.get('/api/google/auth', (req, res) => {
  if (!isGoogleConfigured()) {
    return res.status(404).send('Google no está configurado en el servidor');
  }
  res.redirect(getAuthUrl());
});

app.get('/api/google/callback', async (req, res) => {
  try {
    await handleOAuthCallback(req.query.code);
    res.redirect('/?google=connected');
  } catch (err) {
    console.error('Error en callback de Google:', err.message);
    res.redirect('/?google=error');
  }
});

app.post('/api/google/disconnect', async (req, res) => {
  await disconnectGoogle();
  res.status(204).end();
});

app.post('/api/google/backup', async (req, res) => {
  try {
    const file = await backupToDrive();
    res.status(201).json(file);
  } catch (err) {
    console.error('Error en backup a Drive:', err.message);
    res.status(502).json({ error: 'No se pudo hacer la copia de seguridad' });
  }
});

app.get('/api/google/backups', async (req, res) => {
  try {
    res.json(await listDriveBackups());
  } catch (err) {
    console.error('Error listando backups:', err.message);
    res.status(502).json({ error: 'No se pudieron listar las copias de seguridad' });
  }
});

app.post('/api/google/restore/:fileId', async (req, res) => {
  try {
    const backupReminders = await downloadDriveBackup(req.params.fileId);
    let restored = 0;
    for (const r of backupReminders) {
      if (r.status !== 'pending') continue;
      await createReminder({
        originalText: r.original_text,
        task: r.task,
        dueAt: r.due_at,
        notifyAt: r.notify_at,
        recurrence: r.recurrence,
        chatId: r.chat_id,
      });
      restored++;
    }
    res.json({ restored });
  } catch (err) {
    console.error('Error restaurando backup:', err.message);
    res.status(502).json({ error: 'No se pudo restaurar la copia de seguridad' });
  }
});

const PORT = process.env.PORT || 3001;
await init();
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  startScheduler();
});
