<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePlayerStore } from '@/stores/playerStore'
import { useUserStore } from '@/stores/userStore'
import { useMediaSession } from '@/composables/useMediaSession'
import { SOURCE_NAMES } from '@/api/musicApi'
import LyricDisplay from '@/components/LyricDisplay.vue'
import {
  Play, Pause, PlaySkipForward, PlaySkipBack,
  Shuffle, Repeat, ChevronDown,
  Heart, HeartOutline, ListOutline,
} from '@vicons/ionicons5'

const player = usePlayerStore()
const user = useUserStore()
const showLyrics = ref(false)
const showQueue = ref(false)

useMediaSession()

const song = computed(() => player.currentSong)
const progressPercent = computed(() =>
  player.duration > 0 ? (player.progress / player.duration) * 100 : 0
)
const isLiked = computed(() => song.value ? user.isFavorite(song.value) : false)
const modeLabel = computed(() =>
  player.mode === 'single' ? '单曲循环' : player.mode === 'shuffle' ? '随机播放' : '列表循环'
)

function formatTime(s: number): string {
  if (!s || !isFinite(s)) return '00:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

function onProgressClick(e: MouseEvent) {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const pct = (e.clientX - rect.left) / rect.width
  player.setProgress(pct * player.duration)
}

function toggleLike() { if (song.value) user.toggleFavorite(song.value) }
function skipBack() { player.progress > 3 ? player.setProgress(0) : player.prev() }
function skipForward() { player.setProgress(Math.min(player.duration, player.progress + 15)) }
</script>

<template>
  <div class="h-full flex flex-col" :style="song?.cover ? {
    background: `url(${song.cover}) center / cover no-repeat fixed`
  } : {}">
    <!-- Blur overlay -->
    <div class="absolute inset-0 bg-surface-950/85 backdrop-blur-3xl" />

    <div v-if="!song" class="relative flex-1 flex flex-col items-center justify-center text-gray-600 gap-4">
      <span class="text-7xl">🎵</span>
      <p class="text-sm">暂无播放歌曲</p>
    </div>

    <template v-else>
      <!-- Top bar -->
      <div class="relative flex items-center justify-between px-5 py-4">
        <button class="p-2 -ml-2 text-gray-400 hover:text-white transition-colors" @click="$router.back()">
          <ChevronDown class="w-6 h-6" />
        </button>
        <div class="text-center">
          <div class="text-xs text-gray-500 uppercase tracking-wider">{{ SOURCE_NAMES[player.currentSource] || '未知音源' }}</div>
        </div>
        <button class="p-2 -mr-2 text-gray-400 hover:text-white transition-colors" @click="showQueue = !showQueue">
          <ListOutline class="w-5 h-5" />
        </button>
      </div>

      <!-- Main: Cover / Lyrics toggle -->
      <div class="relative flex-1 flex flex-col items-center overflow-hidden" @click="showLyrics = !showLyrics">
        <!-- Cover + Vinyl -->
        <Transition name="fade">
          <div v-if="!showLyrics" class="flex-1 flex flex-col items-center justify-center w-full px-6 pt-2">
            <!-- Vinyl disc behind cover -->
            <div class="relative mb-10">
              <div
                class="vinyl-disc w-56 h-56 sm:w-72 sm:h-72 shadow-2xl"
                :class="{ 'cover-spinning': player.isPlaying }"
              />
              <!-- Cover on top -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-36 h-36 sm:w-48 sm:h-48 rounded-full overflow-hidden shadow-2xl ring-4 ring-surface-950/50">
                  <img v-if="song.cover" :src="song.cover" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full bg-gradient-to-br from-brand-500 to-red-700 flex items-center justify-center text-3xl">🎵</div>
                </div>
              </div>
            </div>

            <!-- Song info -->
            <div class="text-center w-full max-w-sm">
              <h1 class="text-lg sm:text-xl font-bold truncate">{{ song.title }}</h1>
              <p class="text-sm text-gray-400 mt-1.5">{{ song.artist }} · {{ song.album }}</p>
            </div>
          </div>
        </Transition>

        <!-- Lyrics overlay -->
        <Transition name="fade">
          <div v-if="showLyrics" class="absolute inset-0 flex items-center justify-center bg-surface-950/60 backdrop-blur-md">
            <LyricDisplay class="w-full max-w-lg h-full" />
          </div>
        </Transition>
      </div>

      <!-- Controls (always visible) -->
      <div class="relative w-full max-w-md mx-auto px-6 pb-6">
        <!-- Progress -->
        <div class="mb-3">
          <div
            class="h-1 bg-white/10 rounded-full cursor-pointer group relative"
            @click="onProgressClick"
          >
            <div class="h-full bg-brand-500 rounded-full relative transition-all duration-200" :style="{ width: `${progressPercent}%` }">
              <div class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-all shadow-lg shadow-brand-500/50" />
            </div>
          </div>
          <div class="flex justify-between mt-1.5 text-[11px] text-gray-500 font-mono">
            <span>{{ formatTime(player.progress) }}</span>
            <span>{{ formatTime(player.duration) }}</span>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex items-center justify-between">
          <button class="p-2 text-gray-400 hover:text-white transition-colors" @click="toggleLike">
            <Heart v-if="isLiked" class="w-6 h-6 text-brand-500" />
            <HeartOutline v-else class="w-6 h-6" />
          </button>

          <button class="p-2 text-gray-400 hover:text-white transition-colors" @click="skipBack">
            <PlaySkipBack class="w-7 h-7" />
          </button>

          <button
            class="p-4 bg-white rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-white/20"
            @click="player.togglePlay()"
          >
            <Pause v-if="player.isPlaying" class="w-7 h-7 text-black" />
            <Play v-else class="w-7 h-7 text-black ml-0.5" />
          </button>

          <button class="p-2 text-gray-400 hover:text-white transition-colors" @click="skipForward">
            <PlaySkipForward class="w-7 h-7" />
          </button>

          <button
            class="p-2 transition-colors text-xs font-medium"
            :class="player.mode === 'list' ? 'text-gray-500' : 'text-brand-400'"
            @click="player.toggleMode()"
          >
            <Shuffle v-if="player.mode === 'shuffle'" class="w-5 h-5" />
            <Repeat v-else class="w-5 h-5" :class="{ 'text-brand-400': player.mode === 'single' }" />
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
