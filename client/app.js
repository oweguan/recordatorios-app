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
  inbox: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',
  today: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><polyline points="8 12 11 15 16 9"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
  flag: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M5 21V4c0-.55.45-1 1-1 2 1.5 4.5 1.5 7 0 2.5 1.5 5 1.5 6.5 0 .3-.3.8-.1.8.3v10c0 .3-.5.5-.8.3-1.5-1.5-4-1.5-6.5 0-2.5 1.5-5 1.5-7 0V21c0 .55-.45 1-1 1z"/></svg>',
  checklist: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 8 5 10 9 6"/><line x1="12" y1="8" x2="21" y2="8"/><polyline points="3 17 5 19 9 15"/><line x1="12" y1="17" x2="21" y2="17"/></svg>',
  folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>',
  grip: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/></svg>',
};

const PRIORITY_COLORS = { 1: '#e63946', 2: '#f4a52a', 3: '#4a90e2', 4: 'transparent' };

const NAV_ICONS = {
  inbox: ICONS.inbox,
  today: ICONS.today,
  upcoming: ICONS.calendar,
  projects: ICONS.folder,
  explore: ICONS.search,
};

// ==================== Elementos ====================

const statusEl = document.getElementById('status');
const transcriptEl = document.getElementById('transcript');
const todayCountEl = document.getElementById('todayCount');
const onboardingEl = document.getElementById('onboarding');
const appShellEl = document.getElementById('appShell');
const settingsView = document.getElementById('settingsView');
const settingsToggle = document.getElementById('settingsToggle');
const settingsBack = document.getElementById('settingsBack');
const themeToggle = document.getElementById('themeToggle');

document.querySelectorAll('.nav-item').forEach((btn) => {
  btn.querySelector('.nav-icon').innerHTML = NAV_ICONS[btn.dataset.page];
});
document.querySelectorAll('.ob-tab-icon[data-icon]').forEach((el) => {
  el.innerHTML = NAV_ICONS[el.dataset.icon] || '';
});

settingsToggle.innerHTML = ICONS.settings;
settingsBack.innerHTML = ICONS.arrowLeft;
document.getElementById('readTodayBtn').innerHTML = ICONS.volume;
document.getElementById('pushToggle').innerHTML = ICONS.bell;
document.querySelectorAll('[data-action="open-quick-add"], [data-action="add-project"], #fabAdd').forEach((btn) => {
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
});
document.querySelector('[data-action="back-to-projects"]').innerHTML = ICONS.arrowLeft;
document.querySelector('[data-action="rename-current-project"]').innerHTML = ICONS.edit;
document.querySelector('[data-action="delete-current-project"]').innerHTML = ICONS.trash;
document.getElementById('calPrev').innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';
document.getElementById('calNext').innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';
renderWeekdayHeader();

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ==================== Perfil (nombre + foto, local al dispositivo) ====================

function getProfile() {
  return {
    name: localStorage.getItem('profileName') || '',
    photo: localStorage.getItem('profilePhoto') || '',
  };
}

function applyProfileToUI() {
  const { name, photo } = getProfile();
  const initial = name ? name.trim()[0].toUpperCase() : '?';

  const greeting = document.getElementById('greeting');
  greeting.textContent = name ? `Hola, ${name}` : 'Hola';

  const avatar = document.getElementById('profileAvatar');
  const initialEl = document.getElementById('profileInitial');
  if (photo) {
    avatar.src = photo;
    avatar.hidden = false;
    initialEl.hidden = true;
  } else {
    avatar.hidden = true;
    initialEl.hidden = false;
    initialEl.textContent = initial;
  }

  document.getElementById('settingsProfileName').textContent = name || 'Sin nombre';
  const settingsAvatar = document.getElementById('settingsAvatarPreview');
  const settingsInitial = document.getElementById('settingsAvatarInitial');
  if (photo) {
    settingsAvatar.src = photo;
    settingsAvatar.hidden = false;
    settingsInitial.hidden = true;
  } else {
    settingsAvatar.hidden = true;
    settingsInitial.hidden = false;
    settingsInitial.textContent = initial;
  }
  document.getElementById('removePhotoBtn').hidden = !photo;
}

function readImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

document.getElementById('settingsAvatarBtn').addEventListener('click', () => {
  document.getElementById('settingsPhotoInput').click();
});

document.getElementById('settingsPhotoInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const dataUrl = await readImageAsDataUrl(file);
  localStorage.setItem('profilePhoto', dataUrl);
  applyProfileToUI();
});

document.getElementById('settingsProfileName').addEventListener('click', () => {
  const current = getProfile().name;
  const next = prompt('Tu nombre', current);
  if (next === null) return;
  localStorage.setItem('profileName', next.trim());
  applyProfileToUI();
});

document.getElementById('removePhotoBtn').addEventListener('click', () => {
  if (!confirm('¿Quitar tu foto de perfil?')) return;
  localStorage.removeItem('profilePhoto');
  applyProfileToUI();
});

// ==================== Pestaña Proyectos ====================
// currentProjectId: null = vista de lista de proyectos; numero = detalle de un proyecto abierto.

let currentProjectId = null;

function renderProjectsList() {
  const el = document.getElementById('projectsList');
  if (allProjects.length === 0) {
    el.innerHTML = `<div class="empty-hero">
      <div class="icon-circle">${ICONS.folder}</div>
      <p>Crea proyectos para agrupar tus tareas, como "Trabajo" o "Casa". Escribe #proyecto al añadir una tarea, o créalo aquí con el botón +.</p>
    </div>`;
    return;
  }

  el.innerHTML = allProjects
    .map((p) => {
      const count = allReminders.filter((r) => r.project_id === p.id && r.status !== 'done').length;
      return `<button type="button" class="project-card" data-action="open-project" data-project-id="${p.id}">
        <span class="project-dot" style="--pc:${p.color}"></span>
        <span class="project-card-name">${escapeHtml(p.name)}</span>
        <span class="project-card-count">${count}</span>
      </button>`;
    })
    .join('');
}

