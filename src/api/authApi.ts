import axios from 'axios'

const authApi = axios.create({
  timeout: 10000,
})

function getApiUrl(): string {
  return localStorage.getItem('echomusic-api-url') || 'https://echomusic-api.vercel.app'
}

// ---- Phase 3: Account system (placeholder for now) ----

export async function register(username: string, email: string, password: string) {
  const baseUrl = getApiUrl()
  try {
    const { data } = await authApi.post(`${baseUrl}/auth/register`, {
      username, email, password,
    })
    return data
  } catch {
    throw new Error('注册失败，请稍后重试')
  }
}

export async function login(email: string, password: string) {
  const baseUrl = getApiUrl()
  try {
    const { data } = await authApi.post(`${baseUrl}/auth/login`, {
      email, password,
    })
    if (data.token) {
      localStorage.setItem('echomusic-token', data.token)
      localStorage.setItem('echomusic-refresh-token', data.refreshToken)
    }
    return data
  } catch {
    throw new Error('登录失败，请检查邮箱和密码')
  }
}

export async function refreshToken() {
  const baseUrl = getApiUrl()
  const refreshToken = localStorage.getItem('echomusic-refresh-token')
  if (!refreshToken) return null

  try {
    const { data } = await authApi.post(`${baseUrl}/auth/refresh`, { refreshToken })
    if (data.token) {
      localStorage.setItem('echomusic-token', data.token)
    }
    return data.token
  } catch {
    localStorage.removeItem('echomusic-token')
    localStorage.removeItem('echomusic-refresh-token')
    return null
  }
}

export function logout() {
  localStorage.removeItem('echomusic-token')
  localStorage.removeItem('echomusic-refresh-token')
  window.location.reload()
}

export function getToken(): string | null {
  return localStorage.getItem('echomusic-token')
}
