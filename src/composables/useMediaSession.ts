import { watch, onMounted } from 'vue'
import { usePlayerStore } from '@/stores/playerStore'

/**
 * Register Media Session API handlers for system-level media controls
 * Works on lock screen, notification shade, and hardware media keys
 */
export function useMediaSession() {
  const player = usePlayerStore()

  if (!('mediaSession' in navigator)) return

  const updateMetadata = () => {
    const song = player.currentSong
    if (!song) {
      navigator.mediaSession.metadata = null
      return
    }

    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.title,
      artist: song.artist,
      album: song.album,
      artwork: song.cover
        ? [{ src: song.cover, sizes: '512x512', type: 'image/jpeg' }]
        : [],
    })
  }

  navigator.mediaSession.setActionHandler('play', () => {
    player.isPlaying = true
  })

  navigator.mediaSession.setActionHandler('pause', () => {
    player.isPlaying = false
  })

  navigator.mediaSession.setActionHandler('previoustrack', () => {
    player.prev()
  })

  navigator.mediaSession.setActionHandler('nexttrack', () => {
    player.next()
  })

  navigator.mediaSession.setActionHandler('seekto', (details) => {
    if (details.seekTime != null) {
      player.setProgress(details.seekTime)
    }
  })

  // Update metadata when song changes
  watch(() => player.currentSong, updateMetadata, { immediate: true })

  // Update playback state
  watch(() => player.isPlaying, (playing) => {
    navigator.mediaSession.playbackState = playing ? 'playing' : 'paused'
  })
}

/**
 * Sleep timer composable
 */
export function useSleepTimer() {
  const player = usePlayerStore()
  let timerId: ReturnType<typeof setTimeout> | null = null

  const setTimer = (minutes: number) => {
    clearTimer()
    if (minutes <= 0) return

    timerId = setTimeout(() => {
      player.isPlaying = false
    }, minutes * 60 * 1000)
  }

  const clearTimer = () => {
    if (timerId) {
      clearTimeout(timerId)
      timerId = null
    }
  }

  return { setTimer, clearTimer }
}
