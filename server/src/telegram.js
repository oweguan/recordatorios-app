import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  throw new Error('Falta TELEGRAM_BOT_TOKEN en server/.env');
}

export const bot = new TelegramBot(token, { polling: false });

const RECURRENCE_LABEL = {
  daily: 'se repite cada día',
  weekly: 'se repite cada semana',
  monthly: 'se repite cada mes',
};

export function sendReminderMessage(chatId, task, dueAt, recurrence) {
  const parts = [];

  if (dueAt) {
    const hora = dueAt.toLocaleString('es-ES', {
      timeZone: 'Europe/Madrid',
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    parts.push(`hoy a las ${hora}`);
  }

  if (recurrence && RECURRENCE_LABEL[recurrence]) {
    parts.push(RECURRENCE_LABEL[recurrence]);
  }

  const suffix = parts.length > 0 ? ` (${parts.join(', ')})` : '';
  return bot.sendMessage(chatId, `Recordatorio: ${task}${suffix}`);
}
