import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Song {
  id: string | number
  title: string
  artist: string
  album: string
  cover: string
  url: string
  duration: number
  lyric: string
  tlyric?: string
  source: 'local' | 'netease' | 'qq' | 'kugou' | 'bilibili'
  localPath?: string
  format?: string
  quality?: 'standard' | 'higher' | 'lossless'
}

export type PlayMode = 'list' | 'single' | 'shuffle'

export const usePlayerStore = defineStore('player', () => {
  const currentSong = ref<Song | null>(null)
  const queue = ref<Song[]>([])
  const history = ref<Song[]>([])
  const index = ref(-1)
  const isPlaying = ref(false)
  const mode = ref<PlayMode>('list')
  const volume = ref(0.7)
  const progress = ref(0)
  const duration = ref(0)
  const isLoading = ref(false)
  const currentSource = ref<string>('netease')

  const hasCurrent = computed(() => currentSong.value !== null)
  const hasNext = computed(() => {
    if (mode.value === 'single') return true
    if (mode.value === 'shuffle') return queue.value.length > 0
    return index.value < queue.value.length - 1
  })
  const hasPrev = computed(() => {
    if (mode.value === 'single') return true
    if (mode.value === 'shuffle') return history.value.length > 0
    return index.value > 0
  })

  function playSong(song: Song) {
    currentSong.value = song
    isPlaying.value = true
    isLoading.value = true
    currentSource.value = song.source
    addToHistory(song)
  }

  function playQueue(songs: Song[], startIndex = 0) {
    queue.value = [...songs]
    index.value = startIndex
    if (songs.length > 0) {
      playSong(songs[startIndex])
    }
  }

  function addToQueue(song: Song) {
    queue.value.push(song)
  }

  function addToHistory(song: Song) {
    const idx = history.value.findIndex(s => s.id === song.id)
    if (idx !== -1) history.value.splice(idx, 1)
    history.value.unshift(song)
    if (history.value.length > 200) history.value.pop()
  }

  function next() {
    if (mode.value === 'shuffle' && queue.value.length > 0) {
      const randomIdx = Math.floor(Math.random() * queue.value.length)
      index.value = randomIdx
      playSong(queue.value[randomIdx])
      return
    }
    if (index.value < queue.value.length - 1) {
      index.value++
      playSong(queue.value[index.value])
    }
  }

  function prev() {
    if (history.value.length > 1) {
      history.value.shift()
      const prevSong = history.value[0]
      if (prevSong) {
        currentSong.value = prevSong
        isPlaying.value = true
        isLoading.value = true
        index.value = queue.value.findIndex(s => s.id === prevSong.id)
      }
    }
  }

  function togglePlay() {
    isPlaying.value = !isPlaying.value
  }

  function setProgress(p: number) {
    progress.value = p
  }

  function setVolume(v: number) {
    volume.value = Math.max(0, Math.min(1, v))
  }

  function toggleMode() {
    const modes: PlayMode[] = ['list', 'single', 'shuffle']
    const idx = modes.indexOf(mode.value)
    mode.value = modes[(idx + 1) % modes.length]
  }

  function removeFromQueue(songId: string | number) {
    const idx = queue.value.findIndex(s => s.id === songId)
    if (idx !== -1) {
      queue.value.splice(idx, 1)
      if (idx < index.value) index.value--
      if (index.value >= queue.value.length) index.value = queue.value.length - 1
    }
  }

  function clearQueue() {
    queue.value = []
    index.value = -1
  }

  return {
    currentSong, queue, history, index, isPlaying, mode,
    volume, progress, duration, isLoading, currentSource,
    hasCurrent, hasNext, hasPrev,
    playSong, playQueue, addToQueue, addToHistory,
    next, prev, togglePlay, setProgress, setVolume,
    toggleMode, removeFromQueue, clearQueue,
  }
})
