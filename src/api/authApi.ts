import axios from 'axios'

let serverUrl = localStorage.getItem('echomusic-server-url') || 'http://localhost:3001'

export function setServerUrl(url: string) {
  serverUrl = url
  localStorage.setItem('echomusic-server-url', url)
}

export function getServerUrl(): string {
  return serverUrl
}

// ---- Auth ----
export async function register(username: string, email: string, password: string) {
  const { data } = await axios.post(`${serverUrl}/auth/register`, { username, email, password })
  if (data.token) {
    localStorage.setItem('echomusic-token', data.token)
    localStorage.setItem('echomusic-user', JSON.stringify(data.user))
  }
  return data.user
}

export async function login(email: string, password: string) {
  const { data } = await axios.post(`${serverUrl}/auth/login`, { email, password })
  if (data.token) {
    localStorage.setItem('echomusic-token', data.token)
    localStorage.setItem('echomusic-user', JSON.stringify(data.user))
  }
  return data.user
}

export function logout() {
  localStorage.removeItem('echomusic-token')
  localStorage.removeItem('echomusic-user')
}

export function getToken(): string | null {
  return localStorage.getItem('echomusic-token')
}

export function getUser(): { id: string; username: string; email: string } | null {
  try {
    const u = localStorage.getItem('echomusic-user')
    return u ? JSON.parse(u) : null
  } catch { return null }
}

export function isLoggedIn(): boolean {
  return !!getToken()
}

// ---- Sync helpers ----
function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Favorites
export async function syncFavorites(songs: any[]) {
  if (!isLoggedIn()) return
  try { await axios.post(`${serverUrl}/sync/favorites`, { songs }, { headers: authHeaders() }) } catch {}
}

export async function loadFavorites(): Promise<any[]> {
  if (!isLoggedIn()) return []
  try {
    const { data } = await axios.get(`${serverUrl}/sync/favorites`, { headers: authHeaders() })
    return data.songs || []
  } catch { return [] }
}

// Playlists
export async function syncPlaylists(playlists: any[]) {
  if (!isLoggedIn()) return
  try { await axios.post(`${serverUrl}/sync/playlists`, { playlists }, { headers: authHeaders() }) } catch {}
}

export async function loadPlaylists(): Promise<any[]> {
  if (!isLoggedIn()) return []
  try {
    const { data } = await axios.get(`${serverUrl}/sync/playlists`, { headers: authHeaders() })
    return data.playlists || []
  } catch { return [] }
}

// Recent plays
export async function syncRecent(songs: any[]) {
  if (!isLoggedIn()) return
  try { await axios.post(`${serverUrl}/sync/recent`, { songs }, { headers: authHeaders() }) } catch {}
}

export async function loadRecent(): Promise<any[]> {
  if (!isLoggedIn()) return []
  try {
    const { data } = await axios.get(`${serverUrl}/sync/recent`, { headers: authHeaders() })
    return data.songs || []
  } catch { return [] }
}
