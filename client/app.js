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

    statusEl.textContent = `Guardado: "${data.reminder.task}" — entendido como "${data.interpretedAs}"`;
    transcriptEl.textContent = '';
    loadReminders();
  } catch (err) {
    statusEl.textContent = 'Error de conexión con el servidor.';
  }
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
      .map((r) => {
        const date = new Date(r.due_at);
        const formatted = date.toLocaleString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
        return `<div class="reminder-item"><span class="task">${escapeHtml(r.task)}</span><span class="due">${formatted}</span></div>`;
      })
      .join('');
  } catch (err) {
    remindersList.innerHTML = '<div class="empty">No se pudieron cargar los recordatorios</div>';
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

loadReminders();
