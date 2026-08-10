import 'dotenv/config';

const GROQ_WHISPER_MODEL = 'whisper-large-v3-turbo';

export async function transcribeAudio(buffer, filename, mimeType) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY no configurada');
  }

  const form = new FormData();
  form.append('file', new Blob([buffer], { type: mimeType || 'audio/webm' }), filename || 'audio.webm');
  form.append('model', GROQ_WHISPER_MODEL);
  form.append('language', 'es');

  const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
    signal: AbortSignal.timeout(20000),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Groq transcription error: ${res.status} ${errText}`);
  }

  const data = await res.json();
  return (data.text || '').trim();
}
