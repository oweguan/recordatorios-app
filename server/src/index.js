import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { init, createReminder, listReminders } from './db/index.js';
import { parseReminderText } from './parser.js';
import { startScheduler } from './scheduler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.join(__dirname, '..', '..', 'client');

const app = express();
app.use(express.json());
app.use(express.static(clientDir));

app.get('/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.post('/api/reminders', async (req, res) => {
  const { text } = req.body;
  const chatId = req.body.chatId || process.env.OWNER_CHAT_ID;

  if (!text || !chatId) {
    return res.status(400).json({ error: 'Faltan campos: text es obligatorio y no hay OWNER_CHAT_ID configurado' });
  }

  const { task, dueAt, matchedText } = parseReminderText(text);

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
    recurrence: req.body.recurrence ?? null,
    chatId,
  });

  res.status(201).json({ reminder, interpretedAs: matchedText });
});

app.get('/api/reminders', async (req, res) => {
  res.json(await listReminders());
});

const PORT = process.env.PORT || 3001;
await init();
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  startScheduler();
});
