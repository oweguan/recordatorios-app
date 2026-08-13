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
  reorderReminders,
  deleteReminder,
  getGoogleAuth,
  setGoogleFeatureEnabled,
  savePushSubscription,
  deletePushSubscription,
  listProjects,
  getProjectById,
  findOrCreateProjectByName,
  createProject,
  updateProject,
  deleteProject,
  createSubtask,
  getSubtaskById,
  updateSubtask,
  deleteSubtask,
  listSectionsByProject,
  listSections,
  getSectionById,
  createSection,
  updateSection,
  reorderSections,
  deleteSection,
  listFilters,
  getFilterById,
  createFilter,
  updateFilter,
  deleteFilter,
} from './db/index.js';
import { parseReminderText, extractPriority, extractLabels, extractProject } from './parser.js';
import { parseWithLLM } from './llmParser.js';
import { startScheduler, sendDailySummary } from './scheduler.js';
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
} from './google.js';
import { syncCreateToCalendar, syncUpdateToCalendar, syncDeleteFromCalendar, syncAllPendingToCalendar } from './calendarSync.js';
import { completeReminder, uncompleteReminder } from './reminderActions.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.join(__dirname, '..', '..', 'client');

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

app.use(express.json());
app.use(express.static(clientDir));

app.get('/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.post('/api/daily-summary/send-now', async (req, res) => {
  try {
    await sendDailySummary();
    res.json({ ok: true });
  } catch (err) {
    console.error('Error enviando resumen diario:', err.message);
    res.status(502).json({ error: 'No se pudo enviar el resumen' });
  }
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

  const { priority, text: withoutPriority } = extractPriority(text);
  const { labels, text: withoutLabels } = extractLabels(withoutPriority);
  const { project: projectName, text: withoutProject } = extractProject(withoutLabels);

  // Si se pasa projectId explicito (p.ej. anadiendo una tarea desde la vista de un proyecto),
  // tiene prioridad sobre el #proyecto detectado en el texto.
  let projectId = null;
  if (req.body.projectId) {
    projectId = Number(req.body.projectId);
  } else if (projectName) {
    const project = await findOrCreateProjectByName(projectName);
    projectId = project.id;
  }

  let parsed = null;
  let usedLLM = false;

  if (process.env.GROQ_API_KEY) {
    try {
      parsed = await parseWithLLM(withoutProject);
      usedLLM = true;
    } catch (err) {
      console.warn('Groq no disponible, usando parser de reglas:', err.message);
    }
  }

  if (!parsed || !parsed.dueAt) {
    parsed = parseReminderText(withoutProject);
    usedLLM = false;
  }

  const { task, dueAt, notifyAt, leadMinutes, recurrence, matchedText } = parsed;

  // Sin fecha detectada: se guarda igualmente en la Bandeja de entrada, sin aviso programado.
  const reminder = await createReminder({
    originalText: text,
    task: task || withoutProject || text,
    dueAt: dueAt ? dueAt.toISOString() : null,
    notifyAt: dueAt ? notifyAt.toISOString() : null,
    recurrence: req.body.recurrence ?? recurrence,
    chatId,
    priority,
    labels,
    projectId,
    sectionId: req.body.sectionId ? Number(req.body.sectionId) : null,
  });

  if (dueAt) {
    syncCreateToCalendar(reminder);
  }

  res.status(201).json({ reminder, interpretedAs: matchedText, leadMinutes, usedLLM, inbox: !dueAt });
});

app.get('/api/reminders', async (req, res) => {
  res.json(await listReminders());
});

// Reordena manualmente (arrastrar y soltar): ids en el orden final deseado.
app.post('/api/reminders/reorder', async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.some((id) => !Number.isInteger(id))) {
    return res.status(400).json({ error: 'ids debe ser un array de numeros enteros' });
  }
  await reorderReminders(ids);
  res.status(204).end();
});

