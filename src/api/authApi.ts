import axios from 'axios'

let serverUrl = localStorage.getItem('echomusic-server-url') || 'http://localhost:3001'

export function setServerUrl(url: string) {
  serverUrl = url
  localStorage.setItem('echomusic-server-url', url)
}

export function getServerUrl(): string {
  return serverUrl
}

// ---- Auth (server-first, local fallback) ----
function localHash(str: string): string {
  let h = 0; for (let i = 0; i < str.length; i++) { h = ((h << 5) - h) + str.charCodeAt(i); h |= 0 }
  return 'l_' + Math.abs(h).toString(36)
}

export async function register(username: string, email: string, password: string) {
  // Try server first
  try {
    const { data } = await axios.post(`${serverUrl}/auth/register`, { username, email, password }, { timeout: 5000 })
    if (data.token) {
      localStorage.setItem('echomusic-token', data.token)
      localStorage.setItem('echomusic-user', JSON.stringify(data.user))
    }
    return data.user
  } catch (e: any) {
    if (e?.response?.status) throw e // Server responded with error (duplicate email, etc)
    // Server unreachable → local fallback
    const users = JSON.parse(localStorage.getItem('echomusic-users') || '{}')
    if (users[email]) throw new Error('该邮箱已注册（离线模式）')
    users[email] = { username, email, passwordHash: localHash(password), createdAt: Date.now() }
    localStorage.setItem('echomusic-users', JSON.stringify(users))
    const user = { id: 'local-' + Date.now().toString(36), username, email }
    localStorage.setItem('echomusic-token', email)
    localStorage.setItem('echomusic-user', JSON.stringify(user))
    return user
  }
}

export async function login(email: string, password: string) {
  // Try server first
  try {
    const { data } = await axios.post(`${serverUrl}/auth/login`, { email, password }, { timeout: 5000 })
    if (data.token) {
      localStorage.setItem('echomusic-token', data.token)
      localStorage.setItem('echomusic-user', JSON.stringify(data.user))
    }
    return data.user
  } catch (e: any) {
    if (e?.response?.status) throw e // Server responded with error (wrong password, etc)
    // Server unreachable → local fallback
    const users = JSON.parse(localStorage.getItem('echomusic-users') || '{}')
    const user = users[email]
    if (!user) throw new Error('账号不存在（离线模式）')
    if (user.passwordHash !== localHash(password)) throw new Error('密码错误（离线模式）')
    const u = { id: 'local-' + Date.now().toString(36), username: user.username, email }
    localStorage.setItem('echomusic-token', email)
    localStorage.setItem('echomusic-user', JSON.stringify(u))
    return u
  }
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
