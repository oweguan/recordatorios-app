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
} from './db/index.js';
import { parseReminderText } from './parser.js';
import { parseWithLLM } from './llmParser.js';
import { startScheduler } from './scheduler.js';
import { isPushEnabled } from './push.js';

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
  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
await init();
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  startScheduler();
});
