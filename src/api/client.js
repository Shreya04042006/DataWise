const API_BASE_URL = String(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

export { API_BASE_URL };

async function readJson(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('The backend returned a response that is not valid JSON.');
  }
}

function errorFromPayload(payload, fallback) {
  if (!payload || typeof payload !== 'object') return fallback;
  if (typeof payload.message === 'string' && payload.message.trim()) return payload.message;
  if (typeof payload.detail === 'string' && payload.detail.trim()) return payload.detail;
  if (Array.isArray(payload.detail) && payload.detail[0]?.msg) return payload.detail[0].msg;
  return fallback;
}

export async function getHealth() {
  const response = await fetch(`${API_BASE_URL}/api/health`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  const payload = await readJson(response);
  if (!response.ok) {
    throw new Error(errorFromPayload(payload, `Health check failed (${response.status}).`));
  }
  return payload;
}

export async function searchMedicines(query) {
  const response = await fetch(`${API_BASE_URL}/api/search`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });
  const payload = await readJson(response);
  if (!response.ok) {
    throw new Error(errorFromPayload(payload, `Search failed (${response.status}).`));
  }
  return payload;
}