app.patch('/api/reminders/:id', async (req, res) => {
  const id = Number(req.params.id);
  const existing = await getReminderById(id);

  if (!existing) {
    return res.status(404).json({ error: 'Recordatorio no encontrado' });
  }

  const task = typeof req.body.task === 'string' && req.body.task.trim() ? req.body.task.trim() : existing.task;
  let dueAt = existing.due_at;
  let notifyAt = existing.notify_at;

  let priority = existing.priority ?? 4;
  if (Object.prototype.hasOwnProperty.call(req.body, 'priority')) {
    const p = Number(req.body.priority);
    if (p >= 1 && p <= 4) priority = p;
  }

  let labels = existing.labels ?? [];
  if (Object.prototype.hasOwnProperty.call(req.body, 'labels') && Array.isArray(req.body.labels)) {
    labels = req.body.labels.map((l) => String(l).toLowerCase().trim()).filter(Boolean);
  }

  let projectId = existing.project_id ?? null;
  if (Object.prototype.hasOwnProperty.call(req.body, 'projectId')) {
    projectId = req.body.projectId === null ? null : Number(req.body.projectId);
  }

  // Si cambia de proyecto sin especificar seccion, la seccion anterior (de otro proyecto) deja de aplicar.
  let sectionId = projectId === existing.project_id ? existing.section_id ?? null : null;
  if (Object.prototype.hasOwnProperty.call(req.body, 'sectionId')) {
    sectionId = req.body.sectionId === null ? null : Number(req.body.sectionId);
  }

  let description = existing.description ?? null;
  if (Object.prototype.hasOwnProperty.call(req.body, 'description')) {
    description = typeof req.body.description === 'string' ? req.body.description.trim() || null : null;
  }

  if (Object.prototype.hasOwnProperty.call(req.body, 'dueAt')) {
    if (req.body.dueAt === null) {
      dueAt = null;
      notifyAt = null;
    } else {
      const newDueAt = new Date(req.body.dueAt);
      if (Number.isNaN(newDueAt.getTime())) {
        return res.status(400).json({ error: 'Fecha no válida' });
      }
      const leadDeltaMs =
        existing.due_at && existing.notify_at
          ? new Date(existing.due_at).getTime() - new Date(existing.notify_at).getTime()
          : 0;
      dueAt = newDueAt.toISOString();
      notifyAt = new Date(newDueAt.getTime() - leadDeltaMs).toISOString();
    }
  }

  const updated = await updateReminder(id, { task, dueAt, notifyAt, priority, labels, projectId, description, sectionId });
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
  if (!existing.due_at) {
    return res.status(400).json({ error: 'Este recordatorio no tiene fecha, asígnale una primero' });
  }

  const deltaMs = minutes * 60000;
  const dueAt = new Date(new Date(existing.due_at).getTime() + deltaMs).toISOString();
  const notifyAt = new Date(new Date(existing.notify_at).getTime() + deltaMs).toISOString();

  const updated = await updateReminder(id, {
    task: existing.task,
    dueAt,
    notifyAt,
    priority: existing.priority,
    labels: existing.labels,
    projectId: existing.project_id,
    description: existing.description,
    sectionId: existing.section_id,
  });
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

// Completar una tarea es no destructivo (status "done", recuperable desde Explorar). Si es
// recurrente, se reprograma a la siguiente ocurrencia en vez de "completarse" para siempre.
app.post('/api/reminders/:id/complete', async (req, res) => {
  const updated = await completeReminder(Number(req.params.id));
  if (!updated) return res.status(404).json({ error: 'Recordatorio no encontrado' });
  res.json(updated);
});

app.post('/api/reminders/:id/uncomplete', async (req, res) => {
  const updated = await uncompleteReminder(Number(req.params.id));
  if (!updated) return res.status(404).json({ error: 'Recordatorio no encontrado' });
  res.json(updated);
});

app.get('/api/projects', async (req, res) => {
  res.json(await listProjects());
});

app.post('/api/projects', async (req, res) => {
  const name = (req.body.name || '').trim();
  if (!name) return res.status(400).json({ error: 'name es obligatorio' });
  res.status(201).json(await createProject({ name }));
});

app.patch('/api/projects/:id', async (req, res) => {
  const id = Number(req.params.id);
  const existing = await getProjectById(id);
  if (!existing) return res.status(404).json({ error: 'Proyecto no encontrado' });

  const name = typeof req.body.name === 'string' && req.body.name.trim() ? req.body.name.trim() : existing.name;
  const color = typeof req.body.color === 'string' && req.body.color.trim() ? req.body.color.trim() : existing.color;
  const isFavorite = Object.prototype.hasOwnProperty.call(req.body, 'isFavorite')
    ? Boolean(req.body.isFavorite)
    : existing.is_favorite;
  res.json(await updateProject(id, { name, color, isFavorite }));
});

app.delete('/api/projects/:id', async (req, res) => {
  const existing = await getProjectById(Number(req.params.id));
  if (!existing) return res.status(404).json({ error: 'Proyecto no encontrado' });
  await deleteProject(existing.id);
  res.status(204).end();
});

app.post('/api/reminders/:id/subtasks', async (req, res) => {
  const reminderId = Number(req.params.id);
  const existing = await getReminderById(reminderId);
  if (!existing) return res.status(404).json({ error: 'Recordatorio no encontrado' });

  const text = (req.body.text || '').trim();
  if (!text) return res.status(400).json({ error: 'text es obligatorio' });
  res.status(201).json(await createSubtask(reminderId, text));
});

app.patch('/api/subtasks/:id', async (req, res) => {
  const id = Number(req.params.id);
  const existing = await getSubtaskById(id);
  if (!existing) return res.status(404).json({ error: 'Subtarea no encontrada' });

  const text = typeof req.body.text === 'string' && req.body.text.trim() ? req.body.text.trim() : existing.text;
  const done = typeof req.body.done === 'boolean' ? req.body.done : existing.done;
  res.json(await updateSubtask(id, { text, done }));
});

app.delete('/api/subtasks/:id', async (req, res) => {
  const existing = await getSubtaskById(Number(req.params.id));
  if (!existing) return res.status(404).json({ error: 'Subtarea no encontrada' });
  await deleteSubtask(existing.id);
  res.status(204).end();
});

app.get('/api/sections', async (req, res) => {
  if (req.query.projectId) {
    return res.json(await listSectionsByProject(Number(req.query.projectId)));
  }
  res.json(await listSections());
});

app.post('/api/sections', async (req, res) => {
  const projectId = Number(req.body.projectId);
  const name = (req.body.name || '').trim();
  if (!projectId || !name) return res.status(400).json({ error: 'projectId y name son obligatorios' });
  const project = await getProjectById(projectId);
  if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });
  res.status(201).json(await createSection(projectId, name));
});

