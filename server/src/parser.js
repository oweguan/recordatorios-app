import * as chrono from 'chrono-node';

const LEADING_TRIGGER = /^(recu[ée]rdame|av[ií]same|acu[ée]rdate)( que| de)?\s+/i;
const DANGLING_FILLERS = /\b(de la ma[ñn]ana|de la tarde|de la noche)\b/gi;
const LEAD_TIME = /\b(\d+|media|un|una|dos|tres|cuatro|cinco)\s+(minutos?|horas?)\s+antes\s*(de\s*)?\b/i;
const LEAD_TIME_WORDS = { media: 0.5, un: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5 };

// chrono-node no liga bien "las 6 de la tarde" como una sola expresion: lo normaliza a "18:00" antes de parsear.
const TIME_OF_DAY_SUFFIX = /\b(\d{1,2})(:\d{2})?\s+de la (tarde|noche)\b/gi;

function normalizeTimeOfDay(text) {
  return text.replace(TIME_OF_DAY_SUFFIX, (_match, hour, minutes) => {
    let h = parseInt(hour, 10);
    if (h < 12) h += 12;
    const mm = minutes ? minutes.slice(1) : '00';
    return `${h}:${mm}`;
  });
}

function cleanTask(raw) {
  return raw
    .replace(DANGLING_FILLERS, '')
    .replace(/\s+/g, ' ')
    .replace(/^(que|de|el|la|para|a las)\s+/i, '')
    .replace(/\s+(a|de|para|el|la)\s*$/i, '')
    .replace(/\s+([,.])/g, '$1')
    .trim();
}

// Detecta frases como "20 minutos antes" o "media hora antes" y las separa del resto del texto.
function extractLeadTime(text) {
  const match = text.match(LEAD_TIME);
  if (!match) {
    return { leadMinutes: 0, text };
  }

  const rawValue = match[1].toLowerCase();
  const value = LEAD_TIME_WORDS[rawValue] ?? parseInt(rawValue, 10);
  const isHours = /hora/i.test(match[2]);
  const leadMinutes = Math.round(value * (isHours ? 60 : 1));

  const cleanedText = (text.slice(0, match.index) + text.slice(match.index + match[0].length))
    .replace(/\s+/g, ' ')
    .trim();

  return { leadMinutes, text: cleanedText };
}

// Extrae la fecha/hora de un texto en espanol y devuelve la tarea limpia (sin la parte de fecha).
export function parseReminderText(text, referenceDate = new Date()) {
  const withoutTrigger = text.replace(LEADING_TRIGGER, '');
  const { leadMinutes, text: withoutLeadTime } = extractLeadTime(withoutTrigger);
  const normalized = normalizeTimeOfDay(withoutLeadTime);

  const results = chrono.es.parse(normalized, referenceDate, { forwardDate: true });

  if (results.length === 0) {
    return { task: cleanTask(normalized), dueAt: null, notifyAt: null, leadMinutes, matchedText: null };
  }

  const match = results[0];
  const dueAt = match.start.date();
  const notifyAt = new Date(dueAt.getTime() - leadMinutes * 60000);

  const remaining = normalized.slice(0, match.index) + normalized.slice(match.index + match.text.length);
  const task = cleanTask(remaining);

  return {
    task: task || cleanTask(normalized),
    dueAt,
    notifyAt,
    leadMinutes,
    matchedText: match.text,
  };
}
