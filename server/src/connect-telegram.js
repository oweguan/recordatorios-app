import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const chatIdFile = path.join(__dirname, '..', 'chat_id.txt');

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error('Falta TELEGRAM_BOT_TOKEN en server/.env');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

console.log('Esperando un mensaje tuyo en Telegram... escribe algo al bot ahora.');

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  fs.writeFileSync(chatIdFile, String(chatId));
  console.log(`Chat detectado. chat_id = ${chatId} (guardado en server/chat_id.txt)`);

  bot.sendMessage(chatId, 'Conectado. A partir de ahora te avisare aqui de tus recordatorios.')
    .then(() => {
      console.log('Mensaje de confirmacion enviado. Puedes cerrar este proceso con Ctrl+C.');
    })
    .catch((err) => {
      console.error('Error enviando confirmacion:', err.message);
    });
});

bot.on('polling_error', (err) => {
  console.error('Error de polling:', err.message);
});
