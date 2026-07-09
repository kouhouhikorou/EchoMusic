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
  return localStorage.getItem('echomusic-api-url') || 'https://echomusic-api.vercel.app'
}

const api = axios.create({
  timeout: 15000,
})

// Unified search across sources
export async function searchMusic(params: SearchParams): Promise<SearchResponse> {
  const { keyword, source = 'netease', type = 'song', limit = 30, offset = 0 } = params
  const baseUrl = getApiUrl()

  try {
    const { data } = await api.get(`${baseUrl}/api/search`, {
      params: { keyword, source, type, limit, offset },
    })
    return data
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

  // Try primary source first
  try {
    const { data } = await api.get(`${baseUrl}/api/song/url`, {
      params: { id: songId, source, quality },
    })
    if (data.url) return data.url
  } catch {
    // will try fallback below
  }

  // Fallback: try other sources
  const userStore = (await import('@/stores/userStore')).useUserStore()
  const priorities = userStore.settings.sourcePriority.filter(s => s !== source)

  for (const fallbackSource of priorities) {
    try {
      const { data } = await api.get(`${baseUrl}/api/song/url`, {
        params: { id: songId, source: fallbackSource, quality },
      })
      if (data.url) return data.url
    } catch {
      continue
    }
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
    const { data } = await api.get(`${baseUrl}/api/lyric`, {
      params: { id: songId, source },
    })
    return { lyric: data.lyric || '', tlyric: data.tlyric }
  } catch {
    // Try fallback sources for lyrics
    const priorities = ['netease', 'qq', 'kugou'].filter(s => s !== source)
    for (const fallbackSource of priorities) {
      try {
        const { data } = await api.get(`${baseUrl}/api/lyric`, {
          params: { id: songId, source: fallbackSource },
        })
        if (data.lyric) return { lyric: data.lyric, tlyric: data.tlyric }
      } catch {
        continue
      }
    }
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
    const { data } = await api.get(`${baseUrl}/api/playlist/detail`, {
      params: { id, source },
    })
    return data
  } catch {
    return null
  }
}

// Get recommended playlists
export async function getRecommendPlaylists(source: MusicSource = 'netease', limit = 20) {
  const baseUrl = getApiUrl()

  try {
    const { data } = await api.get(`${baseUrl}/api/recommend/playlists`, {
      params: { source, limit },
    })
    return data.playlists || []
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
    const { data } = await api.get(`${baseUrl}/api/album/detail`, {
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
    const { data } = await api.get(`${baseUrl}/api/artist/detail`, {
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
