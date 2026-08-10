import 'dotenv/config';
import { OAuth2Client } from 'google-auth-library';
import { getGoogleAuth, saveGoogleAuth, listReminders } from './db/index.js';

const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/calendar.events',
];

const BACKUP_FOLDER_NAME = 'Recordatorios App - Backups';

function createOAuthClient() {
  return new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

export function isGoogleConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REDIRECT_URI);
}

export function getAuthUrl() {
  const client = createOAuthClient();
  return client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
  });
}

export async function handleOAuthCallback(code) {
  const client = createOAuthClient();
  const { tokens } = await client.getToken(code);
  if (!tokens.refresh_token) {
    throw new Error(
      'Google no devolvio un refresh_token. Revoca el acceso previo en myaccount.google.com/permissions y vuelve a intentarlo.'
    );
  }
  await saveGoogleAuth({ refreshToken: tokens.refresh_token });
}

export async function isGoogleConnected() {
  const auth = await getGoogleAuth();
  return Boolean(auth?.refresh_token);
}

export async function disconnectGoogle() {
  await saveGoogleAuth({ refreshToken: null });
}

async function getAccessToken() {
  const auth = await getGoogleAuth();
  if (!auth?.refresh_token) {
    throw new Error('Google no esta conectado');
  }
  const client = createOAuthClient();
  client.setCredentials({ refresh_token: auth.refresh_token });
  const { token } = await client.getAccessToken();
  return token;
}

// --- Drive: copias de seguridad ---

async function findOrCreateBackupFolder(token) {
  const q = encodeURIComponent(
    `name='${BACKUP_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`
  );
  const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const searchData = await searchRes.json();
  if (searchData.files?.length > 0) return searchData.files[0].id;

  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: BACKUP_FOLDER_NAME, mimeType: 'application/vnd.google-apps.folder' }),
  });
  const createData = await createRes.json();
  return createData.id;
}

export async function backupToDrive() {
  const token = await getAccessToken();
  const folderId = await findOrCreateBackupFolder(token);
  const reminders = await listReminders();

  const filename = `recordatorios-backup-${new Date().toISOString().slice(0, 10)}.json`;
  const content = JSON.stringify(reminders, null, 2);

  const boundary = 'recordatorios-app-boundary';
  const metadata = { name: filename, parents: [folderId] };
  const body =
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n` +
    `--${boundary}\r\nContent-Type: application/json\r\n\r\n${content}\r\n--${boundary}--`;

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body,
  });

  if (!res.ok) {
    throw new Error(`Drive upload error: ${res.status}`);
  }

  return res.json();
}

export async function listDriveBackups() {
  const token = await getAccessToken();
  const folderId = await findOrCreateBackupFolder(token);
  const q = encodeURIComponent(`'${folderId}' in parents and trashed=false`);
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,createdTime)&orderBy=createdTime desc`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) {
    throw new Error(`Drive list error: ${res.status}`);
  }
  const data = await res.json();
  return data.files || [];
}

export async function downloadDriveBackup(fileId) {
  const token = await getAccessToken();
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`Drive download error: ${res.status}`);
  }
  return res.json();
}

// --- Calendar: sincronizacion de recordatorios ---

function toCalendarEvent(reminder) {
  const start = new Date(reminder.due_at);
  const end = new Date(start.getTime() + 30 * 60000);
  return {
    summary: reminder.task,
    start: { dateTime: start.toISOString() },
    end: { dateTime: end.toISOString() },
  };
}

export async function createCalendarEvent(reminder) {
  const token = await getAccessToken();
  const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(toCalendarEvent(reminder)),
  });
  if (!res.ok) {
    throw new Error(`Calendar create error: ${res.status}`);
  }
  const data = await res.json();
  return data.id;
}

export async function updateCalendarEvent(eventId, reminder) {
  const token = await getAccessToken();
  const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(toCalendarEvent(reminder)),
  });
  if (!res.ok) {
    throw new Error(`Calendar update error: ${res.status}`);
  }
}

export async function deleteCalendarEvent(eventId) {
  const token = await getAccessToken();
  await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => {});
}
