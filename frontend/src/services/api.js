const API_BASE_URL = import.meta.env.VITE_API_URL || '';

async function handleResponse(response) {
  if (!response.ok) {
    let errorMsg = `Server error (${response.status})`;
    try {
      const errData = await response.json();
      errorMsg = errData.detail || errData.message || errData.error || errorMsg;
    } catch (e) {
      // Ignore JSON parse error
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function fetchHealthStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    return await handleResponse(res);
  } catch (err) {
    console.error("Health check failed:", err);
    return { status: "offline", api_key_configured: false, model: "N/A", database: "Disconnected" };
  }
}

export async function generateEmail(data) {
  const res = await fetch(`${API_BASE_URL}/api/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function generateReport(data) {
  const res = await fetch(`${API_BASE_URL}/api/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function generateExplanation(data) {
  const res = await fetch(`${API_BASE_URL}/api/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function generateImprovement(data) {
  const res = await fetch(`${API_BASE_URL}/api/improve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function generatePrompt(data) {
  const res = await fetch(`${API_BASE_URL}/api/prompt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function fetchHistory() {
  const res = await fetch(`${API_BASE_URL}/api/history`);
  return handleResponse(res);
}

export async function deleteHistoryItem(id) {
  const res = await fetch(`${API_BASE_URL}/api/history/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
}

export async function clearAllHistory() {
  const res = await fetch(`${API_BASE_URL}/api/history`, {
    method: 'DELETE',
  });
  return handleResponse(res);
}