function renderProjectDetail(project) {
  document.getElementById('projectDetailName').textContent = project.name;

  const items = allReminders
    .filter((r) => r.project_id === project.id)
    .sort((a, b) => {
      if (!a.due_at && !b.due_at) return (a.sort_order ?? 0) - (b.sort_order ?? 0);
      if (!a.due_at) return -1;
      if (!b.due_at) return 1;
      return new Date(a.due_at) - new Date(b.due_at);
    });

  renderList(
    document.getElementById('projectTaskList'),
    items,
    '<div class="empty">Sin tareas en este proyecto todavía</div>'
  );
}

function renderProjectsPage() {
  const listView = document.getElementById('projectsListView');
  const detailView = document.getElementById('projectDetailView');

  if (currentProjectId === null) {
    listView.hidden = false;
    detailView.hidden = true;
    renderProjectsList();
    return;
  }

  const project = allProjects.find((p) => p.id === currentProjectId);
  if (!project) {
    currentProjectId = null;
    renderProjectsPage();
    return;
  }

  listView.hidden = true;
  detailView.hidden = false;
  renderProjectDetail(project);
}

document.querySelector('section.app-page[data-page="projects"]').addEventListener('click', async (e) => {
  const button = e.target.closest('button[data-action]');
  if (!button) return;
  const action = button.dataset.action;

  if (action === 'open-project') {
    currentProjectId = Number(button.dataset.projectId);
    renderProjectsPage();
  } else if (action === 'add-project') {
    const name = prompt('Nombre del nuevo proyecto');
    if (!name || !name.trim()) return;
    await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim() }),
    });
    await refreshData();
  } else if (action === 'back-to-projects') {
    currentProjectId = null;
    renderProjectsPage();
  } else if (action === 'rename-current-project') {
    const project = allProjects.find((p) => p.id === currentProjectId);
    if (!project) return;
    const next = prompt('Nuevo nombre del proyecto', project.name);
    if (next === null || !next.trim()) return;
    await fetch(`/api/projects/${project.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: next.trim() }),
    });
    await refreshData();
  } else if (action === 'delete-current-project') {
    const project = allProjects.find((p) => p.id === currentProjectId);
    if (!project) return;
    if (!confirm(`¿Eliminar el proyecto "${project.name}"? Las tareas no se borran, solo pierden la asignación.`)) return;
    await fetch(`/api/projects/${project.id}`, { method: 'DELETE' });
    currentProjectId = null;
    await refreshData();
  }
});

document.getElementById('projectQuickAddForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('projectQuickAddInput');
  const text = input.value.trim();
  if (!text || currentProjectId === null) return;
  submitReminder(text, { projectId: currentProjectId });
  input.value = '';
  updateQuickAddHints(input, document.getElementById('projectQuickAddHints'));
});

// ==================== Onboarding ====================

const OB_STEPS = ['welcome', 'personalize', 'organize', 'features'];

function showObStep(step) {
  document.querySelectorAll('.ob-step').forEach((el) => {
    el.hidden = el.dataset.step !== step;
  });
  localStorage.setItem('onboardingStep', step);
}

function startApp() {
  onboardingEl.hidden = true;
  appShellEl.hidden = false;
  applyProfileToUI();
  switchPage(getHomeView());
  refreshData();
}

if (localStorage.getItem('onboarded') === 'true') {
  onboardingEl.hidden = true;
  appShellEl.hidden = false;
} else {
  onboardingEl.hidden = false;
  appShellEl.hidden = true;
  showObStep(localStorage.getItem('onboardingStep') || 'welcome');
}

onboardingEl.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  if (btn.dataset.action === 'ob-next') {
    if (btn.closest('.ob-step').dataset.step === 'personalize') {
      const name = document.getElementById('obNameInput').value.trim();
      if (name) localStorage.setItem('profileName', name);
    }
    const idx = OB_STEPS.indexOf(btn.closest('.ob-step').dataset.step);
    showObStep(OB_STEPS[idx + 1]);
  } else if (btn.dataset.action === 'ob-finish') {
    localStorage.setItem('onboarded', 'true');
    localStorage.removeItem('onboardingStep');
    startApp();
  }
});

document.getElementById('obAvatarBtn').addEventListener('click', () => {
  document.getElementById('obPhotoInput').click();
});

document.getElementById('obPhotoInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const dataUrl = await readImageAsDataUrl(file);
  localStorage.setItem('profilePhoto', dataUrl);
  const img = document.getElementById('obAvatarPreview');
  img.src = dataUrl;
  img.hidden = false;
  document.getElementById('obAvatarIcon').hidden = true;
});

// ==================== Tema ====================

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

// ==================== Color de acento (4 temas, como el free de Todoist) ====================

const ACCENT_THEMES = [
  { id: 'red', color: '#db4c3f', hover: '#c8402f' },
  { id: 'orange', color: '#e58b39', hover: '#d17a2c' },
  { id: 'blue', color: '#4a90e2', hover: '#3a7bc8' },
  { id: 'green', color: '#2a9d8f', hover: '#238276' },
];

function applyAccent(id) {
  const theme = ACCENT_THEMES.find((t) => t.id === id) || ACCENT_THEMES[0];
  document.documentElement.style.setProperty('--accent', theme.color);
  document.documentElement.style.setProperty('--accent-hover', theme.hover);
}

function renderAccentSwatches() {
  const el = document.getElementById('accentSwatches');
  const current = localStorage.getItem('accentColor') || 'red';
  el.innerHTML = ACCENT_THEMES.map(
    (t) =>
      `<button type="button" class="accent-swatch${t.id === current ? ' active' : ''}" data-accent="${t.id}" style="--sw:${t.color}" aria-label="Color ${t.id}"></button>`
  ).join('');
}

document.getElementById('accentSwatches').addEventListener('click', (e) => {
  const btn = e.target.closest('.accent-swatch');
  if (!btn) return;
  localStorage.setItem('accentColor', btn.dataset.accent);
  applyAccent(btn.dataset.accent);
  renderAccentSwatches();
});

applyAccent(localStorage.getItem('accentColor') || 'red');
renderAccentSwatches();

// ==================== Preferencias: pantalla de inicio y primer dia de la semana ====================

const HOME_VIEW_OPTIONS = ['inbox', 'today', 'upcoming', 'projects', 'explore'];

function getHomeView() {
  const saved = localStorage.getItem('homeView');
  return HOME_VIEW_OPTIONS.includes(saved) ? saved : 'inbox';
}

function getWeekStart() {
  return localStorage.getItem('weekStart') === 'sunday' ? 'sunday' : 'monday';
}

function renderWeekdayHeader() {
  const labels =
    getWeekStart() === 'sunday' ? ['D', 'L', 'M', 'X', 'J', 'V', 'S'] : ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  document.getElementById('calWeekdays').innerHTML = labels.map((d) => `<span>${d}</span>`).join('');
}

const homeViewSelect = document.getElementById('homeViewSelect');
homeViewSelect.value = getHomeView();
homeViewSelect.addEventListener('change', (e) => {
  localStorage.setItem('homeView', e.target.value);
});

const weekStartSelect = document.getElementById('weekStartSelect');
weekStartSelect.value = getWeekStart();
weekStartSelect.addEventListener('change', (e) => {
  localStorage.setItem('weekStart', e.target.value);
  renderWeekdayHeader();
  renderCalendar();
});

// ==================== Settings <-> App shell ====================

function showSettings() {
  appShellEl.hidden = true;
  settingsView.hidden = false;
}

function showAppShell() {
  settingsView.hidden = true;
  appShellEl.hidden = false;
}

document.getElementById('profileBtn').addEventListener('click', showSettings);
settingsToggle.addEventListener('click', showSettings);
settingsBack.addEventListener('click', showAppShell);

// ==================== Google Calendar y Google Drive (activables por separado) ====================
// Comparten una unica conexion OAuth, pero cada funcion se puede activar/desactivar por
// separado sin desconectar la cuenta entera (ver /api/google/toggle en el servidor).

const calendarToggle = document.getElementById('calendarToggle');
const calendarPanel = document.getElementById('calendarPanel');
const calendarStatusLabel = document.getElementById('calendarStatusLabel');
const driveToggle = document.getElementById('driveToggle');
const drivePanel = document.getElementById('drivePanel');
const driveStatusLabel = document.getElementById('driveStatusLabel');
const googleStatusLabel = document.getElementById('googleStatusLabel');
const backupNowBtn = document.getElementById('backupNowBtn');
const googleDisconnectBtn = document.getElementById('googleDisconnectBtn');
const backupsList = document.getElementById('backupsList');
const syncCalendarBtn = document.getElementById('syncCalendarBtn');
const obGoogleToggle = document.getElementById('obGoogleToggle');

let googleState = { configured: false, connected: false, calendarEnabled: true, driveEnabled: true };

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
    googleState = await res.json();

    if (!googleState.configured) {
      calendarToggle.disabled = true;
      driveToggle.disabled = true;
      calendarStatusLabel.textContent = 'No disponible';
      driveStatusLabel.textContent = 'No disponible';
      googleStatusLabel.textContent = 'No disponible';
      calendarPanel.hidden = true;
      drivePanel.hidden = true;
      googleDisconnectBtn.hidden = true;
      obGoogleToggle.disabled = true;
      return;
    }

    const calendarActive = googleState.connected && googleState.calendarEnabled;
    const driveActive = googleState.connected && googleState.driveEnabled;

    calendarToggle.classList.toggle('active', calendarActive);
    calendarStatusLabel.textContent = calendarActive ? 'Activado' : googleState.connected ? 'Desactivado' : 'No conectado';
    calendarPanel.hidden = !calendarActive;

    driveToggle.classList.toggle('active', driveActive);
    driveStatusLabel.textContent = driveActive ? 'Activado' : googleState.connected ? 'Desactivado' : 'No conectado';
    drivePanel.hidden = !driveActive;

    googleStatusLabel.textContent = googleState.connected ? 'Conectado' : 'No conectado';
    googleDisconnectBtn.hidden = !googleState.connected;
    obGoogleToggle.classList.toggle('active', googleState.connected);

    if (driveActive) loadBackups();
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

async function toggleGoogleFeature(feature, currentlyActive) {
  if (!googleState.connected) {
    // Primera conexion: una sola autorizacion cubre Calendar y Drive a la vez.
    window.location.href = '/api/google/auth';
    return;
  }
  await fetch('/api/google/toggle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ feature, enabled: !currentlyActive }),
  });
  refreshGoogleState();
}

calendarToggle.addEventListener('click', () => {
  toggleGoogleFeature('calendar', googleState.connected && googleState.calendarEnabled);
});
driveToggle.addEventListener('click', () => {
  toggleGoogleFeature('drive', googleState.connected && googleState.driveEnabled);
});
obGoogleToggle.addEventListener('click', () => {
  if (!googleState.connected) window.location.href = '/api/google/auth';
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
  if (!confirm('¿Desconectar Google? Se apagarán Calendar y Drive a la vez.')) return;
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
    refreshData();
  } finally {
    button.disabled = false;
    button.textContent = 'Restaurar';
  }
});

{
  const params = new URLSearchParams(window.location.search);
  if (params.get('google') === 'connected' || params.get('google') === 'error') {
    if (params.get('google') === 'error') alert('No se pudo conectar con Google, inténtalo de nuevo.');
    window.history.replaceState({}, '', window.location.pathname);
    if (localStorage.getItem('onboarded') !== 'true') {
      showObStep('features');
    } else {
      showSettings();
    }
  }
}

refreshGoogleState();

// ==================== Push ====================

const pushToggle = document.getElementById('pushToggle');
const obPushToggle = document.getElementById('obPushToggle');

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
    obPushToggle.disabled = true;
    return;
  }
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  const active = Boolean(subscription);
  pushToggle.classList.toggle('active', active);
  pushToggle.title = active ? 'Desactivar notificaciones push' : 'Activar notificaciones push';
  obPushToggle.classList.toggle('active', active);
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

async function togglePush() {
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
}

pushToggle.addEventListener('click', togglePush);
obPushToggle.addEventListener('click', togglePush);

// ==================== Voz: grabar y transcribir ====================

const micBtn = document.getElementById('micBtn');
micBtn.innerHTML = ICONS.mic;

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

// ==================== Crear recordatorios ====================

const RECURRENCE_LABEL = { daily: 'cada día', weekly: 'cada semana', monthly: 'cada mes' };

async function submitReminder(text, extra = {}) {
  statusEl.textContent = 'Procesando...';
  try {
    const res = await fetch('/api/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, ...extra }),
    });
    const data = await res.json();

    if (!res.ok) {
      statusEl.textContent = data.error || 'No entendí la fecha, intenta ser más específico.';
      return;
    }

    const leadNote = data.leadMinutes > 0 ? ` — aviso ${data.leadMinutes} min antes` : '';
    const recurrenceNote = RECURRENCE_LABEL[data.reminder.recurrence] ? ` — ${RECURRENCE_LABEL[data.reminder.recurrence]}` : '';
    const inboxNote = data.inbox ? ' — sin fecha, guardado en Bandeja de entrada' : '';
    statusEl.textContent = `Guardado: "${data.reminder.task}"${leadNote}${recurrenceNote}${inboxNote}`;
    transcriptEl.textContent = '';
    refreshData();
  } catch (err) {
    statusEl.textContent = 'Error de conexión con el servidor.';
  }
}

document.getElementById('textForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('textInput');
  const text = input.value.trim();
  if (!text) return;
  submitReminder(text);
  input.value = '';
  updateQuickAddHints(input, document.getElementById('textHints'));
});

// Refuerzo: el envio implicito con Enter no siempre dispara el evento "submit"
// cuando el formulario tiene otros controles (el boton del microfono).
document.getElementById('textInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    document.getElementById('textForm').requestSubmit();
  }
});

// Modal de anadir rapido (Hoy / Proximo)
const quickAddModal = document.getElementById('quickAddModal');

function openQuickAdd() {
  quickAddModal.hidden = false;
  document.getElementById('quickAddInput').focus();
}

function closeQuickAdd() {
  quickAddModal.hidden = true;
  const input = document.getElementById('quickAddInput');
  input.value = '';
  updateQuickAddHints(input, document.getElementById('quickAddHints'));
}

document.querySelectorAll('[data-action="open-quick-add"]').forEach((btn) => {
  btn.addEventListener('click', openQuickAdd);
});

// FAB global: si estamos dentro de un proyecto, enfoca su input dedicado (ya sabe a que
// proyecto asignar la tarea); en cualquier otra pantalla, abre el modal generico.
document.getElementById('fabAdd').addEventListener('click', () => {
  if (currentPage === 'projects' && currentProjectId !== null) {
    const input = document.getElementById('projectQuickAddInput');
    input.focus();
    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    openQuickAdd();
  }
});
quickAddModal.addEventListener('click', (e) => {
  if (e.target === quickAddModal || e.target.dataset.action === 'close-quick-add') closeQuickAdd();
});
document.getElementById('quickAddForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('quickAddInput');
  const text = input.value.trim();
  if (!text) return;
  submitReminder(text);
  closeQuickAdd();
});

// ==================== Quick Add: prioridad, etiquetas, proyecto y sugerencias en vivo ====================
// Espejo en cliente de extractPriority/extractLabels/extractProject (server/src/parser.js), solo para la vista previa.

const QA_PRIORITY_RE = /(?:^|\s)p([1-4])(?=\s|$)/i;
const QA_LABEL_RE = /(?:^|\s)@([\p{L}0-9_-]+)/gu;
const QA_PROJECT_RE = /(?:^|\s)#([\p{L}0-9_-]+)/u;

function parseQuickAddPreview(text) {
  const pMatch = text.match(QA_PRIORITY_RE);
  const priority = pMatch ? Number(pMatch[1]) : null;
  const labels = [...text.matchAll(QA_LABEL_RE)].map((m) => m[1].toLowerCase());
  const projMatch = text.match(QA_PROJECT_RE);
  const project = projMatch ? projMatch[1].toLowerCase() : null;
  return { priority, labels: [...new Set(labels)], project };
}

function getPartialToken(text, caret) {
  const before = text.slice(0, caret ?? text.length);
  const m = before.match(/([@#])([\p{L}0-9_-]*)$/u);
  return m ? { trigger: m[1], value: m[2] } : null;
}

function knownLabels() {
  const set = new Set();
  allReminders.forEach((r) => (r.labels || []).forEach((l) => set.add(l)));
  return [...set].sort();
}

function knownProjectNames() {
  return allProjects.map((p) => p.name).sort();
}

function updateQuickAddHints(inputEl, hintsEl) {
  const text = inputEl.value;
  const partial = getPartialToken(text, inputEl.selectionStart);

  if (partial) {
    const pool = partial.trigger === '@' ? knownLabels() : knownProjectNames();
    const suggestions = pool.filter((v) => v.startsWith(partial.value.toLowerCase()) && v !== partial.value.toLowerCase());
    if (suggestions.length > 0) {
      hintsEl.innerHTML = suggestions
        .slice(0, 6)
        .map(
          (v) =>
            `<button type="button" class="hint-suggest" data-token="${partial.trigger}${escapeHtml(v)}">${partial.trigger}${escapeHtml(v)}</button>`
        )
        .join('');
      hintsEl.hidden = false;
      return;
    }
  }

  const { priority, labels, project } = parseQuickAddPreview(text);
  if (!priority && labels.length === 0 && !project) {
    hintsEl.innerHTML = '';
    hintsEl.hidden = true;
    return;
  }

  const chips = [];
  if (priority) {
    chips.push(`<span class="hint-chip priority-chip p${priority}">${ICONS.flag}P${priority}</span>`);
  }
  if (project) {
    chips.push(`<span class="hint-chip label-chip">#${escapeHtml(project)}</span>`);
  }
  labels.forEach((l) => chips.push(`<span class="hint-chip label-chip">@${escapeHtml(l)}</span>`));
  hintsEl.innerHTML = chips.join('');
  hintsEl.hidden = false;
}

