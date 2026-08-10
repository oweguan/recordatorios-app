const micBtn = document.getElementById('micBtn');
const statusEl = document.getElementById('status');
const transcriptEl = document.getElementById('transcript');
const textForm = document.getElementById('textForm');
const textInput = document.getElementById('textInput');
const remindersList = document.getElementById('remindersList');
const waveformEl = document.getElementById('waveform');
const themeToggle = document.getElementById('themeToggle');

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

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let listening = false;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = 'es-ES';
  recognition.interimResults = true;
  recognition.continuous = false;

  recognition.onstart = () => {
    listening = true;
    micBtn.classList.add('listening');
    waveformEl.classList.add('active');
    statusEl.textContent = 'Escuchando...';
    transcriptEl.textContent = '';
  };

  recognition.onresult = (event) => {
    let text = '';
    for (const result of event.results) {
      text += result[0].transcript;
    }
    transcriptEl.textContent = text;

    if (event.results[event.results.length - 1].isFinal) {
      submitReminder(text);
    }
  };

  recognition.onerror = (event) => {
    statusEl.textContent = `Error de voz: ${event.error}`;
  };

  recognition.onend = () => {
    listening = false;
    micBtn.classList.remove('listening');
    waveformEl.classList.remove('active');
    if (statusEl.textContent === 'Escuchando...') {
      statusEl.textContent = 'Pulsa el micrófono y di tu recordatorio';
    }
  };
} else {
  statusEl.textContent = 'Tu navegador no soporta voz. Usa el texto de abajo.';
  micBtn.disabled = true;
}

micBtn.addEventListener('click', () => {
  if (!recognition) return;
  if (listening) {
    recognition.stop();
  } else {
    recognition.start();
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
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

loadReminders();
