const ICONS = {
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><circle cx="14" cy="6" r="2" fill="currentColor" stroke="none"/><line x1="4" y1="12" x2="20" y2="12"/><circle cx="8" cy="12" r="2" fill="currentColor" stroke="none"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="16" cy="18" r="2" fill="currentColor" stroke="none"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>',
  mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>',
  stop: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
  volume: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  repeat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
  arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
};

const micBtn = document.getElementById('micBtn');
const statusEl = document.getElementById('status');
const transcriptEl = document.getElementById('transcript');
const textForm = document.getElementById('textForm');
const textInput = document.getElementById('textInput');
const remindersList = document.getElementById('remindersList');
const themeToggle = document.getElementById('themeToggle');
const todayCountEl = document.getElementById('todayCount');

const mainView = document.getElementById('mainView');
const settingsView = document.getElementById('settingsView');
const settingsToggle = document.getElementById('settingsToggle');
const settingsBack = document.getElementById('settingsBack');

settingsToggle.innerHTML = ICONS.settings;
settingsBack.innerHTML = ICONS.arrowLeft;
micBtn.innerHTML = ICONS.mic;
document.getElementById('readTodayBtn').innerHTML = ICONS.volume;
document.getElementById('pushToggle').innerHTML = ICONS.bell;
document.getElementById('googleToggle').innerHTML = ICONS.cloud;

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
  themeToggle.innerHTML = theme === 'light' ? ICONS.moon : ICONS.sun;
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
const syncCalendarBtn = document.getElementById('syncCalendarBtn');

syncCalendarBtn.addEventListener('click', async () => {
  syncCalendarBtn.disabled = true;
  syncCalendarBtn.textContent = 'Sincronizando...';
  try {
    const res = await fetch('/api/google/sync-calendar', { method: 'POST' });
    const data = await res.json();
    alert(`Sincronizados ${data.synced ?? 0} recordatorios con Google Calendar.`);
  } catch (err) {
    alert('Error al sincronizar con Calendar.');
  } finally {
    syncCalendarBtn.disabled = false;
    syncCalendarBtn.textContent = 'Sincronizar recordatorios existentes';
  }
});

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
  statusEl.textContent = 'Tu navegador no soporta grabación de audio. Usa el texto.';
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
  micBtn.innerHTML = ICONS.stop;
  statusEl.textContent = 'Escuchando...';
  transcriptEl.textContent = '';
}

function stopRecording() {
  if (!mediaRecorder || !recording) return;
  mediaRecorder.stop();
  recording = false;
  micBtn.classList.remove('listening');
  micBtn.innerHTML = ICONS.mic;
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
    statusEl.textContent = `Guardado: "${data.reminder.task}"${leadNote}${recurrenceNote}`;
    transcriptEl.textContent = '';
    loadReminders();
  } catch (err) {
    statusEl.textContent = 'Error de conexión con el servidor.';
  }
}

const editingIds = new Set();

function formatDue(iso) {
  return new Date(iso).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

function toDatetimeLocalValue(iso) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const RECURRENCE_LABEL = { daily: 'cada día', weekly: 'cada semana', monthly: 'cada mes' };

function renderReminderView(r) {
  const recurrence = RECURRENCE_LABEL[r.recurrence]
    ? `<span class="recurrence">${ICONS.repeat}${RECURRENCE_LABEL[r.recurrence]}</span>`
    : '';

  return `
    <div class="reminder-row" data-id="${r.id}">
      <button class="check-circle" data-action="complete" aria-label="Completar">${ICONS.check}</button>
      <div class="reminder-info">
        <span class="task-text">${escapeHtml(r.task)}</span>
        <span class="task-meta">${ICONS.clock}${formatDue(r.due_at)}${recurrence}</span>
      </div>
      <div class="reminder-quick-actions">
        <button class="pill" data-action="postpone" data-minutes="60" title="Posponer 1 hora">+1h</button>
        <button class="pill" data-action="postpone" data-minutes="1440" title="Posponer 1 día">+1d</button>
        <button data-action="edit" title="Editar" aria-label="Editar">${ICONS.edit}</button>
        <button data-action="delete" title="Cancelar recordatorio" aria-label="Cancelar">${ICONS.trash}</button>
      </div>
    </div>`;
}

function renderReminderEdit(r) {
  return `
    <div class="reminder-edit-row" data-id="${r.id}">
      <div class="reminder-edit-form">
        <input type="text" class="edit-task" value="${escapeHtml(r.task)}" />
        <input type="datetime-local" class="edit-due" value="${toDatetimeLocalValue(r.due_at)}" />
        <div class="reminder-edit-actions">
          <button data-action="save-edit">Guardar</button>
          <button data-action="cancel-edit">Cancelar</button>
        </div>
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

let latestPendingReminders = [];

async function loadReminders() {
  try {
    const res = await fetch('/api/reminders');
    const reminders = await res.json();
    const pending = reminders.filter((r) => r.status === 'pending');
    latestPendingReminders = pending;

    const todayCount = pending.filter((r) => dayBucket(r.due_at) === 'Hoy').length;
    todayCountEl.textContent = todayCount > 0 ? `${todayCount} tarea${todayCount === 1 ? '' : 's'} para hoy` : 'Sin tareas para hoy';

    if (pending.length === 0) {
      remindersList.innerHTML = '<div class="empty">No tienes recordatorios pendientes 🎉</div>';
      return;
    }

    remindersList.innerHTML = renderGroupedReminders(pending);
  } catch (err) {
    remindersList.innerHTML = '<div class="empty">No se pudieron cargar los recordatorios</div>';
  }
}

const readTodayBtn = document.getElementById('readTodayBtn');

function speak(text) {
  if (!('speechSynthesis' in window)) {
    statusEl.textContent = 'Tu navegador no soporta lectura en voz alta.';
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';
  window.speechSynthesis.speak(utterance);
}

readTodayBtn.addEventListener('click', () => {
  const today = latestPendingReminders
    .filter((r) => dayBucket(r.due_at) === 'Hoy')
    .sort((a, b) => new Date(a.due_at) - new Date(b.due_at));

  if (today.length === 0) {
    speak('No tienes recordatorios pendientes para hoy.');
    return;
  }

  const parts = today.map((r) => {
    const hora = new Date(r.due_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    return `${r.task} a las ${hora}`;
  });

  const intro = `Tienes ${today.length} tarea${today.length === 1 ? '' : 's'} para hoy: `;
  speak(intro + parts.join('. '));
});

remindersList.addEventListener('click', async (e) => {
  const button = e.target.closest('button[data-action]');
  if (!button) return;

  const item = button.closest('.reminder-row, .reminder-edit-row');
  const id = Number(item.dataset.id);
  const action = button.dataset.action;

  if (action === 'complete') {
    item.classList.add('completing');
    setTimeout(async () => {
      await fetch(`/api/reminders/${id}`, { method: 'DELETE' });
      loadReminders();
    }, 320);
  } else if (action === 'edit') {
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
