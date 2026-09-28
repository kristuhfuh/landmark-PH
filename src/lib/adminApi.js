const API_BASE = (import.meta.env?.VITE_API_URL ?? (import.meta.env?.DEV ? 'http://localhost:4000' : '')).replace(/\/+$/, '')
const TOKEN_KEY = 'landmark.admin.token'

export function getToken() {
  return typeof window !== 'undefined' ? window.localStorage.getItem(TOKEN_KEY) : null
}
export function setToken(t) {
  if (typeof window === 'undefined') return
  if (t) window.localStorage.setItem(TOKEN_KEY, t)
  else window.localStorage.removeItem(TOKEN_KEY)
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const t = getToken()
    if (t) headers.Authorization = `Bearer ${t}`
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const ct = res.headers.get('content-type') || ''
  const payload = ct.includes('application/json') ? await res.json() : null
  if (!res.ok) {
    const err = new Error(payload?.error || `HTTP ${res.status}`)
    err.status = res.status
    err.payload = payload
    throw err
  }
  return payload
}

export const api = {
  login: (email, password) =>
    request('/api/auth/login', { method: 'POST', body: { email, password }, auth: false }),
  me: () => request('/api/auth/me'),
  changePassword: (newPassword) =>
    request('/api/auth/password', { method: 'POST', body: { newPassword } }),

  listCollections: () => request('/api/admin/collections'),
  listCollection: (key) => request(`/api/admin/collections/${key}`),
  createRow: (key, row) =>
    request(`/api/admin/collections/${key}`, { method: 'POST', body: row }),
  updateRow: (key, id, row) =>
    request(`/api/admin/collections/${key}/${id}`, { method: 'PUT', body: row }),
  deleteRow: (key, id) =>
    request(`/api/admin/collections/${key}/${id}`, { method: 'DELETE' }),
  reorder: (key, order) =>
    request(`/api/admin/collections/${key}/reorder`, { method: 'POST', body: { order } }),

  listSettings: () => request('/api/admin/settings'),
  getSetting: (section) => request(`/api/admin/settings/${section}`),
  saveSetting: (section, value) =>
    request(`/api/admin/settings/${section}`, { method: 'PUT', body: { value } }),

  listBookings: (status) =>
    request(`/api/bookings${status ? `?status=${status}` : ''}`),
  updateBooking: (id, patch) =>
    request(`/api/bookings/${id}`, { method: 'PATCH', body: patch }),
  deleteBooking: (id) =>
    request(`/api/bookings/${id}`, { method: 'DELETE' }),
}
