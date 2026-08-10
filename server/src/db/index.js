const impl = process.env.DATABASE_URL
  ? await import('./postgres.js')
  : await import('./sqlite.js');

export const { init, createReminder, getReminderById, listReminders, getDueReminders, markSent, rescheduleRecurring } = impl;