function insertTokenSuggestion(inputEl, hintsEl, token) {
  const text = inputEl.value;
  const caret = inputEl.selectionStart ?? text.length;
  const before = text.slice(0, caret).replace(/[@#][\p{L}0-9_-]*$/u, `${token} `);
  const after = text.slice(caret);
  inputEl.value = before + after;
  inputEl.focus();
  const newCaret = before.length;
  inputEl.setSelectionRange(newCaret, newCaret);
  updateQuickAddHints(inputEl, hintsEl);
}

function wireQuickAddHints(inputEl, hintsEl) {
  const refresh = () => updateQuickAddHints(inputEl, hintsEl);
  inputEl.addEventListener('input', refresh);
  inputEl.addEventListener('click', refresh);
  inputEl.addEventListener('keyup', (e) => {
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) refresh();
  });
  hintsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.hint-suggest');
    if (!btn) return;
    insertTokenSuggestion(inputEl, hintsEl, btn.dataset.token);
  });
}

wireQuickAddHints(document.getElementById('textInput'), document.getElementById('textHints'));
wireQuickAddHints(document.getElementById('quickAddInput'), document.getElementById('quickAddHints'));
wireQuickAddHints(document.getElementById('projectQuickAddInput'), document.getElementById('projectQuickAddHints'));

