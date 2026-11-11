const API_BASE = (process.env.REACT_APP_API_URL || "http://localhost:4000/api").replace(/\/$/, "");

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, options);
  } catch {
    throw new Error("Impossible de joindre le serveur. Vérifiez que l’API est démarrée.");
  }
  if (!response.ok) {
    let message = `La requête a échoué (HTTP ${response.status}).`;
    try { message = (await response.json()).message || message; } catch { /* réponse non JSON */ }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return response;
}

export async function getPrefix(number) {
  return (await request(`/prefixes/${encodeURIComponent(number)}`)).json();
}

export async function getArcepAllocation(number) {
  return (await request(`/arcep/lookup/${encodeURIComponent(number)}`)).json();
}
