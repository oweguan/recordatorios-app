import pg from 'pg';
import { nextProjectColor } from '../projectColors.js';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reminders (
      id SERIAL PRIMARY KEY,
      original_text TEXT NOT NULL,
      task TEXT NOT NULL,
      due_at TEXT NOT NULL,
      recurrence TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      chat_id TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
  await pool.query(`ALTER TABLE reminders ADD COLUMN IF NOT EXISTS notify_at TEXT`);
  await pool.query(`UPDATE reminders SET notify_at = due_at WHERE notify_at IS NULL`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id SERIAL PRIMARY KEY,
      endpoint TEXT NOT NULL UNIQUE,
      p256dh TEXT NOT NULL,
      auth TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  await pool.query(`ALTER TABLE reminders ADD COLUMN IF NOT EXISTS google_event_id TEXT`);
  await pool.query(`ALTER TABLE reminders ADD COLUMN IF NOT EXISTS priority INTEGER NOT NULL DEFAULT 4`);
  await pool.query(`ALTER TABLE reminders ADD COLUMN IF NOT EXISTS labels TEXT`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS google_auth (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      refresh_token TEXT
    )
  `);
  await pool.query(`ALTER TABLE google_auth ADD COLUMN IF NOT EXISTS calendar_enabled BOOLEAN NOT NULL DEFAULT true`);
  await pool.query(`ALTER TABLE google_auth ADD COLUMN IF NOT EXISTS drive_enabled BOOLEAN NOT NULL DEFAULT true`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      color TEXT NOT NULL DEFAULT '#808080',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS subtasks (
      id SERIAL PRIMARY KEY,
      reminder_id INTEGER NOT NULL,
      text TEXT NOT NULL,
      done BOOLEAN NOT NULL DEFAULT false,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  await pool.query(`ALTER TABLE reminders ADD COLUMN IF NOT EXISTS project_id INTEGER`);
  await pool.query(`ALTER TABLE reminders ADD COLUMN IF NOT EXISTS description TEXT`);
  await pool.query(`ALTER TABLE reminders ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0`);

  // Permite recordatorios sin fecha (bandeja de entrada).
  await pool.query(`ALTER TABLE reminders ALTER COLUMN due_at DROP NOT NULL`);
  await pool.query(`ALTER TABLE reminders ALTER COLUMN notify_at DROP NOT NULL`);
}

function parseRow(row) {
  if (!row) return row;
  return { ...row, labels: row.labels ? JSON.parse(row.labels) : [] };
}

async function attachSubtasksToList(reminders) {
  if (reminders.length === 0) return reminders;
  const ids = reminders.map((r) => r.id);
  const result = await pool.query('SELECT * FROM subtasks WHERE reminder_id = ANY($1) ORDER BY sort_order ASC, id ASC', [ids]);
  const grouped = new Map();
  for (const row of result.rows) {
    const list = grouped.get(row.reminder_id) || [];
    list.push(row);
    grouped.set(row.reminder_id, list);
  }
  return reminders.map((r) => ({ ...r, subtasks: grouped.get(r.id) || [] }));
}

async function attachSubtasks(reminder) {
  if (!reminder) return reminder;
  return (await attachSubtasksToList([reminder]))[0];
}

// --- Proyectos ---

export async function listProjects() {
  const result = await pool.query('SELECT * FROM projects ORDER BY id ASC');
  return result.rows;
}

export async function getProjectById(id) {
  const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
  return result.rows[0];
}

export async function findOrCreateProjectByName(name) {
  const existing = await pool.query('SELECT * FROM projects WHERE LOWER(name) = LOWER($1)', [name]);
  if (existing.rows[0]) return existing.rows[0];
  const countRes = await pool.query('SELECT COUNT(*)::int AS c FROM projects');
  const result = await pool.query('INSERT INTO projects (name, color) VALUES ($1, $2) RETURNING *', [
    name,
    nextProjectColor(countRes.rows[0].c),
  ]);
  return result.rows[0];
}

export async function createProject({ name, color }) {
  const existing = await pool.query('SELECT * FROM projects WHERE LOWER(name) = LOWER($1)', [name]);
  if (existing.rows[0]) return existing.rows[0];
  const countRes = await pool.query('SELECT COUNT(*)::int AS c FROM projects');
  const result = await pool.query('INSERT INTO projects (name, color) VALUES ($1, $2) RETURNING *', [
    name,
    color || nextProjectColor(countRes.rows[0].c),
  ]);
  return result.rows[0];
}

export async function updateProject(id, { name, color }) {
  const result = await pool.query('UPDATE projects SET name = $1, color = $2 WHERE id = $3 RETURNING *', [
    name,
    color,
    id,
  ]);
  return result.rows[0];
}

export async function deleteProject(id) {
  await pool.query('UPDATE reminders SET project_id = NULL WHERE project_id = $1', [id]);
  await pool.query('DELETE FROM projects WHERE id = $1', [id]);
}

// --- Subtareas ---

export async function createSubtask(reminderId, text) {
  const countRes = await pool.query('SELECT COUNT(*)::int AS c FROM subtasks WHERE reminder_id = $1', [reminderId]);
  const result = await pool.query(
    'INSERT INTO subtasks (reminder_id, text, sort_order) VALUES ($1, $2, $3) RETURNING *',
    [reminderId, text, countRes.rows[0].c]
  );
  return result.rows[0];
}

export async function getSubtaskById(id) {
  const result = await pool.query('SELECT * FROM subtasks WHERE id = $1', [id]);
  return result.rows[0];
}

export async function updateSubtask(id, { text, done }) {
  const result = await pool.query('UPDATE subtasks SET text = $1, done = $2 WHERE id = $3 RETURNING *', [
    text,
    Boolean(done),
    id,
  ]);
  return result.rows[0];
}

export async function deleteSubtask(id) {
  await pool.query('DELETE FROM subtasks WHERE id = $1', [id]);
}

export async function saveGoogleAuth({ refreshToken }) {
  await pool.query(
    `INSERT INTO google_auth (id, refresh_token) VALUES (1, $1)
     ON CONFLICT (id) DO UPDATE SET refresh_token = excluded.refresh_token`,
    [refreshToken]
  );
}

export async function getGoogleAuth() {
  const result = await pool.query('SELECT * FROM google_auth WHERE id = 1');
  return result.rows[0];
}

export async function setGoogleFeatureEnabled(feature, enabled) {
  const column = feature === 'drive' ? 'drive_enabled' : 'calendar_enabled';
  await pool.query(`UPDATE google_auth SET ${column} = $1 WHERE id = 1`, [enabled]);
  return getGoogleAuth();
}

export async function updateReminderGoogleEventId(id, googleEventId) {
  await pool.query('UPDATE reminders SET google_event_id = $1 WHERE id = $2', [googleEventId, id]);
}

export async function savePushSubscription({ endpoint, p256dh, auth }) {
  await pool.query(
    `INSERT INTO push_subscriptions (endpoint, p256dh, auth)
     VALUES ($1, $2, $3)
     ON CONFLICT (endpoint) DO UPDATE SET p256dh = excluded.p256dh, auth = excluded.auth`,
    [endpoint, p256dh, auth]
  );
}

export async function listPushSubscriptions() {
  const result = await pool.query('SELECT * FROM push_subscriptions');
  return result.rows;
}

export async function deletePushSubscription(endpoint) {
  await pool.query('DELETE FROM push_subscriptions WHERE endpoint = $1', [endpoint]);
}

export async function createReminder({
  originalText,
  task,
  dueAt,
  notifyAt,
  recurrence,
  chatId,
  priority,
  labels,
  projectId,
  description,
}) {
  const sortOrderRes = await pool.query('SELECT COALESCE(MAX(sort_order), 0) + 1 AS n FROM reminders');
  const result = await pool.query(
    `INSERT INTO reminders (original_text, task, due_at, notify_at, recurrence, chat_id, priority, labels, project_id, description, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
    [
      originalText,
      task,
      dueAt ?? null,
      notifyAt ?? dueAt ?? null,
      recurrence ?? null,
      String(chatId),
      priority ?? 4,
      JSON.stringify(labels ?? []),
      projectId ?? null,
      description ?? null,
      sortOrderRes.rows[0].n,
    ]
  );
  return getReminderById(result.rows[0].id);
}

export async function reorderReminders(ids) {
  for (let index = 0; index < ids.length; index++) {
    await pool.query('UPDATE reminders SET sort_order = $1 WHERE id = $2', [index, ids[index]]);
  }
}

export async function getReminderById(id) {
  const result = await pool.query('SELECT * FROM reminders WHERE id = $1', [id]);
  return attachSubtasks(parseRow(result.rows[0]));
}

export async function listReminders() {
  const result = await pool.query('SELECT * FROM reminders ORDER BY due_at ASC NULLS FIRST');
  return attachSubtasksToList(result.rows.map(parseRow));
}

export async function getDueReminders(nowIso) {
  const result = await pool.query(
    `SELECT * FROM reminders WHERE status = 'pending' AND notify_at IS NOT NULL AND notify_at <= $1`,
    [nowIso]
  );
  return result.rows;
}

export async function markSent(id) {
  await pool.query(`UPDATE reminders SET status = 'sent' WHERE id = $1`, [id]);
}

export async function rescheduleRecurring(id, nextDueAt, nextNotifyAt) {
  await pool.query(
    `UPDATE reminders SET due_at = $1, notify_at = $2, status = 'pending' WHERE id = $3`,
    [nextDueAt, nextNotifyAt ?? nextDueAt, id]
  );
}

export async function setReminderStatus(id, status) {
  await pool.query('UPDATE reminders SET status = $1 WHERE id = $2', [status, id]);
  return getReminderById(id);
}

export async function updateReminder(id, { task, dueAt, notifyAt, priority, labels, projectId, description }) {
  await pool.query(
    `UPDATE reminders
     SET task = $1, due_at = $2, notify_at = $3, status = 'pending', priority = $4, labels = $5, project_id = $6, description = $7
     WHERE id = $8`,
    [
      task,
      dueAt ?? null,
      notifyAt ?? null,
      priority ?? 4,
      JSON.stringify(labels ?? []),
      projectId ?? null,
      description ?? null,
      id,
    ]
  );
  return getReminderById(id);
}

export async function deleteReminder(id) {
  await pool.query('DELETE FROM subtasks WHERE reminder_id = $1', [id]);
  await pool.query('DELETE FROM reminders WHERE id = $1', [id]);
}
