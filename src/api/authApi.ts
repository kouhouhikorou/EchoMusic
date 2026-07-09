// Simple local auth — stores credentials in localStorage
// Backend API integration (Phase 3) will replace this

function hash(str: string): string {
  // Simple hash for local storage (NOT for production)
  let h = 0
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i)
    h = ((h << 5) - h) + c
    h |= 0
  }
  return 'echo_' + Math.abs(h).toString(36)
}

export async function register(username: string, email: string, password: string) {
  const users = JSON.parse(localStorage.getItem('echomusic-users') || '{}')
  if (users[email]) throw new Error('该邮箱已注册')
  users[email] = { username, email, passwordHash: hash(password), createdAt: Date.now() }
  localStorage.setItem('echomusic-users', JSON.stringify(users))

  // Auto login after register
  localStorage.setItem('echomusic-token', email)
  localStorage.setItem('echomusic-user', JSON.stringify({ username, email }))
}

export async function login(email: string, password: string) {
  const users = JSON.parse(localStorage.getItem('echomusic-users') || '{}')
  const user = users[email]
  if (!user) throw new Error('账号不存在')
  if (user.passwordHash !== hash(password)) throw new Error('密码错误')

  localStorage.setItem('echomusic-token', email)
  localStorage.setItem('echomusic-user', JSON.stringify({ username: user.username, email: user.email }))
}

export function logout() {
  localStorage.removeItem('echomusic-token')
  localStorage.removeItem('echomusic-user')
}

export function getToken(): string | null {
  return localStorage.getItem('echomusic-token')
}

export function getUser(): { username: string; email: string } | null {
  try {
    const u = localStorage.getItem('echomusic-user')
    return u ? JSON.parse(u) : null
  } catch { return null }
}

export function isLoggedIn(): boolean {
  return !!getToken()
}
