import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Song } from './playerStore'
import { isLoggedIn as checkLoggedIn, syncFavorites, loadFavorites, syncPlaylists, loadPlaylists, syncRecent, loadRecent } from '@/api/authApi'

export interface Playlist {
  id: string
  name: string
  cover: string
  description: string
  songs: Song[]
  source: 'local' | 'netease' | 'qq' | 'kugou' | 'bilibili'
  created: number
  updated: number
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto'
  apiUrl: string
  sourcePriority: string[]
  sourceSwitchConfirm: boolean
  sourceTimeout: number
  lyricFontSize: number
  crossfadeEnabled: boolean
  crossfadeDuration: number
  sleepTimer: number
  coverSpin: boolean
}

export const useUserStore = defineStore('user', () => {
  const favorites = ref<Song[]>([])
  const playlists = ref<Playlist[]>([])
  const recentPlays = ref<Song[]>([])
  const isLoggedIn = ref(false)
  const userInfo = ref<{ id: string; username: string; email: string } | null>(null)

  const settings = ref<UserSettings>({
    theme: 'dark',
    apiUrl: localStorage.getItem('echomusic-api-url') || 'http://localhost:3000',
    sourcePriority: ['netease', 'qq', 'kugou', 'bilibili'],
    sourceSwitchConfirm: false,
    sourceTimeout: 8,
    lyricFontSize: 16,
    crossfadeEnabled: true,
    crossfadeDuration: 2,
    sleepTimer: 0,
    coverSpin: true,
  })

  // Load from localStorage
  function loadFromStorage() {
    try {
      const stored = localStorage.getItem('echomusic-favorites')
      if (stored) favorites.value = JSON.parse(stored)
      const playlistsStored = localStorage.getItem('echomusic-playlists')
      if (playlistsStored) playlists.value = JSON.parse(playlistsStored)
      const recentStored = localStorage.getItem('echomusic-recent')
      if (recentStored) recentPlays.value = JSON.parse(recentStored)
      const settingsStored = localStorage.getItem('echomusic-settings')
      if (settingsStored) {
        settings.value = { ...settings.value, ...JSON.parse(settingsStored) }
      }
    } catch {
      // ignore parse errors
    }
  }

  function saveToStorage() {
    localStorage.setItem('echomusic-favorites', JSON.stringify(favorites.value))
    localStorage.setItem('echomusic-playlists', JSON.stringify(playlists.value))
    localStorage.setItem('echomusic-recent', JSON.stringify(recentPlays.value.slice(0, 200)))
    localStorage.setItem('echomusic-settings', JSON.stringify(settings.value))
    localStorage.setItem('echomusic-api-url', settings.value.apiUrl)
  }

  function toggleFavorite(song: Song) {
    const idx = favorites.value.findIndex(s => s.id === song.id && s.source === song.source)
    if (idx === -1) {
      favorites.value.unshift(song)
    } else {
      favorites.value.splice(idx, 1)
    }
    saveToStorage()
  }

  function isFavorite(song: Song): boolean {
    return favorites.value.some(s => s.id === song.id && s.source === song.source)
  }

  function createPlaylist(name: string, description = ''): Playlist {
    const playlist: Playlist = {
      id: `local-${Date.now()}`,
      name,
      cover: '',
      description,
      songs: [],
      source: 'local',
      created: Date.now(),
      updated: Date.now(),
    }
    playlists.value.push(playlist)
    saveToStorage()
    return playlist
  }

  function deletePlaylist(id: string) {
    const idx = playlists.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      playlists.value.splice(idx, 1)
      saveToStorage()
    }
  }

  function addToPlaylist(playlistId: string, song: Song) {
    const playlist = playlists.value.find(p => p.id === playlistId)
    if (playlist && !playlist.songs.some(s => s.id === song.id)) {
      playlist.songs.push(song)
      playlist.updated = Date.now()
      saveToStorage()
    }
  }

  function removeFromPlaylist(playlistId: string, songId: string | number) {
    const playlist = playlists.value.find(p => p.id === playlistId)
    if (playlist) {
      playlist.songs = playlist.songs.filter(s => s.id !== songId)
      playlist.updated = Date.now()
      saveToStorage()
    }
  }

  function updateSettings(partial: Partial<UserSettings>) {
    settings.value = { ...settings.value, ...partial }
    saveToStorage()
  }

  function updateSourcePriority(priority: string[]) {
    settings.value.sourcePriority = priority
    saveToStorage()
  }

  // Cloud sync
  async function syncToCloud() {
    if (!checkLoggedIn()) return
    try {
      await Promise.all([
        syncFavorites(favorites.value),
        syncPlaylists(playlists.value),
        syncRecent(recentPlays.value.slice(0, 100)),
      ])
    } catch {}
  }

  async function pullFromCloud() {
    if (!checkLoggedIn()) return
    try {
      const [favs, pls, recent] = await Promise.all([
        loadFavorites(), loadPlaylists(), loadRecent(),
      ])
      if (favs.length) favorites.value = favs
      if (pls.length) playlists.value = pls
      if (recent.length) recentPlays.value = recent
      saveToStorage()
    } catch {}
  }

  // Auto-sync when data changes
  async function saveToStorageAndSync() {
    saveToStorage()
    await syncToCloud()
  }

  // Override saveToStorage with sync version
  async function toggleFavoriteWithSync(song: Song) {
    const idx = favorites.value.findIndex(s => s.id === song.id && s.source === song.source)
    if (idx === -1) favorites.value.unshift(song)
    else favorites.value.splice(idx, 1)
    await saveToStorageAndSync()
  }

  async function createPlaylistWithSync(name: string, description = ''): Promise<Playlist> {
    const playlist: Playlist = {
      id: `local-${Date.now()}`, name, cover: '', description, songs: [],
      source: 'local', created: Date.now(), updated: Date.now(),
    }
    playlists.value.push(playlist)
    await saveToStorageAndSync()
    return playlist
  }

  async function deletePlaylistWithSync(id: string) {
    const idx = playlists.value.findIndex(p => p.id === id)
    if (idx !== -1) { playlists.value.splice(idx, 1); await saveToStorageAndSync() }
  }

  async function addToPlaylistWithSync(playlistId: string, song: Song) {
    const playlist = playlists.value.find(p => p.id === playlistId)
    if (playlist && !playlist.songs.some(s => s.id === song.id)) {
      playlist.songs.push(song)
      playlist.updated = Date.now()
      await saveToStorageAndSync()
    }
  }

  // Initialize
  loadFromStorage()
  if (checkLoggedIn()) pullFromCloud()

  return {
    favorites, playlists, recentPlays, isLoggedIn, userInfo, settings,
    loadFromStorage, saveToStorage,
    isFavorite, removeFromPlaylist,
    updateSettings, updateSourcePriority,
    // Cloud-synced versions (override originals)
    syncToCloud, pullFromCloud,
    toggleFavorite: toggleFavoriteWithSync,
    createPlaylist: createPlaylistWithSync,
    deletePlaylist: deletePlaylistWithSync,
    addToPlaylist: addToPlaylistWithSync,
  }
})
