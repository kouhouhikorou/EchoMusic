<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/playerStore'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const player = usePlayerStore()
const user = useUserStore()
const progress = ref(0)
let interval: ReturnType<typeof setInterval> | null = null

const currentTrack = computed(() => player.currentSong)
const progressMax = computed(() => {
  const max = ~~((player.duration || 0))
  return max > 1 ? max - 1 : max
})
const isLiked = computed(() => currentTrack.value ? user.isFavorite(currentTrack.value) : false)

onMounted(() => {
  interval = setInterval(() => { progress.value = player.progress }, 1000)
})
onBeforeUnmount(() => { if (interval) clearInterval(interval) })

function formatTime(v: number): string {
  if (!v) return '0:00'
  const m = ~~(v / 60), s = (~~(v % 60)).toString().padStart(2, '0')
  return `${m}:${s}`
}

function setSeek() {
  player.setProgress(progress.value)
}

function toggleLike() {
  if (currentTrack.value) user.toggleFavorite(currentTrack.value)
}

function repeat() {
  const modes = ['off', 'on', 'one'] as const
  const idx = modes.indexOf(player.mode === 'single' ? 'one' : player.mode === 'list' ? 'on' : 'off')
  const next = modes[(idx + 1) % 3]
  player.mode = next === 'one' ? 'single' : next === 'on' ? 'list' : 'shuffle'
}

function shuffle() {
  player.mode = player.mode === 'shuffle' ? 'list' : 'shuffle'
}
</script>

<template>
  <div v-if="currentTrack" class="player-bar">
    <!-- Progress -->
    <div class="progress-wrap">
      <div class="h-[2px] bg-[#e0e0e0] rounded-full cursor-pointer relative" @click="(e: MouseEvent) => { const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); const pct = (e.clientX - r.left) / r.width; player.setProgress(pct * player.duration); }">
        <div class="h-full bg-[var(--color-primary)] rounded-full transition-all duration-200" :style="{ width: `${progressMax > 0 ? (progress / progressMax) * 100 : 0}%` }" />
      </div>
    </div>

    <div class="player-inner">
      <!-- Left: track info -->
      <div class="player-section">
        <div class="flex items-center gap-3">
          <img
            v-if="currentTrack.cover"
            :src="currentTrack.cover + '?param=224y224'"
            class="h-[46px] w-[46px] rounded-md object-cover shadow-md cursor-pointer"
            @click="router.push('/player')"
          />
          <div v-else class="h-[46px] w-[46px] rounded-md bg-[var(--color-primary-bg)] flex items-center justify-center text-[var(--color-primary)] text-lg">♪</div>
          <div class="flex flex-col justify-center min-w-0">
            <div class="text-[16px] font-semibold text-[var(--color-text)] opacity-88 truncate cursor-pointer hover:underline" @click="router.push('/player')">{{ currentTrack.title }}</div>
            <div class="text-xs text-[var(--color-text)] opacity-58 truncate cursor-pointer hover:underline" @click="router.push('/artist/0')">{{ currentTrack.artist }}</div>
          </div>
          <button class="ml-4 p-2 text-[var(--color-text)] opacity-58 hover:opacity-100 transition-opacity" @click="toggleLike">
            <span v-if="isLiked" class="text-[var(--color-primary)] text-lg">♥</span>
            <span v-else class="text-lg">♡</span>
          </button>
        </div>
      </div>

      <!-- Center: controls -->
      <div class="player-section justify-center">
        <div class="flex items-center gap-4">
          <button class="p-2 text-[var(--color-text)] opacity-58 hover:opacity-100 transition-opacity" @click="player.prev()" title="上一首">⏮</button>
          <button class="w-[42px] h-[42px] flex items-center justify-center rounded-full bg-[var(--color-primary)] text-white hover:scale-105 transition-transform" @click="player.togglePlay()" title="播放/暂停">
            <span v-if="player.isPlaying" class="text-xl">⏸</span>
            <span v-else class="text-xl ml-0.5">▶</span>
          </button>
          <button class="p-2 text-[var(--color-text)] opacity-58 hover:opacity-100 transition-opacity" @click="player.next()" title="下一首">⏭</button>
        </div>
      </div>

      <!-- Right: extra controls -->
      <div class="player-section justify-end">
        <div class="flex items-center gap-2">
          <button class="p-2 text-[var(--color-text)] opacity-58 hover:opacity-100 transition-opacity" :class="{ '!opacity-100 !text-[var(--color-primary)]': player.mode !== 'list' }" @click="repeat" title="循环">🔁</button>
          <button class="p-2 text-[var(--color-text)] opacity-58 hover:opacity-100 transition-opacity" :class="{ '!opacity-100 !text-[var(--color-primary)]': player.mode === 'shuffle' }" @click="shuffle" title="随机">🔀</button>
          <div class="flex items-center gap-1 ml-2">
            <button class="p-2 text-[var(--color-text)] opacity-58 hover:opacity-100 transition-opacity" @click="player.setVolume(Math.max(0, player.volume - 0.1))">🔉</button>
            <div class="w-[60px] h-[2px] bg-[#e0e0e0] rounded-full cursor-pointer" @click="(e: MouseEvent) => { const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); player.setVolume((e.clientX - r.left) / r.width); }">
              <div class="h-full bg-[var(--color-primary)] rounded-full" :style="{ width: `${player.volume * 100}%` }" />
            </div>
          </div>
          <button class="p-2 ml-2 text-[var(--color-text)] opacity-58 hover:opacity-100 transition-opacity" @click="router.push('/player')" title="歌词">🎤</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.player-bar {
  position: fixed; bottom: 0; right: 0; left: 0;
  display: flex; flex-direction: column; justify-content: space-around;
  height: 64px;
  backdrop-filter: saturate(180%) blur(30px);
  background-color: var(--color-navbar-bg);
  z-index: 100;
}
.progress-wrap { margin-top: -6px; margin-bottom: -4px; width: 100%; }
.player-inner {
  display: grid; grid-template-columns: repeat(3, 1fr);
  height: 100%; padding-right: 10vw; padding-left: 10vw;
}
@media (max-width: 1336px) {
  .player-inner { padding: 0 5vw; }
}
.player-section { display: flex; align-items: center; }
</style>
