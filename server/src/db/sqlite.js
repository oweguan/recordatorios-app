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

export async function init() {}

export async function createReminder({ originalText, task, dueAt, recurrence, chatId }) {
  const stmt = db.prepare(`
    INSERT INTO reminders (original_text, task, due_at, recurrence, chat_id)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(originalText, task, dueAt, recurrence ?? null, String(chatId));
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
    WHERE status = 'pending' AND due_at <= ?
  `).all(nowIso);
}

export async function markSent(id) {
  db.prepare(`UPDATE reminders SET status = 'sent' WHERE id = ?`).run(id);
}

export async function rescheduleRecurring(id, nextDueAt) {
  db.prepare(`UPDATE reminders SET due_at = ?, status = 'pending' WHERE id = ?`).run(nextDueAt, id);
}
