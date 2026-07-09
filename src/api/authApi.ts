import axios from 'axios'

let serverUrl = localStorage.getItem('echomusic-server-url') || 'http://localhost:3001'

export function setServerUrl(url: string) { serverUrl = url; localStorage.setItem('echomusic-server-url', url) }
export function getServerUrl(): string { return serverUrl }

function localHash(str: string): string {
  let h = 0; for (let i = 0; i < str.length; i++) { h = ((h << 5) - h) + str.charCodeAt(i); h |= 0 }
  return 'l_' + Math.abs(h).toString(36)
}

// ---- Auth (server-first, local fallback) ----
export async function register(username: string, password: string) {
  try {
    const { data } = await axios.post(`${serverUrl}/auth/register`, { username, password }, { timeout: 5000 })
    if (data.token) {
      localStorage.setItem('echomusic-token', data.token)
      localStorage.setItem('echomusic-user', JSON.stringify(data.user))
    }
    return data.user
  } catch (e: any) {
    if (e?.response?.status) throw e
    const users = JSON.parse(localStorage.getItem('echomusic-users') || '{}')
    if (users[username]) throw new Error('用户名已存在（离线模式）')
    users[username] = { username, passwordHash: localHash(password), createdAt: Date.now() }
    localStorage.setItem('echomusic-users', JSON.stringify(users))
    const user = { id: 'local-' + Date.now().toString(36), username }
    localStorage.setItem('echomusic-token', username)
    localStorage.setItem('echomusic-user', JSON.stringify(user))
    return user
  }
}

export async function login(username: string, password: string) {
  try {
    const { data } = await axios.post(`${serverUrl}/auth/login`, { username, password }, { timeout: 5000 })
    if (data.token) {
      localStorage.setItem('echomusic-token', data.token)
      localStorage.setItem('echomusic-user', JSON.stringify(data.user))
    }
    return data.user
  } catch (e: any) {
    if (e?.response?.status) throw e
    const users = JSON.parse(localStorage.getItem('echomusic-users') || '{}')
    const user = users[username]
    if (!user) throw new Error('账号不存在（离线模式）')
    if (user.passwordHash !== localHash(password)) throw new Error('密码错误（离线模式）')
    const u = { id: 'local-' + Date.now().toString(36), username }
    localStorage.setItem('echomusic-token', username)
    localStorage.setItem('echomusic-user', JSON.stringify(u))
    return u
  }
}

export function logout() { localStorage.removeItem('echomusic-token'); localStorage.removeItem('echomusic-user') }
export function getToken(): string | null { return localStorage.getItem('echomusic-token') }
export function getUser(): { id: string; username: string } | null {
  try { const u = localStorage.getItem('echomusic-user'); return u ? JSON.parse(u) : null } catch { return null }
}
export function isLoggedIn(): boolean { return !!getToken() }

function authHeaders() { const t = getToken(); return t ? { Authorization: `Bearer ${t}` } : {} }

export async function syncFavorites(songs: any[]) { if (!isLoggedIn()) return; try { await axios.post(`${serverUrl}/sync/favorites`, { songs }, { headers: authHeaders() }) } catch {} }
export async function loadFavorites(): Promise<any[]> { if (!isLoggedIn()) return []; try { const { data } = await axios.get(`${serverUrl}/sync/favorites`, { headers: authHeaders() }); return data.songs || [] } catch { return [] } }
export async function syncPlaylists(playlists: any[]) { if (!isLoggedIn()) return; try { await axios.post(`${serverUrl}/sync/playlists`, { playlists }, { headers: authHeaders() }) } catch {} }
export async function loadPlaylists(): Promise<any[]> { if (!isLoggedIn()) return []; try { const { data } = await axios.get(`${serverUrl}/sync/playlists`, { headers: authHeaders() }); return data.playlists || [] } catch { return [] } }
export async function syncRecent(songs: any[]) { if (!isLoggedIn()) return; try { await axios.post(`${serverUrl}/sync/recent`, { songs }, { headers: authHeaders() }) } catch {} }
export async function loadRecent(): Promise<any[]> { if (!isLoggedIn()) return []; try { const { data } = await axios.get(`${serverUrl}/sync/recent`, { headers: authHeaders() }); return data.songs || [] } catch { return [] } }
