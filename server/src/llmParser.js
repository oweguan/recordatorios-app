import 'dotenv/config';

const GROQ_MODEL = 'llama-3.3-70b-versatile';
const TIMEZONE = 'Europe/Madrid';

function formatInTimeZone(date, timeZone) {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(date).map((p) => [p.type, p.value]));
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`;
}

// Convierte una fecha/hora "ingenua" (sin zona horaria) interpretada como hora local
// de Madrid al instante UTC real correspondiente, respetando el horario de verano.
function zonedNaiveToUtc(naiveIso, timeZone) {
  const guess = new Date(`${naiveIso}Z`);
  const utcRepr = new Date(guess.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzRepr = new Date(guess.toLocaleString('en-US', { timeZone }));
  const offset = tzRepr.getTime() - utcRepr.getTime();
  return new Date(guess.getTime() - offset);
}

const SYSTEM_PROMPT = `Eres un extractor de datos para una app de recordatorios personales en espanol.
A partir del texto del usuario, devuelve SOLO un objeto JSON (sin texto adicional, sin markdown) con estos campos exactos:
- task: string, la tarea o accion a recordar, SIN las partes de fecha, hora, recurrencia o antelacion.
- dueAt: string "YYYY-MM-DDTHH:mm:ss" en hora local de Madrid (SIN zona horaria ni sufijo Z), la fecha y hora exacta del recordatorio. Si el usuario no da ninguna pista de fecha u hora, usa null.
- recurrence: uno de "daily", "weekly", "monthly", o null si no es recurrente.
- leadMinutes: numero entero de minutos de antelacion con los que avisar antes de dueAt (0 si no se especifica antelacion explicita, por ejemplo "avisame 20 minutos antes").

Resuelve expresiones relativas (manana, la semana que viene, en 20 minutos, el jueves, todos los lunes, el dia 1 de cada mes, etc.) usando como referencia la fecha y hora actual que se te da en el mensaje del usuario (se incluye el dia de la semana de esa referencia para que puedas contar los dias correctamente).

Reglas importantes:
- El resultado de dueAt SIEMPRE debe ser posterior a la fecha/hora de referencia. Si la hora mencionada ya paso hoy, usa la proxima ocurrencia futura (manana si es una hora del dia, o la proxima semana si es un dia que ya paso esta semana).
- Cuenta los dias de la semana con cuidado a partir del dia de la semana de referencia indicado.
- No incluyas explicaciones ni comentarios, solo el JSON.`;

export async function parseWithLLM(text, referenceDate = new Date()) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY no configurada');
  }

  const nowLocal = formatInTimeZone(referenceDate, TIMEZONE);
  const weekday = new Intl.DateTimeFormat('es-ES', { timeZone: TIMEZONE, weekday: 'long' }).format(referenceDate);
  const userMessage = `Fecha y hora actual de referencia (Madrid): ${nowLocal} (${weekday})\n\nTexto del usuario: "${text}"`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      response_format: { type: 'json_object' },
      temperature: 0,
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    throw new Error(`Groq API error: ${res.status}`);
  }

  const data = await res.json();
  const parsed = JSON.parse(data.choices[0].message.content);

  if (!parsed.dueAt) {
    return {
      task: (parsed.task || text).trim(),
      dueAt: null,
      notifyAt: null,
      leadMinutes: 0,
      recurrence: null,
      matchedText: null,
    };
  }

  const dueAt = zonedNaiveToUtc(parsed.dueAt, TIMEZONE);
  if (Number.isNaN(dueAt.getTime())) {
    throw new Error('dueAt invalido devuelto por el modelo');
  }

  const leadMinutes = Number.isFinite(parsed.leadMinutes) ? Math.max(0, parsed.leadMinutes) : 0;
  const notifyAt = new Date(dueAt.getTime() - leadMinutes * 60000);
  const recurrence = ['daily', 'weekly', 'monthly'].includes(parsed.recurrence) ? parsed.recurrence : null;

  return {
    task: (parsed.task || text).trim(),
    dueAt,
    notifyAt,
    leadMinutes,
    recurrence,
    matchedText: 'interpretado por IA',
  };
}
