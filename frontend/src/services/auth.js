const BASE = import.meta.env.VITE_API_URL ?? ''

async function request(path, options = {}) {
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }
  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.errors?.[0] || data.error || `Erreur ${res.status}`)
  return { data, headers: res.headers }
}

export async function signup({ email, username, password }) {
  const { data, headers } = await request('/api/v1/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ user: { email, username, password } }),
  })
  const token = headers.get('Authorization')?.replace('Bearer ', '')
  if (token) localStorage.setItem('token', token)
  return data
}

export async function login({ email, password }) {
  const { data, headers } = await request('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ user: { email, password } }),
  })
  const token = headers.get('Authorization')?.replace('Bearer ', '')
  if (token) localStorage.setItem('token', token)
  return data
}

export async function logout() {
  await request('/api/v1/auth/logout', { method: 'DELETE' }).catch(() => {})
  localStorage.removeItem('token')
}

export async function getMe() {
  const { data } = await request('/api/v1/me')
  return data
}

export function getToken() {
  return localStorage.getItem('token')
}
