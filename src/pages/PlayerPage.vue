<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { usePlayerStore } from '@/stores/playerStore'
import { useUserStore } from '@/stores/userStore'
import { useMediaSession } from '@/composables/useMediaSession'
import { SOURCE_NAMES } from '@/api/musicApi'
import CoverArt from '@/components/CoverArt.vue'
import LyricDisplay from '@/components/LyricDisplay.vue'
import {
  Play, Pause, PlaySkipForward, PlaySkipBack,
  Shuffle, Repeat,
  VolumeHigh, VolumeMute, ChevronDown,
  Heart, HeartOutline, ListOutline, AddCircleOutline,
} from '@vicons/ionicons5'
import type { Song } from '@/stores/playerStore'

const player = usePlayerStore()
const user = useUserStore()

useMediaSession()

const showQueue = ref(false)

const song = computed(() => player.currentSong)
const progressPercent = computed(() =>
  player.duration > 0 ? (player.progress / player.duration) * 100 : 0
)
const isLiked = computed(() => song.value ? user.isFavorite(song.value) : false)

const modeIcon = computed(() => {
  if (player.mode === 'single') return Repeat
  if (player.mode === 'shuffle') return Shuffle
  return Repeat
})

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function onProgressClick(e: MouseEvent) {
  const rect = (e.target as HTMLElement).getBoundingClientRect()
  const pct = (e.clientX - rect.left) / rect.width
  player.setProgress(pct * player.duration)
}

function toggleLike() {
  if (song.value) user.toggleFavorite(song.value)
}

function skipBack() {
  if (player.progress > 3) {
    player.setProgress(0)
  } else {
    player.prev()
  }
}

function skipForward() {
  player.setProgress(Math.min(player.duration, player.progress + 15))
}
</script>

<template>
  <div class="h-full flex flex-col bg-surface-950">
    <!-- Empty state -->
    <div
      v-if="!song"
      class="flex-1 flex flex-col items-center justify-center text-gray-600 gap-4"
    >
      <span class="text-6xl">🎵</span>
      <p class="text-sm">暂无播放歌曲</p>
      <p class="text-xs">去搜索或导入喜欢的音乐吧</p>
    </div>

    <template v-else>
      <!-- Top bar -->
      <div class="flex items-center justify-between px-4 py-3">
        <button
          class="p-2 text-gray-400 hover:text-white transition-colors"
          @click="$router.back()"
        >
          <ChevronDown class="w-6 h-6" />
        </button>
        <div class="text-center">
          <div class="text-xs text-gray-500">{{ SOURCE_NAMES[player.currentSource] || '未知音源' }}</div>
        </div>
        <button
          class="p-2 text-gray-400 hover:text-white transition-colors"
          @click="showQueue = !showQueue"
        >
          <ListOutline class="w-5 h-5" />
        </button>
      </div>

      <!-- Cover Area -->
      <div class="flex-1 flex flex-col items-center justify-center px-6 overflow-hidden">
        <CoverArt
          :src="song.cover"
          size="xl"
          :spinning="player.isPlaying"
          class="mb-8"
        />

        <!-- Info -->
        <div class="w-full text-center mb-6">
          <h1 class="text-xl font-bold truncate">{{ song.title }}</h1>
          <p class="text-sm text-gray-400 mt-1">{{ song.artist }} · {{ song.album }}</p>
        </div>

        <!-- Progress -->
        <div class="w-full max-w-md mb-4">
          <div
            class="h-1.5 bg-surface-700 rounded-full cursor-pointer group"
            @click="onProgressClick"
          >
            <div
              class="h-full bg-brand-500 rounded-full relative transition-all duration-200"
              :style="{ width: `${progressPercent}%` }"
            >
              <div class="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow" />
            </div>
          </div>
          <div class="flex justify-between mt-1.5 text-xs text-gray-500">
            <span>{{ formatTime(player.progress) }}</span>
            <span>{{ formatTime(player.duration) }}</span>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex items-center justify-center gap-4 w-full max-w-md mb-6">
          <button class="p-2 text-gray-400 hover:text-white transition-colors" @click="toggleLike">
            <Heart v-if="isLiked" class="w-6 h-6 text-red-500" />
            <HeartOutline v-else class="w-6 h-6" />
          </button>

          <button class="p-2 text-gray-400 hover:text-white transition-colors" @click="skipBack">
            <PlaySkipBack class="w-8 h-8" />
          </button>

          <button
            class="p-4 bg-white rounded-full hover:scale-105 transition-transform"
            @click="player.togglePlay()"
          >
            <Pause v-if="player.isPlaying" class="w-8 h-8 text-black" />
            <Play v-else class="w-8 h-8 text-black" />
          </button>

          <button class="p-2 text-gray-400 hover:text-white transition-colors" @click="skipForward">
            <PlaySkipForward class="w-8 h-8" />
          </button>

          <button
            class="p-2 transition-colors"
            :class="player.mode === 'list' ? 'text-gray-400' : 'text-brand-400'"
            @click="player.toggleMode()"
          >
            <component :is="modeIcon" class="w-5 h-5" />
          </button>
        </div>

        <!-- Lyrics -->
        <LyricDisplay class="w-full max-w-lg" />
      </div>
    </template>
  </div>
</template>
