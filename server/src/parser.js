import * as chrono from 'chrono-node';

const LEADING_TRIGGER = /^(recu[ée]rdame|av[ií]same|acu[ée]rdate)( que| de)?\s+/i;
const DANGLING_FILLERS = /\b(de la ma[ñn]ana|de la tarde|de la noche)\b/gi;

function cleanTask(raw) {
  return raw
    .replace(DANGLING_FILLERS, '')
    .replace(/\s+/g, ' ')
    .replace(/^(que|de|el|la|para|a las)\s+/i, '')
    .replace(/\s+([,.])/g, '$1')
    .trim();
}

// Extrae la fecha/hora de un texto en espanol y devuelve la tarea limpia (sin la parte de fecha).
export function parseReminderText(text, referenceDate = new Date()) {
  const withoutTrigger = text.replace(LEADING_TRIGGER, '');

  const results = chrono.es.parse(withoutTrigger, referenceDate, { forwardDate: true });

  if (results.length === 0) {
    return { task: cleanTask(withoutTrigger), dueAt: null, matchedText: null };
  }

  const match = results[0];
  const dueAt = match.start.date();

  const remaining = withoutTrigger.slice(0, match.index) + withoutTrigger.slice(match.index + match.text.length);
  const task = cleanTask(remaining);

  return {
    task: task || cleanTask(withoutTrigger),
    dueAt,
    matchedText: match.text,
  };
}