// Reordena las secciones de un proyecto (arrastrar y soltar).
app.post('/api/sections/reorder', async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.some((id) => !Number.isInteger(id))) {
    return res.status(400).json({ error: 'ids debe ser un array de numeros enteros' });
  }
  await reorderSections(ids);
  res.status(204).end();
});

app.patch('/api/sections/:id', async (req, res) => {
  const id = Number(req.params.id);
  const existing = await getSectionById(id);
  if (!existing) return res.status(404).json({ error: 'Sección no encontrada' });
  const name = typeof req.body.name === 'string' && req.body.name.trim() ? req.body.name.trim() : existing.name;
  res.json(await updateSection(id, name));
});

app.delete('/api/sections/:id', async (req, res) => {
  const existing = await getSectionById(Number(req.params.id));
  if (!existing) return res.status(404).json({ error: 'Sección no encontrada' });
  await deleteSection(existing.id);
  res.status(204).end();
});

app.get('/api/filters', async (req, res) => {
  res.json(await listFilters());
});

app.post('/api/filters', async (req, res) => {
  const name = (req.body.name || '').trim();
  const criteria = req.body.criteria;
  if (!name || typeof criteria !== 'object' || criteria === null) {
    return res.status(400).json({ error: 'name y criteria son obligatorios' });
  }
  res.status(201).json(await createFilter(name, criteria));
});

app.patch('/api/filters/:id', async (req, res) => {
  const id = Number(req.params.id);
  const existing = await getFilterById(id);
  if (!existing) return res.status(404).json({ error: 'Filtro no encontrado' });
  const name = typeof req.body.name === 'string' && req.body.name.trim() ? req.body.name.trim() : existing.name;
  const criteria = typeof req.body.criteria === 'object' && req.body.criteria !== null ? req.body.criteria : existing.criteria;
  res.json(await updateFilter(id, name, criteria));
});

app.delete('/api/filters/:id', async (req, res) => {
  const existing = await getFilterById(Number(req.params.id));
  if (!existing) return res.status(404).json({ error: 'Filtro no encontrado' });
  await deleteFilter(existing.id);
  res.status(204).end();
});

app.get('/api/google/status', async (req, res) => {
  const configured = isGoogleConfigured();
  const connected = configured && (await isGoogleConnected());
  let calendarEnabled = true;
  let driveEnabled = true;
  if (connected) {
    const auth = await getGoogleAuth();
    calendarEnabled = auth?.calendar_enabled !== false;
    driveEnabled = auth?.drive_enabled !== false;
  }
  res.json({ configured, connected, calendarEnabled, driveEnabled });
});

// Activa/desactiva Calendar o Drive por separado sin desconectar la cuenta de Google entera.
app.post('/api/google/toggle', async (req, res) => {
  const { feature, enabled } = req.body;
  if (!['calendar', 'drive'].includes(feature) || typeof enabled !== 'boolean') {
    return res.status(400).json({ error: 'feature debe ser "calendar" o "drive", enabled debe ser booleano' });
  }
  const updated = await setGoogleFeatureEnabled(feature, enabled);
  res.json({ calendarEnabled: updated?.calendar_enabled !== false, driveEnabled: updated?.drive_enabled !== false });
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
    syncAllPendingToCalendar().catch((err) =>
      console.warn('Error sincronizando recordatorios existentes con Calendar:', err.message)
    );
    res.redirect('/?google=connected');
  } catch (err) {
    console.error('Error en callback de Google:', err.message);
    res.redirect('/?google=error');
  }
});

app.post('/api/google/sync-calendar', async (req, res) => {
  try {
    const synced = await syncAllPendingToCalendar();
    res.json({ synced });
  } catch (err) {
    console.error('Error sincronizando con Calendar:', err.message);
    res.status(502).json({ error: 'No se pudo sincronizar con Calendar' });
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
      if (r.status === 'done') continue;
      await createReminder({
        originalText: r.original_text,
        task: r.task,
        dueAt: r.due_at,
        notifyAt: r.notify_at,
        recurrence: r.recurrence,
        chatId: r.chat_id,
        priority: r.priority,
        labels: r.labels,
        projectId: r.project_id,
        description: r.description,
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
