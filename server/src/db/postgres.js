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
}

export async function createReminder({ originalText, task, dueAt, recurrence, chatId }) {
  const result = await pool.query(
    `INSERT INTO reminders (original_text, task, due_at, recurrence, chat_id)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [originalText, task, dueAt, recurrence ?? null, String(chatId)]
  );
  return result.rows[0];
}

export async function getReminderById(id) {
  const result = await pool.query('SELECT * FROM reminders WHERE id = $1', [id]);
  return result.rows[0];
}

export async function listReminders() {
  const result = await pool.query('SELECT * FROM reminders ORDER BY due_at ASC');
  return result.rows;
}

export async function getDueReminders(nowIso) {
  const result = await pool.query(
    `SELECT * FROM reminders WHERE status = 'pending' AND due_at <= $1`,
    [nowIso]
  );
  return result.rows;
}

export async function markSent(id) {
  await pool.query(`UPDATE reminders SET status = 'sent' WHERE id = $1`, [id]);
}

export async function rescheduleRecurring(id, nextDueAt) {
  await pool.query(
    `UPDATE reminders SET due_at = $1, status = 'pending' WHERE id = $2`,
    [nextDueAt, id]
  );
}
