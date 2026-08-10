import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  throw new Error('Falta TELEGRAM_BOT_TOKEN en server/.env');
}

export const bot = new TelegramBot(token, { polling: false });

export function sendReminderMessage(chatId, task) {
  return bot.sendMessage(chatId, `Recordatorio: ${task}`);
}
