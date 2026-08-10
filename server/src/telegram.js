import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  throw new Error('Falta TELEGRAM_BOT_TOKEN en server/.env');
}

export const bot = new TelegramBot(token, { polling: false });

export function sendReminderMessage(chatId, task, dueAt) {
  if (dueAt) {
    const hora = dueAt.toLocaleString('es-ES', {
      timeZone: 'Europe/Madrid',
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    return bot.sendMessage(chatId, `Recordatorio: ${task} (hoy a las ${hora})`);
  }
  return bot.sendMessage(chatId, `Recordatorio: ${task}`);
}
