import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

db.exec(`
  CREATE TABLE IF NOT EXISTS google_auth (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    refresh_token TEXT
  )
`);

export async function init() {}

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

export async function createReminder({ originalText, task, dueAt, notifyAt, recurrence, chatId }) {
  const stmt = db.prepare(`
    INSERT INTO reminders (original_text, task, due_at, notify_at, recurrence, chat_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(originalText, task, dueAt, notifyAt ?? dueAt, recurrence ?? null, String(chatId));
  return getReminderById(Number(result.lastInsertRowid));
}

export async function getReminderById(id) {
  return db.prepare('SELECT * FROM reminders WHERE id = ?').get(id);
}

export async function listReminders() {
  return db.prepare('SELECT * FROM reminders ORDER BY due_at ASC').all();
}

export async function getDueReminders(nowIso) {
  return db.prepare(`
    SELECT * FROM reminders
    WHERE status = 'pending' AND notify_at <= ?
  `).all(nowIso);
}

export async function markSent(id) {
  db.prepare(`UPDATE reminders SET status = 'sent' WHERE id = ?`).run(id);
}

export async function rescheduleRecurring(id, nextDueAt, nextNotifyAt) {
  db.prepare(`UPDATE reminders SET due_at = ?, notify_at = ?, status = 'pending' WHERE id = ?`)
    .run(nextDueAt, nextNotifyAt ?? nextDueAt, id);
}

export async function updateReminder(id, { task, dueAt, notifyAt }) {
  db.prepare(`UPDATE reminders SET task = ?, due_at = ?, notify_at = ?, status = 'pending' WHERE id = ?`)
    .run(task, dueAt, notifyAt, id);
  return getReminderById(id);
}

export async function deleteReminder(id) {
  db.prepare('DELETE FROM reminders WHERE id = ?').run(id);
}
