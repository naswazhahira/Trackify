const API_BASE = 'http://localhost:3000/api/users';

export async function apiRequest(endpoint, method = 'GET', body = null) {
  const token = localStorage.getItem('token');

  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });

  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}
