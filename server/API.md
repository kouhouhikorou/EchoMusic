# EchoMusic Server API

Base URL: `http://localhost:3001`

---

## 账号认证

### 注册
```
POST /auth/register
Content-Type: application/json

{
  "username": "string",   // 必填
  "email": "string",      // 必填，唯一
  "password": "string"    // 必填，至少 6 位
}
```

**成功响应 (200)**
```json
{
  "token": "eyJhbG...",
  "user": { "id": "u_xxx", "username": "test", "email": "test@test.com" }
}
```

**错误**
```json
{ "error": "该邮箱已注册" }      // 409
{ "error": "请填写完整信息" }     // 400
{ "error": "密码至少6位" }       // 400
```

---

### 登录
```
POST /auth/login
Content-Type: application/json

{
  "email": "string",      // 必填
  "password": "string"    // 必填
}
```

**成功响应 (200)**
```json
{
  "token": "eyJhbG...",
  "user": { "id": "u_xxx", "username": "test", "email": "test@test.com" }
}
```

**错误**
```json
{ "error": "账号不存在" }        // 401
{ "error": "密码错误" }          // 401
```

---

## 数据同步 (需要登录)

所有接口需携带 Header：
```
Authorization: Bearer <token>
```

### 收藏 — 拉取
```
GET /sync/favorites
Authorization: Bearer <token>
```
**响应**
```json
{
  "songs": [
    {
      "id": "12345",
      "title": "歌曲名",
      "artist": "歌手",
      "album": "专辑",
      "cover": "https://...",
      "url": "https://...",
      "duration": 240,
      "lyric": "...",
      "source": "netease"
    }
  ]
}
```

### 收藏 — 推送
```
POST /sync/favorites
Authorization: Bearer <token>
Content-Type: application/json

{ "songs": [...] }
```
**响应**
```json
{ "ok": true, "count": 10 }
```

---

### 歌单 — 拉取
```
GET /sync/playlists
Authorization: Bearer <token>
```
**响应**
```json
{
  "playlists": [
    {
      "id": "local-xxx",
      "name": "我的歌单",
      "description": "",
      "songs": [...],
      "created": 1783000000,
      "updated": 1783000000,
      "source": "local"
    }
  ]
}
```

### 歌单 — 推送
```
POST /sync/playlists
Authorization: Bearer <token>
Content-Type: application/json

{ "playlists": [...] }
```
**响应**
```json
{ "ok": true, "count": 3 }
```

---

### 最近播放 — 拉取
```
GET /sync/recent
Authorization: Bearer <token>
```
**响应**
```json
{
  "songs": [...]     // 最多 200 条
}
```

### 最近播放 — 推送
```
POST /sync/recent
Authorization: Bearer <token>
Content-Type: application/json

{ "songs": [...] }
```
**响应**
```json
{ "ok": true, "count": 50 }
```

---

## 健康检查

```
GET /health
```
**响应**
```json
{ "ok": true, "time": 1783000000000 }
```

---

## 接口汇总

| 方法 | 路径 | 说明 | Auth |
|------|------|------|:--:|
| POST | `/auth/register` | 注册 | — |
| POST | `/auth/login` | 登录 | — |
| GET | `/sync/favorites` | 获取收藏 | ✅ |
| POST | `/sync/favorites` | 同步收藏 | ✅ |
| GET | `/sync/playlists` | 获取歌单 | ✅ |
| POST | `/sync/playlists` | 同步歌单 | ✅ |
| GET | `/sync/recent` | 获取最近播放 | ✅ |
| POST | `/sync/recent` | 同步最近播放 | ✅ |
| GET | `/health` | 健康检查 | — |
