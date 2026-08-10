import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import { getReminderById, updateReminder, deleteReminder } from './db/index.js';

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  throw new Error('Falta TELEGRAM_BOT_TOKEN en server/.env');
}

export const bot = new TelegramBot(token, { polling: true });

const RECURRENCE_LABEL = {
  daily: 'se repite cada día',
  weekly: 'se repite cada semana',
  monthly: 'se repite cada mes',
};

export function sendReminderMessage(chatId, id, task, dueAt, recurrence) {
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

  return bot.sendMessage(chatId, `Recordatorio: ${task}${suffix}`, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '✅ Hecho', callback_data: `done:${id}` },
          { text: '⏰ +1h', callback_data: `postpone:${id}:60` },
          { text: '🗑️ Cancelar', callback_data: `cancel:${id}` },
        ],
      ],
    },
  });
}

export async function handleCallbackQuery(query) {
  const [action, idStr, extra] = query.data.split(':');
  const id = Number(idStr);
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;

  const reminder = await getReminderById(id);
  if (!reminder) {
    await bot.answerCallbackQuery(query.id, { text: 'Ese recordatorio ya no existe.' });
    return;
  }

  if (action === 'done') {
    await bot.answerCallbackQuery(query.id, { text: 'Marcado como hecho' });
    await bot.editMessageText(`✅ ${reminder.task}`, { chat_id: chatId, message_id: messageId });
  } else if (action === 'postpone') {
    const minutes = Number(extra);
    const newDue = new Date(Date.now() + minutes * 60000).toISOString();
    await updateReminder(id, { task: reminder.task, dueAt: newDue, notifyAt: newDue });
    await bot.answerCallbackQuery(query.id, { text: `Pospuesto ${minutes} min` });
    await bot.editMessageText(`⏰ ${reminder.task} — pospuesto, nuevo aviso en ${minutes} min`, {
      chat_id: chatId,
      message_id: messageId,
    });
  } else if (action === 'cancel') {
    await deleteReminder(id);
    await bot.answerCallbackQuery(query.id, { text: 'Cancelado' });
    await bot.editMessageText(`🗑️ ${reminder.task} (cancelado)`, { chat_id: chatId, message_id: messageId });
  }
}

bot.on('callback_query', (query) => {
  handleCallbackQuery(query).catch((err) => {
    console.error('Error procesando callback_query:', err.message);
  });
});
