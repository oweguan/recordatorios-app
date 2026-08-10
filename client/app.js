const micBtn = document.getElementById('micBtn');
const statusEl = document.getElementById('status');
const transcriptEl = document.getElementById('transcript');
const textForm = document.getElementById('textForm');
const textInput = document.getElementById('textInput');
const remindersList = document.getElementById('remindersList');
const waveformEl = document.getElementById('waveform');
const themeToggle = document.getElementById('themeToggle');

const mainView = document.getElementById('mainView');
const settingsView = document.getElementById('settingsView');
const settingsToggle = document.getElementById('settingsToggle');
const settingsBack = document.getElementById('settingsBack');

function showSettings() {
  mainView.hidden = true;
  settingsView.hidden = false;
}

function showMain() {
  settingsView.hidden = true;
  mainView.hidden = false;
}

settingsToggle.addEventListener('click', showSettings);
settingsBack.addEventListener('click', showMain);

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  applyTheme(savedTheme);
} else {
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(prefersLight ? 'light' : 'dark');
}

themeToggle.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  applyTheme(next);
  localStorage.setItem('theme', next);
});

const googleToggle = document.getElementById('googleToggle');
const googlePanel = document.getElementById('googlePanel');
const googleStatusLabel = document.getElementById('googleStatusLabel');
const backupNowBtn = document.getElementById('backupNowBtn');
const googleDisconnectBtn = document.getElementById('googleDisconnectBtn');
const backupsList = document.getElementById('backupsList');

async function refreshGoogleState() {
  try {
    const res = await fetch('/api/google/status');
    const data = await res.json();

    if (!data.configured) {
      googleToggle.disabled = true;
      googleToggle.title = 'Google no está configurado en el servidor';
      googleStatusLabel.textContent = 'No disponible';
      googlePanel.hidden = true;
      return;
    }

    googleToggle.classList.toggle('active', data.connected);
    googleToggle.title = data.connected ? 'Google conectado' : 'Conectar con Google';
    googleStatusLabel.textContent = data.connected ? 'Conectado' : 'No conectado';
    googlePanel.hidden = !data.connected;

    if (data.connected) loadBackups();
  } catch (err) {
    // silencioso, no bloquea el resto de la app
  }
}

async function loadBackups() {
  try {
    const res = await fetch('/api/google/backups');
    const backups = await res.json();

    if (!Array.isArray(backups) || backups.length === 0) {
      backupsList.innerHTML = '<div class="empty">Aún no hay copias de seguridad</div>';
      return;
    }

    backupsList.innerHTML = backups
      .map(
        (b) => `
      <div class="backup-item" data-file-id="${b.id}">
        <span>${escapeHtml(b.name)}</span>
        <button data-action="restore-backup">Restaurar</button>
      </div>`
      )
      .join('');
  } catch (err) {
    backupsList.innerHTML = '<div class="empty">No se pudieron cargar las copias</div>';
  }
}

googleToggle.addEventListener('click', async () => {
  if (googleToggle.classList.contains('active')) {
    if (!confirm('¿Desconectar Google? Dejarás de sincronizar con Calendar y hacer backups.')) return;
    await fetch('/api/google/disconnect', { method: 'POST' });
    refreshGoogleState();
  } else {
    window.location.href = '/api/google/auth';
  }
});

backupNowBtn.addEventListener('click', async () => {
  backupNowBtn.disabled = true;
  backupNowBtn.textContent = 'Guardando...';
  try {
    await fetch('/api/google/backup', { method: 'POST' });
    await loadBackups();
  } finally {
    backupNowBtn.disabled = false;
    backupNowBtn.textContent = 'Backup ahora';
  }
});

googleDisconnectBtn.addEventListener('click', async () => {
  if (!confirm('¿Desconectar Google?')) return;
  await fetch('/api/google/disconnect', { method: 'POST' });
  refreshGoogleState();
});

backupsList.addEventListener('click', async (e) => {
  const button = e.target.closest('button[data-action="restore-backup"]');
  if (!button) return;
  const fileId = button.closest('.backup-item').dataset.fileId;
  if (!confirm('¿Restaurar esta copia? Se añadirán los recordatorios guardados en ella.')) return;

  button.disabled = true;
  button.textContent = 'Restaurando...';
  try {
    const res = await fetch(`/api/google/restore/${fileId}`, { method: 'POST' });
    const data = await res.json();
    statusEl.textContent = `Restaurados ${data.restored ?? 0} recordatorios.`;
    loadReminders();
  } finally {
    button.disabled = false;
    button.textContent = 'Restaurar';
  }
});

