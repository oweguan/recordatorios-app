import pg from 'pg';

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

  // Permite recordatorios sin fecha (bandeja de entrada).
  await pool.query(`ALTER TABLE reminders ALTER COLUMN due_at DROP NOT NULL`);
  await pool.query(`ALTER TABLE reminders ALTER COLUMN notify_at DROP NOT NULL`);
}

function parseRow(row) {
  if (!row) return row;
  return { ...row, labels: row.labels ? JSON.parse(row.labels) : [] };
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

export async function createReminder({ originalText, task, dueAt, notifyAt, recurrence, chatId, priority, labels }) {
  const result = await pool.query(
    `INSERT INTO reminders (original_text, task, due_at, notify_at, recurrence, chat_id, priority, labels)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [
      originalText,
      task,
      dueAt ?? null,
      notifyAt ?? dueAt ?? null,
      recurrence ?? null,
      String(chatId),
      priority ?? 4,
      JSON.stringify(labels ?? []),
    ]
  );
  return parseRow(result.rows[0]);
}

export async function getReminderById(id) {
  const result = await pool.query('SELECT * FROM reminders WHERE id = $1', [id]);
  return parseRow(result.rows[0]);
}

export async function listReminders() {
  const result = await pool.query('SELECT * FROM reminders ORDER BY due_at ASC NULLS FIRST');
  return result.rows.map(parseRow);
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

export async function updateReminder(id, { task, dueAt, notifyAt, priority, labels }) {
  const result = await pool.query(
    `UPDATE reminders SET task = $1, due_at = $2, notify_at = $3, status = 'pending', priority = $4, labels = $5
     WHERE id = $6 RETURNING *`,
    [task, dueAt ?? null, notifyAt ?? null, priority ?? 4, JSON.stringify(labels ?? []), id]
  );
  return parseRow(result.rows[0]);
}

export async function deleteReminder(id) {
  await pool.query('DELETE FROM reminders WHERE id = $1', [id]);
}