// ==================== Render de una fila de recordatorio ====================

const editingIds = new Set();
const expandedSubtaskIds = new Set();

function formatDue(iso) {
  return new Date(iso).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

function toDatetimeLocalValue(iso) {
  const d = iso ? new Date(iso) : new Date(Date.now() + 3600000);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function priorityFlag(priority) {
  if (!priority || priority === 4) return '';
  return `<span class="priority-flag p${priority}" title="Prioridad ${priority}">${ICONS.flag}</span>`;
}

function getProject(id) {
  if (!id) return null;
  return allProjects.find((p) => p.id === id) || null;
}

function tagsRow(r) {
  const parts = [];
  const project = getProject(r.project_id);
  if (project) {
    parts.push(`<span class="project-chip" style="--pc:${project.color}">#${escapeHtml(project.name)}</span>`);
  }
  (r.labels || []).forEach((l) => parts.push(`<span class="label-chip">@${escapeHtml(l)}</span>`));
  if (parts.length === 0) return '';
  return `<span class="label-chips">${parts.join('')}</span>`;
}

function descriptionPreview(description) {
  if (!description) return '';
  const truncated = description.length > 90 ? description.slice(0, 90) + '…' : description;
  return `<span class="task-description">${escapeHtml(truncated)}</span>`;
}

function subtaskSummary(r) {
  if (!r.subtasks || r.subtasks.length === 0) return '';
  const done = r.subtasks.filter((s) => s.done).length;
  return `<button type="button" class="subtask-toggle" data-action="toggle-subtasks" title="Ver subtareas">${ICONS.checklist}${done}/${r.subtasks.length}</button>`;
}

function renderSubtasksList(r) {
  if (!expandedSubtaskIds.has(r.id) || !r.subtasks || r.subtasks.length === 0) return '';
  return `<div class="subtasks-list">
    ${r.subtasks
      .map(
        (s) => `
      <div class="subtask-row">
        <button type="button" class="subtask-check${s.done ? ' done' : ''}" data-action="toggle-subtask-done" data-subtask-id="${s.id}">${s.done ? ICONS.check : ''}</button>
        <span class="subtask-text${s.done ? ' done' : ''}">${escapeHtml(s.text)}</span>
      </div>`
      )
      .join('')}
  </div>`;
}

function renderReminderView(r) {
  const isDone = r.status === 'done';
  const recurrence = RECURRENCE_LABEL[r.recurrence]
    ? `<span class="recurrence">${ICONS.repeat}${RECURRENCE_LABEL[r.recurrence]}</span>`
    : '';
  const meta = r.due_at
    ? `<span class="task-meta">${ICONS.clock}${formatDue(r.due_at)}${recurrence}${subtaskSummary(r)}</span>`
    : `<span class="task-meta">Sin fecha${subtaskSummary(r)}</span>`;
  const postponeButtons = r.due_at && !isDone
    ? `<button class="pill" data-action="postpone" data-minutes="60" title="Posponer 1 hora">+1h</button>
       <button class="pill" data-action="postpone" data-minutes="1440" title="Posponer 1 día">+1d</button>`
    : '';
  const checkAction = isDone ? 'uncomplete' : 'complete';
  const checkLabel = isDone ? 'Marcar como pendiente' : 'Completar';
  // La manija siempre se genera; que sea visible o no depende del contenedor via CSS
  // (reordenar solo tiene sentido para tareas sin fecha en Bandeja/Proyecto, y arrastrar al
  // calendario solo aplica a tareas con fecha en la lista del dia de Proximo).
  const dragHandle = `<button type="button" class="drag-handle" aria-label="Arrastrar" title="Arrastrar">${ICONS.grip}</button>`;

  return `
    <div class="reminder-row" data-id="${r.id}"${r.due_at ? ' data-has-due="1"' : ''}>
      ${dragHandle}
      <button class="check-circle${isDone ? ' checked' : ''}" data-action="${checkAction}" aria-label="${checkLabel}" title="${checkLabel}">${ICONS.check}</button>
      <div class="reminder-info">
        <span class="task-text${isDone ? ' done' : ''}">${priorityFlag(r.priority)}${escapeHtml(r.task)}</span>
        ${meta}
        ${descriptionPreview(r.description)}
        ${tagsRow(r)}
        ${renderSubtasksList(r)}
      </div>
      <div class="reminder-quick-actions">
        ${postponeButtons}
        <button data-action="edit" title="Editar" aria-label="Editar">${ICONS.edit}</button>
        <button data-action="delete" title="Cancelar recordatorio" aria-label="Cancelar">${ICONS.trash}</button>
      </div>
    </div>`;
}

function renderSubtasksEditHtml(r) {
  const subtasksHtml = (r.subtasks || [])
    .map(
      (s) => `
      <div class="subtask-edit-row" data-subtask-id="${s.id}">
        <button type="button" class="subtask-check${s.done ? ' done' : ''}" data-action="toggle-subtask-done" data-subtask-id="${s.id}">${s.done ? ICONS.check : ''}</button>
        <span class="subtask-text${s.done ? ' done' : ''}">${escapeHtml(s.text)}</span>
        <button type="button" data-action="delete-subtask" data-subtask-id="${s.id}" title="Eliminar subtarea">${ICONS.trash}</button>
      </div>`
    )
    .join('');

  return `
    ${subtasksHtml}
    <div class="subtask-add-row">
      <input type="text" class="new-subtask-input" placeholder="+ Añadir subtarea" />
      <button type="button" data-action="add-subtask">Añadir</button>
    </div>`;
}

function renderReminderEdit(r) {
  const priority = r.priority || 4;
  const labelsValue = (r.labels || []).map((l) => `@${l}`).join(' ');
  const projectOptions = ['<option value="">Sin proyecto</option>']
    .concat(
      allProjects.map(
        (p) => `<option value="${p.id}"${p.id === r.project_id ? ' selected' : ''}>${escapeHtml(p.name)}</option>`
      )
    )
    .join('');

  return `
    <div class="reminder-edit-row" data-id="${r.id}" data-priority="${priority}">
      <div class="reminder-edit-form">
        <input type="text" class="edit-task" value="${escapeHtml(r.task)}" />
        <textarea class="edit-description" placeholder="Descripción (opcional)">${escapeHtml(r.description || '')}</textarea>
        <div class="edit-due-row">
          <input type="datetime-local" class="edit-due" value="${r.due_at ? toDatetimeLocalValue(r.due_at) : ''}" />
          <button type="button" class="clear-due-btn" data-action="clear-due" title="Quitar fecha (mover a Bandeja de entrada)">✕</button>
        </div>
        <div class="edit-priority-picker">
          ${[1, 2, 3, 4]
            .map(
              (p) =>
                `<button type="button" class="priority-pick p${p}${p === priority ? ' active' : ''}" data-action="pick-priority" data-priority="${p}">${ICONS.flag}P${p}</button>`
            )
            .join('')}
        </div>
        <select class="edit-project">${projectOptions}</select>
        <input type="text" class="edit-labels" placeholder="@etiquetas" value="${escapeHtml(labelsValue)}" />
        <div class="edit-subtasks">
          ${renderSubtasksEditHtml(r)}
        </div>
        <div class="reminder-edit-actions">
          <button data-action="save-edit">Guardar</button>
          <button data-action="cancel-edit">Cancelar</button>
        </div>
      </div>
    </div>`;
}

function renderList(el, items, emptyHtml) {
  if (items.length === 0) {
    el.innerHTML = emptyHtml;
    return;
  }
  el.innerHTML = items.map((r) => (editingIds.has(r.id) ? renderReminderEdit(r) : renderReminderView(r))).join('');
}

// Actualiza solo la lista de subtareas en el DOM tras una mutación, sin re-renderizar
// el resto del formulario de edición (evita perder texto sin guardar en otros campos).
async function refreshSubtasksInPlace(id, item) {
  const res = await fetch('/api/reminders');
  allReminders = await res.json();

  const container = item.querySelector('.edit-subtasks');
  if (container) {
    const reminder = allReminders.find((r) => r.id === id);
    if (reminder) container.innerHTML = renderSubtasksEditHtml(reminder);
  } else {
    renderCurrentPage();
  }
  updateHeaderCounts();
}

// ==================== Arrastrar y soltar ====================
// Un unico controlador basado en pointer events (funciona igual con raton y con tactil) cubre
// dos gestos: reordenar manualmente dentro de una lista (Bandeja/Proyecto), y arrastrar una
// tarea del dia seleccionado en Proximo sobre el calendario para reprogramarla.

let dragInfo = null;

function findDragContext(row) {
  if (row.closest('#inboxList')) return { type: 'reorder', container: document.getElementById('inboxList') };
  if (row.closest('#projectTaskList')) return { type: 'reorder', container: document.getElementById('projectTaskList') };
  if (row.closest('#upcomingDayList')) return { type: 'calendar', container: document.getElementById('upcomingDayList') };
  return null;
}

function onDragMove(e) {
  if (!dragInfo) return;
  const { row, type } = dragInfo;

  if (type === 'reorder') {
    const target = document.elementFromPoint(e.clientX, e.clientY)?.closest('.reminder-row');
    if (target && target !== row && target.parentElement === row.parentElement) {
      const rect = target.getBoundingClientRect();
      const before = e.clientY < rect.top + rect.height / 2;
      target.parentElement.insertBefore(row, before ? target : target.nextSibling);
    }
  } else if (type === 'calendar') {
    document.querySelectorAll('.cal-day.drop-target').forEach((el) => el.classList.remove('drop-target'));
    const dayCell = document.elementFromPoint(e.clientX, e.clientY)?.closest('.cal-day');
    if (dayCell) dayCell.classList.add('drop-target');
  }
}

async function onDragEnd(e) {
  if (!dragInfo) return;
  const { row, type, container, id, pointerId } = dragInfo;
  try {
    row.releasePointerCapture(pointerId);
  } catch {
    // ya liberado
  }
  row.removeEventListener('pointermove', onDragMove);
  row.removeEventListener('pointerup', onDragEnd);
  row.removeEventListener('pointercancel', onDragEnd);
  row.classList.remove('dragging');
  dragInfo = null;

  if (type === 'reorder') {
    const ids = [...container.querySelectorAll('.reminder-row')].map((el) => Number(el.dataset.id));
    await fetch('/api/reminders/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    refreshData();
  } else if (type === 'calendar') {
    document.querySelectorAll('.cal-day.drop-target').forEach((el) => el.classList.remove('drop-target'));
    const dayCell = document.elementFromPoint(e.clientX, e.clientY)?.closest('.cal-day');
    if (!dayCell) return;
    const reminder = allReminders.find((r) => r.id === id);
    if (!reminder || !reminder.due_at) return;
    const newDate = new Date(dayCell.dataset.date);
    const oldDate = new Date(reminder.due_at);
    newDate.setHours(oldDate.getHours(), oldDate.getMinutes(), oldDate.getSeconds(), 0);
    if (newDate.toDateString() === oldDate.toDateString()) return; // soltada en el mismo dia, nada que hacer
    await fetch(`/api/reminders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dueAt: newDate.toISOString() }),
    });
    refreshData();
  }
}

document.body.addEventListener('pointerdown', (e) => {
  const handle = e.target.closest('.drag-handle');
  if (!handle) return;
  const row = handle.closest('.reminder-row');
  if (!row) return;
  const ctx = findDragContext(row);
  if (!ctx) return;

  e.preventDefault();
  dragInfo = {
    id: Number(row.dataset.id),
    row,
    type: ctx.type,
    container: ctx.container,
    pointerId: e.pointerId,
  };
  row.classList.add('dragging');
  row.setPointerCapture(e.pointerId);
  row.addEventListener('pointermove', onDragMove);
  row.addEventListener('pointerup', onDragEnd);
  row.addEventListener('pointercancel', onDragEnd);
});

// Delegacion global para acciones sobre filas de recordatorio (vale para todas las pestañas)
document.body.addEventListener('click', async (e) => {
  const button = e.target.closest('button[data-action]');
  if (!button) {
    // Clic en el cuerpo de la tarea (fuera de cualquier boton) abre edicion, como en Todoist.
    const infoArea = e.target.closest('.reminder-info');
    const row = infoArea?.closest('.reminder-row');
    if (row) {
      const rowId = Number(row.dataset.id);
      if (!editingIds.has(rowId)) {
        editingIds.add(rowId);
        renderCurrentPage();
      }
    }
    return;
  }
  const validActions = [
    'complete',
    'uncomplete',
    'edit',
    'cancel-edit',
    'delete',
    'postpone',
    'save-edit',
    'pick-priority',
    'clear-due',
    'toggle-subtasks',
    'toggle-subtask-done',
    'delete-subtask',
    'add-subtask',
  ];
  if (!validActions.includes(button.dataset.action)) return;

  const item = button.closest('.reminder-row, .reminder-edit-row');
  if (!item) return;
  const id = Number(item.dataset.id);
  const action = button.dataset.action;

  if (action === 'complete') {
    // No destructivo: pasa a status "done" (recuperable desde Explorar > Completadas). Si es
    // recurrente, el servidor la reprograma a la siguiente ocurrencia en vez de completarla.
    item.classList.add('completing');
    setTimeout(async () => {
      await fetch(`/api/reminders/${id}/complete`, { method: 'POST' });
      refreshData();
    }, 320);
  } else if (action === 'uncomplete') {
    await fetch(`/api/reminders/${id}/uncomplete`, { method: 'POST' });
    refreshData();
  } else if (action === 'edit') {
    editingIds.add(id);
    renderCurrentPage();
  } else if (action === 'cancel-edit') {
    editingIds.delete(id);
    renderCurrentPage();
  } else if (action === 'pick-priority') {
    const priority = Number(button.dataset.priority);
    item.dataset.priority = priority;
    item.querySelectorAll('.priority-pick').forEach((b) => b.classList.toggle('active', Number(b.dataset.priority) === priority));
  } else if (action === 'delete') {
    if (!confirm('¿Cancelar este recordatorio?')) return;
    await fetch(`/api/reminders/${id}`, { method: 'DELETE' });
    refreshData();
  } else if (action === 'postpone') {
    const minutes = Number(button.dataset.minutes);
    await fetch(`/api/reminders/${id}/postpone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ minutes }),
    });
    refreshData();
  } else if (action === 'toggle-subtasks') {
    if (expandedSubtaskIds.has(id)) expandedSubtaskIds.delete(id);
    else expandedSubtaskIds.add(id);
    renderCurrentPage();
  } else if (action === 'toggle-subtask-done') {
    const subtaskId = Number(button.dataset.subtaskId);
    const reminder = allReminders.find((r) => r.id === id);
    const subtask = reminder?.subtasks?.find((s) => s.id === subtaskId);
    if (!subtask) return;
    await fetch(`/api/subtasks/${subtaskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !subtask.done }),
    });
    await refreshSubtasksInPlace(id, item);
  } else if (action === 'delete-subtask') {
    const subtaskId = Number(button.dataset.subtaskId);
    await fetch(`/api/subtasks/${subtaskId}`, { method: 'DELETE' });
    await refreshSubtasksInPlace(id, item);
  } else if (action === 'add-subtask') {
    const input = item.querySelector('.new-subtask-input');
    const text = input.value.trim();
    if (!text) return;
    await fetch(`/api/reminders/${id}/subtasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    await refreshSubtasksInPlace(id, item);
  } else if (action === 'clear-due') {
    item.querySelector('.edit-due').value = '';
  } else if (action === 'save-edit') {
    const task = item.querySelector('.edit-task').value.trim();
    if (!task) return;
    // La fecha es opcional: dejarla vacia guarda la tarea sin fecha (vuelve a la Bandeja de entrada).
    const dueLocal = item.querySelector('.edit-due').value;

    const priority = Number(item.dataset.priority) || 4;
    const labelsRaw = item.querySelector('.edit-labels').value;
    const labels = [...new Set([...labelsRaw.matchAll(/@?([\p{L}0-9_-]+)/gu)].map((m) => m[1].toLowerCase()))];
    const projectSelect = item.querySelector('.edit-project');
    const projectId = projectSelect.value ? Number(projectSelect.value) : null;
    const description = item.querySelector('.edit-description').value.trim();

    await fetch(`/api/reminders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task,
        dueAt: dueLocal ? new Date(dueLocal).toISOString() : null,
        priority,
        labels,
        projectId,
        description,
      }),
    });
    editingIds.delete(id);
    refreshData();
  }
});

// ==================== Datos y navegacion por pestañas ====================

let allReminders = [];
let allProjects = [];
let currentPage = 'inbox';

const DAY_BUCKETS = ['Hoy', 'Mañana', 'Esta semana', 'Más adelante'];

function dayBucket(iso) {
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round((startOfDay(new Date(iso)) - startOfDay(new Date())) / 86400000);
  if (diffDays <= 0) return 'Hoy';
  if (diffDays === 1) return 'Mañana';
  if (diffDays <= 7) return 'Esta semana';
  return 'Más adelante';
}

// "Activa" = no completada (incluye tareas ya avisadas pero que el usuario no ha marcado como
// hechas, para que no desaparezcan solas de Hoy/Bandeja/Proximo al dispararse el aviso).
function pendingDated() {
  return allReminders.filter((r) => r.status !== 'done' && r.due_at);
}

function updateHeaderCounts() {
  const count = pendingDated().filter((r) => dayBucket(r.due_at) === 'Hoy').length;
  todayCountEl.textContent = count > 0 ? `${count} tarea${count === 1 ? '' : 's'} para hoy` : 'Sin tareas para hoy';
}

function renderInbox() {
  const items = allReminders
    .filter((r) => r.status !== 'done' && !r.due_at)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  renderList(
    document.getElementById('inboxList'),
    items,
    `<div class="empty-hero">
      <div class="icon-circle">${ICONS.inbox}</div>
      <p>Así funciona: di o escribe lo que quieras recordar. Si le pones fecha, te avisamos a tiempo. Si no, se queda aquí para que lo organices cuando quieras.</p>
    </div>`
  );
}

function renderTodayPage() {
  const items = pendingDated()
    .filter((r) => dayBucket(r.due_at) === 'Hoy')
    .sort((a, b) => new Date(a.due_at) - new Date(b.due_at));
  renderList(document.getElementById('todayList'), items, '<div class="empty">Sin tareas para hoy 🎉</div>');
}

let calendarViewDate = new Date();
let selectedDate = new Date();

function renderCalendar() {
  const year = calendarViewDate.getFullYear();
  const month = calendarViewDate.getMonth();

  document.getElementById('calMonthLabel').textContent = calendarViewDate.toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  });

  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = getWeekStart() === 'sunday' ? firstOfMonth.getDay() : (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const todayStr = new Date().toDateString();
  const selectedStr = selectedDate.toDateString();
  const datesWithTasks = new Set(pendingDated().map((r) => new Date(r.due_at).toDateString()));

  const cells = [];
  for (let i = startWeekday - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    cells.push({ day: d, date: new Date(year, month - 1, d), otherMonth: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, date: new Date(year, month, d), otherMonth: false });
  }
  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ day: nextDay, date: new Date(year, month + 1, nextDay), otherMonth: true });
    nextDay++;
  }

  document.getElementById('calGrid').innerHTML = cells
    .map((c) => {
      const classes = ['cal-day'];
      if (c.otherMonth) classes.push('other-month');
      if (c.date.toDateString() === todayStr) classes.push('is-today');
      if (c.date.toDateString() === selectedStr) classes.push('selected');
      const hasTasks = datesWithTasks.has(c.date.toDateString());
      return `<button class="${classes.join(' ')}" data-date="${c.date.toISOString()}">${c.day}${hasTasks ? '<span class="dot"></span>' : ''}</button>`;
    })
    .join('');
}

function renderUpcomingDayList() {
  document.getElementById('selectedDayLabel').textContent = selectedDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const dayStr = selectedDate.toDateString();
  const items = pendingDated()
    .filter((r) => new Date(r.due_at).toDateString() === dayStr)
    .sort((a, b) => new Date(a.due_at) - new Date(b.due_at));

  renderList(document.getElementById('upcomingDayList'), items, '<div class="empty">Nada para este día</div>');
}

document.getElementById('calPrev').addEventListener('click', () => {
  calendarViewDate = new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() - 1, 1);
  renderCalendar();
});
document.getElementById('calNext').addEventListener('click', () => {
  calendarViewDate = new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() + 1, 1);
  renderCalendar();
});
document.getElementById('calGrid').addEventListener('click', (e) => {
  const btn = e.target.closest('.cal-day');
  if (!btn) return;
  selectedDate = new Date(btn.dataset.date);
  renderCalendar();
  renderUpcomingDayList();
});

let exploreFilter = 'all';
let exploreProjectFilter = null;
const searchInput = document.getElementById('searchInput');
const exploreFiltersEl = document.getElementById('exploreFilters');
const exploreProjectFiltersEl = document.getElementById('exploreProjectFilters');

function renderExploreProjectFilters() {
  const pills = [
    `<button type="button" class="filter-pill${exploreProjectFilter === null ? ' active' : ''}" data-project="">Todos los proyectos</button>`,
  ].concat(
    allProjects.map(
      (p) =>
        `<button type="button" class="filter-pill${exploreProjectFilter === p.id ? ' active' : ''}" data-project="${p.id}">#${escapeHtml(p.name)}</button>`
    )
  );
  exploreProjectFiltersEl.innerHTML = allProjects.length > 0 ? pills.join('') : '';
}

function renderExplore() {
  const q = searchInput.value.trim().toLowerCase();
  let items = allReminders;
  if (exploreFilter === 'pending') items = items.filter((r) => r.status !== 'done');
  else if (exploreFilter === 'done') items = items.filter((r) => r.status === 'done');
  if (exploreProjectFilter !== null) items = items.filter((r) => r.project_id === exploreProjectFilter);
  if (q) {
    items = items.filter(
      (r) => r.task.toLowerCase().includes(q) || (r.original_text || '').toLowerCase().includes(q)
    );
  }
  items = [...items].sort((a, b) => new Date(b.due_at || b.created_at) - new Date(a.due_at || a.created_at));

  renderList(document.getElementById('exploreList'), items, '<div class="empty">Sin resultados</div>');
}

searchInput.addEventListener('input', renderExplore);
exploreFiltersEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-pill');
  if (!btn) return;
  exploreFilter = btn.dataset.filter;
  [...exploreFiltersEl.children].forEach((b) => b.classList.toggle('active', b === btn));
  renderExplore();
});
exploreProjectFiltersEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-pill');
  if (!btn) return;
  exploreProjectFilter = btn.dataset.project ? Number(btn.dataset.project) : null;
  renderExploreProjectFilters();
  renderExplore();
});