{
  const params = new URLSearchParams(window.location.search);
  if (params.get('google') === 'connected') {
    showSettings();
    window.history.replaceState({}, '', window.location.pathname);
  } else if (params.get('google') === 'error') {
    showSettings();
    alert('No se pudo conectar con Google, inténtalo de nuevo.');
    window.history.replaceState({}, '', window.location.pathname);
  }
}

refreshGoogleState();

const pushToggle = document.getElementById('pushToggle');

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

async function refreshPushButtonState() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    pushToggle.disabled = true;
    pushToggle.title = 'Tu navegador no soporta notificaciones push';
    return;
  }
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  pushToggle.classList.toggle('active', Boolean(subscription));
  pushToggle.title = subscription ? 'Desactivar notificaciones push' : 'Activar notificaciones push';
}

async function subscribeToPush() {
  const keyRes = await fetch('/api/push/vapid-public-key');
  if (!keyRes.ok) {
    statusEl.textContent = 'Las notificaciones push no están configuradas en el servidor.';
    return;
  }
  const { publicKey } = await keyRes.json();

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    statusEl.textContent = 'No has dado permiso para notificaciones.';
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  });

  await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscription.toJSON()),
  });

  statusEl.textContent = 'Notificaciones push activadas.';
}

async function unsubscribeFromPush() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return;

  await fetch('/api/push/unsubscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ endpoint: subscription.endpoint }),
  });
  await subscription.unsubscribe();
  statusEl.textContent = 'Notificaciones push desactivadas.';
}

pushToggle.addEventListener('click', async () => {
  try {
    if (pushToggle.classList.contains('active')) {
      await unsubscribeFromPush();
    } else {
      await subscribeToPush();
    }
  } catch (err) {
    statusEl.textContent = 'Error activando notificaciones: ' + err.message;
  }
  refreshPushButtonState();
});

let mediaRecorder = null;
let audioChunks = [];
let recording = false;

const canRecord = Boolean(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);

if (!canRecord) {
  statusEl.textContent = 'Tu navegador no soporta grabación de audio. Usa el texto de abajo.';
  micBtn.disabled = true;
}

async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  audioChunks = [];
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) audioChunks.push(e.data);
  };

  mediaRecorder.onstop = () => {
    stream.getTracks().forEach((track) => track.stop());
    const blob = new Blob(audioChunks, { type: mediaRecorder.mimeType || 'audio/webm' });
    transcribeAndSubmit(blob);
  };

  mediaRecorder.start();
  recording = true;
  micBtn.classList.add('listening');
  waveformEl.classList.add('active');
  statusEl.textContent = 'Escuchando...';
  transcriptEl.textContent = '';
}

function stopRecording() {
  if (!mediaRecorder || !recording) return;
  mediaRecorder.stop();
  recording = false;
  micBtn.classList.remove('listening');
  waveformEl.classList.remove('active');
  statusEl.textContent = 'Transcribiendo...';
}

async function transcribeAndSubmit(blob) {
  try {
    const formData = new FormData();
    formData.append('audio', blob, 'recording.webm');

    const res = await fetch('/api/transcribe', { method: 'POST', body: formData });
    const data = await res.json();

    if (!res.ok || !data.text) {
      statusEl.textContent = data.error || 'No se pudo entender el audio, intenta de nuevo.';
      return;
    }

    transcriptEl.textContent = data.text;
    submitReminder(data.text);
  } catch (err) {
    statusEl.textContent = 'Error transcribiendo: ' + err.message;
  }
}

micBtn.addEventListener('click', () => {
  if (!canRecord) return;
  if (recording) {
    stopRecording();
  } else {
    startRecording().catch((err) => {
      statusEl.textContent = 'No se pudo acceder al micrófono: ' + err.message;
    });
  }
});

textForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = textInput.value.trim();
  if (!text) return;
  submitReminder(text);
  textInput.value = '';
});

