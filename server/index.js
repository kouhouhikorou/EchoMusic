import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import initSqlJs from 'sql.js'
import fs from 'fs'

const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'echomusic-secret-change-me'
const JWT_EXPIRES = '30d'

app.use(cors())
app.use(express.json({ limit: '1mb' }))

// ---- Database ----
let db
const DB_PATH = 'echomusic.db'

async function initDB() {
  const SQL = await initSqlJs()
  try {
    if (fs.existsSync(DB_PATH)) {
      const buf = fs.readFileSync(DB_PATH)
      db = new SQL.Database(buf)
    } else {
      db = new SQL.Database()
    }
  } catch {
    db = new SQL.Database()
  }
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at INTEGER
    )
  `)
  db.run(`
    CREATE TABLE IF NOT EXISTS favorites (
      user_id TEXT NOT NULL,
      song_id TEXT NOT NULL,
      song_data TEXT NOT NULL,
      created_at INTEGER,
      PRIMARY KEY (user_id, song_id)
    )
  `)
  db.run(`
    CREATE TABLE IF NOT EXISTS playlists (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      songs_data TEXT DEFAULT '[]',
      created_at INTEGER,
      updated_at INTEGER
    )
  `)
  db.run(`
    CREATE TABLE IF NOT EXISTS recent_plays (
      user_id TEXT NOT NULL,
      song_id TEXT NOT NULL,
      song_data TEXT NOT NULL,
      played_at INTEGER,
      PRIMARY KEY (user_id, song_id)
    )
  `)
}

function saveDB() {
  const data = db.export()
  const buf = Buffer.from(data)
  fs.writeFileSync(DB_PATH, buf)
}

// Helper: run SQL with params, return rows
function query(sql, params = []) {
  const stmt = db.prepare(sql)
  if (params.length) stmt.bind(params)
  const rows = []
  while (stmt.step()) rows.push(stmt.getAsObject())
  stmt.free()
  return rows
}

function run(sql, params = []) {
  db.run(sql, params)
  saveDB()
}

// ---- Start server after DB init ----
await initDB()

// ---- Auth middleware ----
function auth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: '未登录' })
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.userId = payload.id
    next()
  } catch {
    res.status(401).json({ error: '登录已过期' })
  }
}

// ---- Auth routes ----
app.post('/auth/register', (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ error: '请填写用户名和密码' })
  if (password.length < 6) return res.status(400).json({ error: '密码至少6位' })

  const rows = query('SELECT id FROM users WHERE username = ?', [username])
  if (rows.length) return res.status(409).json({ error: '用户名已存在' })

  const id = 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
  const passwordHash = bcrypt.hashSync(password, 10)
  run('INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)', [id, username, passwordHash])

  const token = jwt.sign({ id, username }, JWT_SECRET, { expiresIn: JWT_EXPIRES })
  res.json({ token, user: { id, username } })
})

app.post('/auth/login', (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ error: '请填写用户名和密码' })

  const rows = query('SELECT * FROM users WHERE username = ?', [username])
  if (!rows.length) return res.status(401).json({ error: '账号不存在' })
  const user = rows[0]
  if (!bcrypt.compareSync(password, user.password_hash)) return res.status(401).json({ error: '密码错误' })

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES })
  res.json({ token, user: { id: user.id, username: user.username } })
})

// ---- Sync routes ----
app.get('/sync/favorites', auth, (req, res) => {
  const rows = query('SELECT song_id, song_data FROM favorites WHERE user_id = ? ORDER BY created_at DESC', [req.userId])
  res.json({ songs: rows.map(r => JSON.parse(r.song_data)) })
})

app.post('/sync/favorites', auth, (req, res) => {
  const { songs } = req.body
  if (!Array.isArray(songs)) return res.status(400).json({ error: '数据格式错误' })
  run('DELETE FROM favorites WHERE user_id = ?', [req.userId])
  for (const s of songs) run('INSERT OR REPLACE INTO favorites (user_id, song_id, song_data) VALUES (?, ?, ?)', [req.userId, s.id + '_' + (s.source || ''), JSON.stringify(s)])
  res.json({ ok: true, count: songs.length })
})

app.get('/sync/playlists', auth, (req, res) => {
  const rows = query('SELECT * FROM playlists WHERE user_id = ? ORDER BY updated_at DESC', [req.userId])
  res.json({ playlists: rows.map(r => ({
    id: r.id, name: r.name, description: r.description,
    songs: JSON.parse(r.songs_data), created: r.created_at, updated: r.updated_at,
    source: 'local',
  }))})
})

app.post('/sync/playlists', auth, (req, res) => {
  const { playlists } = req.body
  if (!Array.isArray(playlists)) return res.status(400).json({ error: '数据格式错误' })
  run('DELETE FROM playlists WHERE user_id = ?', [req.userId])
  for (const pl of playlists) run('INSERT OR REPLACE INTO playlists (id, user_id, name, description, songs_data, updated_at) VALUES (?, ?, ?, ?, ?, ?)', [pl.id, req.userId, pl.name, pl.description || '', JSON.stringify(pl.songs || []), Date.now()])
  res.json({ ok: true, count: playlists.length })
})

app.get('/sync/recent', auth, (req, res) => {
  const rows = query('SELECT song_id, song_data FROM recent_plays WHERE user_id = ? ORDER BY played_at DESC LIMIT 200', [req.userId])
  res.json({ songs: rows.map(r => JSON.parse(r.song_data)) })
})

app.post('/sync/recent', auth, (req, res) => {
  const { songs } = req.body
  if (!Array.isArray(songs)) return res.status(400).json({ error: '数据格式错误' })
  for (const s of songs) run('INSERT OR REPLACE INTO recent_plays (user_id, song_id, song_data, played_at) VALUES (?, ?, ?, ?)', [req.userId, s.id + '_' + (s.source || ''), JSON.stringify(s), Date.now()])
  res.json({ ok: true, count: songs.length })
})

// ---- Health check ----
app.get('/health', (req, res) => res.json({ ok: true, time: Date.now() }))

app.listen(PORT, () => console.log(`EchoMusic Server running on port ${PORT}`))
