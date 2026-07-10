<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/playerStore'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const player = usePlayerStore()
const user = useUserStore()
const progress = ref(0)
const audio = ref<HTMLAudioElement | null>(null)
let interval: ReturnType<typeof setInterval> | null = null

const currentTrack = computed(() => player.currentSong)
const isLiked = computed(() => currentTrack.value ? user.isFavorite(currentTrack.value) : false)

// Audio element
onMounted(() => {
  audio.value = new Audio()
  audio.value.volume = player.volume
  interval = setInterval(() => {
    if (audio.value && !audio.value.paused) {
      progress.value = audio.value.currentTime
      player.setProgress(audio.value.currentTime)
    }
  }, 500)
})
onBeforeUnmount(() => {
  if (interval) clearInterval(interval)
  audio.value?.pause()
  audio.value = null
})

// Watch: play when song changes or isPlaying toggles
import { watch } from 'vue'
watch(() => player.currentSong, (song) => {
  if (!audio.value || !song?.url) return
  audio.value.src = song.url
  if (player.isPlaying) audio.value.play().catch(() => {})
  player.duration = song.duration
})

watch(() => player.isPlaying, (playing) => {
  if (!audio.value) return
  if (playing) audio.value.play().catch(() => {})
  else audio.value.pause()
})

watch(() => player.volume, (v) => {
  if (audio.value) audio.value.volume = v
})

function toggleLike() { if (currentTrack.value) user.toggleFavorite(currentTrack.value) }
</script>

<template>
  <div v-if="currentTrack" class="player-bar">
    <div class="progress-wrap">
      <div class="progress-track" @click="(e: MouseEvent) => { const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); player.setProgress(((e.clientX - r.left) / r.width) * player.duration); }">
        <div class="progress-fill" :style="{ width: `${player.duration > 0 ? (player.progress / player.duration) * 100 : 0}%` }" />
      </div>
    </div>

    <div class="player-inner">
      <!-- Left: track info -->
      <div class="player-left">
        <img v-if="currentTrack.cover" :src="currentTrack.cover + '?param=224y224'" class="track-cover" @click="router.push('/player')" />
        <div v-else class="track-cover-placeholder">♪</div>
        <div class="track-info" @click="router.push('/player')">
          <div class="track-title">{{ currentTrack.title }}</div>
          <div class="track-artist">{{ currentTrack.artist }}</div>
        </div>
        <button class="like-btn" @click.stop="toggleLike">
          <span v-if="isLiked" class="text-[var(--color-primary)]">♥</span>
          <span v-else>♡</span>
        </button>
      </div>

      <!-- Center: play controls -->
      <div class="player-center">
        <button class="ctrl-btn" @click="player.prev()">⏮</button>
        <button class="play-btn" @click="player.togglePlay()">
          <span v-if="player.isPlaying">⏸</span>
          <span v-else>▶</span>
        </button>
        <button class="ctrl-btn" @click="player.next()">⏭</button>
      </div>

      <!-- Right: extra (desktop only) -->
      <div class="player-right">
        <button class="extra-btn" :class="{ active: player.mode !== 'list' }" @click="player.toggleMode()">🔁</button>
        <button class="extra-btn" :class="{ active: player.mode === 'shuffle' }" @click="player.mode = player.mode === 'shuffle' ? 'list' : 'shuffle'">🔀</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.player-bar {
  position: fixed; bottom: 56px; right: 0; left: 0;
  display: flex; flex-direction: column; justify-content: space-around;
  height: 56px;
  backdrop-filter: saturate(180%) blur(30px);
  background-color: var(--color-navbar-bg); z-index: 100;
}
@media (min-width: 640px) {
  .player-bar { bottom: 0; height: 64px; }
}

.progress-wrap { margin-top: -3px; width: 100%; padding: 0 8px; }
@media (min-width: 640px) { .progress-wrap { padding: 0 5vw; } }
.progress-track { height: 2px; background: #e0e0e0; border-radius: 1px; cursor: pointer; }
.progress-fill { height: 100%; background: var(--color-primary); border-radius: 1px; transition: width 0.3s; }

.player-inner {
  display: flex; align-items: center; justify-content: space-between;
  height: 100%; padding: 0 8px; gap: 4px;
}
@media (min-width: 640px) {
  .player-inner { display: grid; grid-template-columns: 1fr auto 1fr; padding: 0 5vw; gap: 0; }
}

/* Left */
.player-left { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; }
.track-cover { height: 38px; width: 38px; border-radius: 6px; object-fit: cover; cursor: pointer; flex-shrink: 0; }
@media (min-width: 640px) { .track-cover { height: 46px; width: 46px; } }
.track-cover-placeholder {
  height: 38px; width: 38px; border-radius: 6px; flex-shrink: 0;
  background: var(--color-primary-bg); display: flex; align-items: center;
  justify-content: center; color: var(--color-primary); font-size: 16px;
}
.track-info { min-width: 0; cursor: pointer; display: none; }
@media (min-width: 480px) { .track-info { display: block; } }
.track-title { font-size: 13px; font-weight: 600; color: var(--color-text); opacity: 0.88; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
@media (min-width: 640px) { .track-title { font-size: 16px; } }
.track-artist { font-size: 11px; opacity: 0.58; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.like-btn { padding: 6px; font-size: 16px; opacity: 0.58; flex-shrink: 0; display: none; }
@media (min-width: 480px) { .like-btn { display: block; } }
.like-btn:hover { opacity: 1; }

/* Center */
.player-center { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
@media (min-width: 640px) { .player-center { gap: 16px; } }
.ctrl-btn { padding: 6px; font-size: 16px; opacity: 0.58; color: var(--color-text); }
.ctrl-btn:hover { opacity: 1; }
.play-btn {
  width: 38px; height: 38px; border-radius: 50%; background: var(--color-primary); color: #fff;
  display: flex; align-items: center; justify-content: center; font-size: 16px; transition: transform 0.15s;
}
.play-btn:hover { transform: scale(1.05); }
@media (min-width: 640px) { .play-btn { width: 42px; height: 42px; font-size: 18px; } }

/* Right */
.player-right { display: none; align-items: center; gap: 4px; justify-content: flex-end; }
@media (min-width: 640px) { .player-right { display: flex; } }
.extra-btn { padding: 6px; font-size: 14px; opacity: 0.38; color: var(--color-text); }
.extra-btn:hover { opacity: 0.88; }
.extra-btn.active { opacity: 0.88; color: var(--color-primary); }
</style>
