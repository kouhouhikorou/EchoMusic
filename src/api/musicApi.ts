import axios from 'axios'
import type { Song } from '@/stores/playerStore'

export type MusicSource = 'netease' | 'qq' | 'kugou' | 'bilibili'

interface SearchParams {
  keyword: string
  source?: MusicSource
  type?: 'song' | 'album' | 'artist' | 'playlist'
  limit?: number
  offset?: number
}

interface SearchResponse {
  source: string
  songs: Song[]
  total: number
  hasMore: boolean
}

interface PlaylistDetail {
  id: string | number
  name: string
  cover: string
  description: string
  songs: Song[]
  creator: string
  playCount: number
}

// Source name mapping for display
export const SOURCE_NAMES: Record<string, string> = {
  netease: '网易云音乐',
  qq: 'QQ 音乐',
  kugou: '酷狗音乐',
  bilibili: 'Bilibili',
  local: '本地',
}

// Source fallback order
export const SOURCE_PRIORITY: MusicSource[] = ['netease', 'qq', 'kugou', 'bilibili']

function getApiUrl(): string {
  return localStorage.getItem('echomusic-api-url') || 'http://localhost:3000'
}

const api = axios.create({
  timeout: 15000,
})

// Transform netease track to unified Song
function neteaseTrackToSong(track: any, source: MusicSource): Song {
  return {
    id: track.id,
    title: track.name || track.title || '',
    artist: track.ar ? track.ar.map((a: any) => a.name).join('/') : (track.artist || ''),
    album: track.al?.name || track.album || '',
    cover: track.al?.picUrl || track.cover || '',
    url: '',
    duration: (track.dt || track.duration || 0) / 1000,
    lyric: '',
    source,
  }
}

// Unified search across sources
export async function searchMusic(params: SearchParams): Promise<SearchResponse> {
  const { keyword, source = 'netease', type = 'song', limit = 30, offset = 0 } = params
  const baseUrl = getApiUrl()

  try {
    const { data } = await api.get(`${baseUrl}/search`, {
      params: { keywords: keyword, type: type === 'song' ? 1 : type === 'album' ? 10 : type === 'artist' ? 100 : 1000, limit, offset },
    })
    const songs = (data.result?.songs || data.songs || []).map((s: any) => neteaseTrackToSong(s, source))
    return { source, songs, total: data.result?.songCount || songs.length, hasMore: (data.result?.songCount || 0) > offset + songs.length }
  } catch {
    return { source, songs: [], total: 0, hasMore: false }
  }
}

// Get song play URL
export async function getSongUrl(
  songId: string | number,
  source: MusicSource,
  quality: string = 'standard'
): Promise<string | null> {
  const baseUrl = getApiUrl()

  try {
    const level = quality === 'lossless' ? 'lossless' : quality === 'higher' ? 'higher' : 'standard'
    const { data } = await api.get(`${baseUrl}/song/url/v1`, {
      params: { id: songId, level },
    })
    if (data.data?.[0]?.url) return data.data[0].url
  } catch {
    // fallback: try without v1
    try {
      const { data } = await api.get(`${baseUrl}/song/url`, {
        params: { id: songId },
      })
      if (data.data?.[0]?.url) return data.data[0].url
    } catch {}
  }

  return null
}

// Get lyrics
export async function getLyric(
  songId: string | number,
  source: MusicSource
): Promise<{ lyric: string; tlyric?: string }> {
  const baseUrl = getApiUrl()

  try {
    const { data } = await api.get(`${baseUrl}/lyric`, {
      params: { id: songId },
    })
    return {
      lyric: data.lrc?.lyric || data.lyric || '',
      tlyric: data.tlyric?.lyric || data.tlyric || undefined,
    }
  } catch {
    return { lyric: '' }
  }
}

// Get playlist detail
export async function getPlaylistDetail(
  id: string | number,
  source: MusicSource
): Promise<PlaylistDetail | null> {
  const baseUrl = getApiUrl()

  try {
    const { data } = await api.get(`${baseUrl}/playlist/detail`, {
      params: { id },
    })
    const pl = data.playlist || data
    return {
      id: pl.id,
      name: pl.name,
      cover: pl.coverImgUrl || pl.picUrl || pl.cover || '',
      description: pl.description || '',
      songs: (pl.tracks || pl.songs || []).map((s: any) => neteaseTrackToSong(s, source)),
      creator: pl.creator?.nickname || pl.creator || '',
      playCount: pl.playCount || 0,
    }
  } catch {
    return null
  }
}

// Get recommended playlists
export async function getRecommendPlaylists(source: MusicSource = 'netease', limit = 20) {
  const baseUrl = getApiUrl()

  try {
    const { data } = await api.get(`${baseUrl}/personalized`, {
      params: { limit },
    })
    // NeteaseCloudMusicApi returns { result: [...] }
    return data.result || data.playlists || []
  } catch {
    return []
  }
}

// Get album detail
export async function getAlbumDetail(
  id: string | number,
  source: MusicSource
): Promise<PlaylistDetail | null> {
  const baseUrl = getApiUrl()

  try {
    const { data } = await api.get(`${baseUrl}/album/detail`, {
      params: { id, source },
    })
    return data
  } catch {
    return null
  }
}

// Get artist detail + top songs
export async function getArtistDetail(id: string | number, source: MusicSource) {
  const baseUrl = getApiUrl()

  try {
    const { data } = await api.get(`${baseUrl}/artist/detail`, {
      params: { id, source },
    })
    return data
  } catch {
    return null
  }
}

// Search across ALL sources with failover
export async function searchAllSources(
  keyword: string,
  type: 'song' | 'album' | 'artist' | 'playlist' = 'song',
  limit = 10
): Promise<SearchResponse[]> {
  const results: SearchResponse[] = []

  for (const source of SOURCE_PRIORITY) {
    try {
      const result = await searchMusic({ keyword, source, type, limit })
      if (result.songs.length > 0) {
        results.push(result)
      }
    } catch {
      continue
    }
  }

  return results
}
