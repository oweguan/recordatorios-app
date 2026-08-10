const micBtn = document.getElementById('micBtn');
const statusEl = document.getElementById('status');
const transcriptEl = document.getElementById('transcript');
const textForm = document.getElementById('textForm');
const textInput = document.getElementById('textInput');
const remindersList = document.getElementById('remindersList');

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
    statusEl.textContent = `Guardado: "${data.reminder.task}" — entendido como "${data.interpretedAs}"${leadNote}`;
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

function renderReminderView(r) {
  return `
    <div class="reminder-item" data-id="${r.id}">
      <div class="reminder-main">
        <span class="task">${escapeHtml(r.task)}</span>
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

async function loadReminders() {
  try {
    const res = await fetch('/api/reminders');
    const reminders = await res.json();
    const pending = reminders.filter((r) => r.status === 'pending');

    if (pending.length === 0) {
      remindersList.innerHTML = '<div class="empty">No tienes recordatorios pendientes</div>';
      return;
    }

    remindersList.innerHTML = pending
      .map((r) => (editingIds.has(r.id) ? renderReminderEdit(r) : renderReminderView(r)))
      .join('');
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