function renderCurrentPage() {
  if (currentPage === 'inbox') renderInbox();
  else if (currentPage === 'today') renderTodayPage();
  else if (currentPage === 'upcoming') {
    renderCalendar();
    renderUpcomingDayList();
  } else if (currentPage === 'explore') renderExplore();
  else if (currentPage === 'projects') renderProjectsPage();

  updateHeaderCounts();
}

function switchPage(page) {
  currentPage = page;
  document.querySelectorAll('.app-page').forEach((el) => {
    el.hidden = el.dataset.page !== page;
  });
  document.querySelectorAll('.nav-item').forEach((el) => {
    el.classList.toggle('active', el.dataset.page === page);
  });
  renderCurrentPage();
}

document.querySelectorAll('.nav-item').forEach((btn) => {
  btn.addEventListener('click', () => switchPage(btn.dataset.page));
});

async function refreshProjects() {
  try {
    const res = await fetch('/api/projects');
    allProjects = await res.json();
  } catch (err) {
    allProjects = [];
  }
}

async function refreshData() {
  try {
    const [reminders] = await Promise.all([fetch('/api/reminders').then((r) => r.json()), refreshProjects()]);
    allReminders = reminders;
  } catch (err) {
    allReminders = [];
  }
  renderCurrentPage();
  renderExploreProjectFilters();
}

// ==================== Leer tareas de hoy en voz alta ====================

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
  const today = pendingDated()
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

// ==================== Arranque ====================

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(() => {
    refreshPushButtonState();
  }).catch(() => {});
} else {
  pushToggle.disabled = true;
  obPushToggle.disabled = true;
}

if (localStorage.getItem('onboarded') === 'true') {
  applyProfileToUI();
  switchPage(getHomeView());
  refreshData();
}
