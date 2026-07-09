# 音乐 API 接口 (聚合多音源)

> 这是 EchoMusic 前端调用的**音乐数据 API**，默认地址 `https://echomusic-api.vercel.app`，可在设置页修改。

---

## 搜索

```
GET /api/search
```

| 参数 | 类型 | 说明 |
|------|------|------|
| `keyword` | string | 搜索关键词 |
| `source` | string | 音源: `netease` / `qq` / `kugou` / `bilibili` |
| `type` | string | `song` / `album` / `artist` / `playlist` |
| `limit` | int | 条数，默认 30 |
| `offset` | int | 偏移量 |

```json
{
  "source": "netease",
  "songs": [
    {
      "id": 12345,
      "title": "歌曲名",
      "artist": "歌手",
      "album": "专辑",
      "cover": "https://...",
      "duration": 240,
      "source": "netease"
    }
  ],
  "total": 100,
  "hasMore": true
}
```

---

## 获取播放地址

```
GET /api/song/url?id=12345&source=netease&quality=standard
```

| 参数 | 说明 |
|------|------|
| `id` | 歌曲 ID |
| `source` | 音源 |
| `quality` | `standard` / `higher` / `lossless` |

```json
{ "url": "https://...mp3" }
```

---

## 获取歌词

```
GET /api/lyric?id=12345&source=netease
```

```json
{
  "lyric": "[00:01.00]第一句歌词\n[00:05.00]第二句歌词",
  "tlyric": "[00:01.00]First line\n[00:05.00]Second line"
}
```

---

## 歌单详情

```
GET /api/playlist/detail?id=12345&source=netease
```

```json
{
  "id": 12345,
  "name": "歌单名",
  "cover": "https://...",
  "description": "...",
  "songs": [...],
  "creator": "创建者",
  "playCount": 123456
}
```

---

## 专辑详情

```
GET /api/album/detail?id=12345&source=netease
```

同上格式。

---

## 歌手详情

```
GET /api/artist/detail?id=12345&source=netease
```

---

## 推荐歌单

```
GET /api/recommend/playlists?source=netease&limit=20
```

```json
{
  "playlists": [
    { "id": 1, "name": "推荐歌单", "picUrl": "https://...", "copywriter": "推荐语" }
  ]
}
```

---

## 快速汇总

| 接口 | 参数 |
|------|------|
| `/api/search` | `keyword` `source` `type` `limit` |
| `/api/song/url` | `id` `source` `quality` |
| `/api/lyric` | `id` `source` |
| `/api/playlist/detail` | `id` `source` |
| `/api/album/detail` | `id` `source` |
| `/api/artist/detail` | `id` `source` |
| `/api/recommend/playlists` | `source` `limit` |

---

## 自部署说明

音乐 API 和账号 API 是**两个独立服务**：

| 服务 | 用途 | 部署方式 |
|------|------|------|
| 音乐 API | 搜索/播放/歌词 | [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi) → Vercel |
| 账号 API | 注册/登录/数据同步 | `server/index.js` → Railway.app |

前端设置页里有两个地址可以分别配置。
