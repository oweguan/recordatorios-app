import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { nextProjectColor } from '../projectColors.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', '..', 'reminders.db');

const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    original_text TEXT NOT NULL,
    task TEXT NOT NULL,
    due_at TEXT NOT NULL,
    recurrence TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    chat_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

try {
  db.exec('ALTER TABLE reminders ADD COLUMN notify_at TEXT');
} catch {
  // ya existe
}
db.exec(`UPDATE reminders SET notify_at = due_at WHERE notify_at IS NULL`);

db.exec(`
  CREATE TABLE IF NOT EXISTS push_subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    endpoint TEXT NOT NULL UNIQUE,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

try {
  db.exec('ALTER TABLE reminders ADD COLUMN google_event_id TEXT');
} catch {
  // ya existe
}

try {
  db.exec("ALTER TABLE reminders ADD COLUMN priority INTEGER NOT NULL DEFAULT 4");
} catch {
  // ya existe
}

try {
  db.exec('ALTER TABLE reminders ADD COLUMN labels TEXT');
} catch {
  // ya existe
}

db.exec(`
  CREATE TABLE IF NOT EXISTS google_auth (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    refresh_token TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '#808080',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS subtasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reminder_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

try {
  db.exec('ALTER TABLE reminders ADD COLUMN project_id INTEGER');
} catch {
  // ya existe
}

try {
  db.exec('ALTER TABLE reminders ADD COLUMN description TEXT');
} catch {
  // ya existe
}

// Permite recordatorios sin fecha (bandeja de entrada): due_at/notify_at pasan a ser NULLables.
const dueAtInfo = db.prepare("PRAGMA table_info(reminders)").all().find((c) => c.name === 'due_at');
if (dueAtInfo && dueAtInfo.notnull) {
  db.exec(`
    CREATE TABLE reminders_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      original_text TEXT NOT NULL,
      task TEXT NOT NULL,
      due_at TEXT,
      notify_at TEXT,
      recurrence TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      chat_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      google_event_id TEXT,
      priority INTEGER NOT NULL DEFAULT 4,
      labels TEXT,
      project_id INTEGER,
      description TEXT
    );
    INSERT INTO reminders_new (id, original_text, task, due_at, notify_at, recurrence, status, chat_id, created_at, google_event_id, priority, labels, project_id, description)
      SELECT id, original_text, task, due_at, notify_at, recurrence, status, chat_id, created_at, google_event_id, priority, labels, project_id, description FROM reminders;
    DROP TABLE reminders;
    ALTER TABLE reminders_new RENAME TO reminders;
  `);
}

function parseRow(row) {
  if (!row) return row;
  return { ...row, labels: row.labels ? JSON.parse(row.labels) : [] };
}

function attachSubtasksToList(reminders) {
  if (reminders.length === 0) return reminders;
  const ids = reminders.map((r) => r.id);
  const placeholders = ids.map(() => '?').join(',');
  const rows = db
    .prepare(`SELECT * FROM subtasks WHERE reminder_id IN (${placeholders}) ORDER BY sort_order ASC, id ASC`)
    .all(...ids);
  const grouped = new Map();
  for (const row of rows) {
    const list = grouped.get(row.reminder_id) || [];
    list.push({ ...row, done: Boolean(row.done) });
    grouped.set(row.reminder_id, list);
  }
  return reminders.map((r) => ({ ...r, subtasks: grouped.get(r.id) || [] }));
}

function attachSubtasks(reminder) {
  if (!reminder) return reminder;
  return attachSubtasksToList([reminder])[0];
}

export async function init() {}

// --- Proyectos ---

export async function listProjects() {
  return db.prepare('SELECT * FROM projects ORDER BY id ASC').all();
}

export async function getProjectById(id) {
  return db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
}

export async function findOrCreateProjectByName(name) {
  const existing = db.prepare('SELECT * FROM projects WHERE LOWER(name) = LOWER(?)').get(name);
  if (existing) return existing;
  const count = db.prepare('SELECT COUNT(*) as c FROM projects').get().c;
  const result = db.prepare('INSERT INTO projects (name, color) VALUES (?, ?)').run(name, nextProjectColor(count));
  return getProjectById(Number(result.lastInsertRowid));
}

export async function createProject({ name, color }) {
  const existing = db.prepare('SELECT * FROM projects WHERE LOWER(name) = LOWER(?)').get(name);
  if (existing) return existing;
  const count = db.prepare('SELECT COUNT(*) as c FROM projects').get().c;
  const result = db
    .prepare('INSERT INTO projects (name, color) VALUES (?, ?)')
    .run(name, color || nextProjectColor(count));
  return getProjectById(Number(result.lastInsertRowid));
}

export async function updateProject(id, { name, color }) {
  db.prepare('UPDATE projects SET name = ?, color = ? WHERE id = ?').run(name, color, id);
  return getProjectById(id);
}

export async function deleteProject(id) {
  db.prepare('UPDATE reminders SET project_id = NULL WHERE project_id = ?').run(id);
  db.prepare('DELETE FROM projects WHERE id = ?').run(id);
}

// --- Subtareas ---

export async function createSubtask(reminderId, text) {
  const count = db.prepare('SELECT COUNT(*) as c FROM subtasks WHERE reminder_id = ?').get(reminderId).c;
  const result = db
    .prepare('INSERT INTO subtasks (reminder_id, text, sort_order) VALUES (?, ?, ?)')
    .run(reminderId, text, count);
  const row = db.prepare('SELECT * FROM subtasks WHERE id = ?').get(Number(result.lastInsertRowid));
  return { ...row, done: Boolean(row.done) };
}

export async function getSubtaskById(id) {
  const row = db.prepare('SELECT * FROM subtasks WHERE id = ?').get(id);
  return row ? { ...row, done: Boolean(row.done) } : row;
}

export async function updateSubtask(id, { text, done }) {
  db.prepare('UPDATE subtasks SET text = ?, done = ? WHERE id = ?').run(text, done ? 1 : 0, id);
  return getSubtaskById(id);
}

export async function deleteSubtask(id) {
  db.prepare('DELETE FROM subtasks WHERE id = ?').run(id);
}

export async function saveGoogleAuth({ refreshToken }) {
  db.prepare(`
    INSERT INTO google_auth (id, refresh_token) VALUES (1, ?)
    ON CONFLICT(id) DO UPDATE SET refresh_token = excluded.refresh_token
  `).run(refreshToken);
}

export async function getGoogleAuth() {
  return db.prepare('SELECT * FROM google_auth WHERE id = 1').get();
}

export async function updateReminderGoogleEventId(id, googleEventId) {
  db.prepare('UPDATE reminders SET google_event_id = ? WHERE id = ?').run(googleEventId, id);
}

export async function savePushSubscription({ endpoint, p256dh, auth }) {
  db.prepare(`
    INSERT INTO push_subscriptions (endpoint, p256dh, auth)
    VALUES (?, ?, ?)
    ON CONFLICT(endpoint) DO UPDATE SET p256dh = excluded.p256dh, auth = excluded.auth
  `).run(endpoint, p256dh, auth);
}

export async function listPushSubscriptions() {
  return db.prepare('SELECT * FROM push_subscriptions').all();
}

export async function deletePushSubscription(endpoint) {
  db.prepare('DELETE FROM push_subscriptions WHERE endpoint = ?').run(endpoint);
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
  const stmt = db.prepare(`
    INSERT INTO reminders (original_text, task, due_at, notify_at, recurrence, chat_id, priority, labels, project_id, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    originalText,
    task,
    dueAt ?? null,
    notifyAt ?? dueAt ?? null,
    recurrence ?? null,
    String(chatId),
    priority ?? 4,
    JSON.stringify(labels ?? []),
    projectId ?? null,
    description ?? null
  );
  return getReminderById(Number(result.lastInsertRowid));
}

export async function getReminderById(id) {
  return attachSubtasks(parseRow(db.prepare('SELECT * FROM reminders WHERE id = ?').get(id)));
}

export async function listReminders() {
  const rows = db.prepare('SELECT * FROM reminders ORDER BY due_at IS NULL, due_at ASC').all().map(parseRow);
  return attachSubtasksToList(rows);
}

export async function getDueReminders(nowIso) {
  return db.prepare(`
    SELECT * FROM reminders
    WHERE status = 'pending' AND notify_at IS NOT NULL AND notify_at <= ?
  `).all(nowIso);
}

export async function markSent(id) {
  db.prepare(`UPDATE reminders SET status = 'sent' WHERE id = ?`).run(id);
}

export async function rescheduleRecurring(id, nextDueAt, nextNotifyAt) {
  db.prepare(`UPDATE reminders SET due_at = ?, notify_at = ?, status = 'pending' WHERE id = ?`)
    .run(nextDueAt, nextNotifyAt ?? nextDueAt, id);
}

export async function updateReminder(id, { task, dueAt, notifyAt, priority, labels, projectId, description }) {
  db.prepare(`
    UPDATE reminders
    SET task = ?, due_at = ?, notify_at = ?, status = 'pending', priority = ?, labels = ?, project_id = ?, description = ?
    WHERE id = ?
  `).run(
    task,
    dueAt ?? null,
    notifyAt ?? null,
    priority ?? 4,
    JSON.stringify(labels ?? []),
    projectId ?? null,
    description ?? null,
    id
  );
  return getReminderById(id);
}

export async function deleteReminder(id) {
  db.prepare('DELETE FROM subtasks WHERE reminder_id = ?').run(id);
  db.prepare('DELETE FROM reminders WHERE id = ?').run(id);
}