async function submitReminder(text) {
  statusEl.textContent = 'Procesando...';
  try {
    const res = await fetch('/api/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();

    if (!res.ok) {
      statusEl.textContent = data.error || 'No entendí la fecha, intenta ser más específico.';
      return;
    }

    const leadNote = data.leadMinutes > 0 ? ` — aviso ${data.leadMinutes} min antes` : '';
    const recurrenceNote = RECURRENCE_LABEL[data.reminder.recurrence] ? ` — ${RECURRENCE_LABEL[data.reminder.recurrence]}` : '';
    statusEl.textContent = `Guardado: "${data.reminder.task}" — entendido como "${data.interpretedAs}"${leadNote}${recurrenceNote}`;
    transcriptEl.textContent = '';
    loadReminders();
  } catch (err) {
    statusEl.textContent = 'Error de conexión con el servidor.';
  }
}

const editingIds = new Set();

function formatDue(iso) {
  return new Date(iso).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function toDatetimeLocalValue(iso) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const RECURRENCE_LABEL = { daily: '🔁 cada día', weekly: '🔁 cada semana', monthly: '🔁 cada mes' };

function renderReminderView(r) {
  const recurrenceBadge = RECURRENCE_LABEL[r.recurrence] ? `<span class="badge">${RECURRENCE_LABEL[r.recurrence]}</span>` : '';
  return `
    <div class="reminder-item" data-id="${r.id}">
      <div class="reminder-main">
        <span class="task">${escapeHtml(r.task)}${recurrenceBadge}</span>
        <span class="due">${formatDue(r.due_at)}</span>
      </div>
      <div class="reminder-actions">
        <button data-action="postpone" data-minutes="15" title="Posponer 15 min">+15m</button>
        <button data-action="postpone" data-minutes="60" title="Posponer 1 hora">+1h</button>
        <button data-action="postpone" data-minutes="1440" title="Posponer 1 día">+1d</button>
        <button data-action="edit" title="Editar">✏️</button>
        <button data-action="delete" title="Cancelar recordatorio">🗑️</button>
      </div>
    </div>`;
}

function renderReminderEdit(r) {
  return `
    <div class="reminder-item editing" data-id="${r.id}">
      <div class="reminder-edit-form">
        <input type="text" class="edit-task" value="${escapeHtml(r.task)}" />
        <input type="datetime-local" class="edit-due" value="${toDatetimeLocalValue(r.due_at)}" />
      </div>
      <div class="reminder-actions">
        <button data-action="save-edit">Guardar</button>
        <button data-action="cancel-edit">Cancelar</button>
      </div>
    </div>`;
}

const DAY_BUCKETS = ['Hoy', 'Mañana', 'Esta semana', 'Más adelante'];

function dayBucket(iso) {
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round((startOfDay(new Date(iso)) - startOfDay(new Date())) / 86400000);
  if (diffDays <= 0) return 'Hoy';
  if (diffDays === 1) return 'Mañana';
  if (diffDays <= 7) return 'Esta semana';
  return 'Más adelante';
}

function renderGroupedReminders(pending) {
  const groups = { 'Hoy': [], 'Mañana': [], 'Esta semana': [], 'Más adelante': [] };
  for (const r of pending) groups[dayBucket(r.due_at)].push(r);

  return DAY_BUCKETS.filter((label) => groups[label].length > 0)
    .map((label) => {
      const items = groups[label]
        .map((r) => (editingIds.has(r.id) ? renderReminderEdit(r) : renderReminderView(r)))
        .join('');
      return `<div class="day-group"><h3 class="day-label">${label}</h3>${items}</div>`;
    })
    .join('');
}

async function loadReminders() {
  try {
    const res = await fetch('/api/reminders');
    const reminders = await res.json();
    const pending = reminders.filter((r) => r.status === 'pending');

    if (pending.length === 0) {
      remindersList.innerHTML = '<div class="empty">No tienes recordatorios pendientes 🎉</div>';
      return;
    }

    remindersList.innerHTML = renderGroupedReminders(pending);
  } catch (err) {
    remindersList.innerHTML = '<div class="empty">No se pudieron cargar los recordatorios</div>';
  }
}

remindersList.addEventListener('click', async (e) => {
  const button = e.target.closest('button[data-action]');
  if (!button) return;

  const item = button.closest('.reminder-item');
  const id = Number(item.dataset.id);
  const action = button.dataset.action;

  if (action === 'edit') {
    editingIds.add(id);
    loadReminders();
  } else if (action === 'cancel-edit') {
    editingIds.delete(id);
    loadReminders();
  } else if (action === 'delete') {
    if (!confirm('¿Cancelar este recordatorio?')) return;
    await fetch(`/api/reminders/${id}`, { method: 'DELETE' });
    loadReminders();
  } else if (action === 'postpone') {
    const minutes = Number(button.dataset.minutes);
    await fetch(`/api/reminders/${id}/postpone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ minutes }),
    });
    loadReminders();
  } else if (action === 'save-edit') {
    const task = item.querySelector('.edit-task').value.trim();
    const dueLocal = item.querySelector('.edit-due').value;
    if (!task || !dueLocal) return;

    await fetch(`/api/reminders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task, dueAt: new Date(dueLocal).toISOString() }),
    });
    editingIds.delete(id);
    loadReminders();
  }
});

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(() => {
    refreshPushButtonState();
  }).catch(() => {});
} else {
  pushToggle.disabled = true;
}

loadReminders();
