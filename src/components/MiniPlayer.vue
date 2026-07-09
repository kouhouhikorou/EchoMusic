<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/playerStore'
import { useUserStore } from '@/stores/userStore'
import {
  Play, Pause, PlaySkipForward, PlaySkipBack,
  Heart, HeartOutline, ExpandOutline,
} from '@vicons/ionicons5'

const router = useRouter()
const player = usePlayerStore()
const user = useUserStore()

const song = computed(() => player.currentSong)
const progressPercent = computed(() =>
  player.duration > 0 ? (player.progress / player.duration) * 100 : 0
)

const isLiked = computed(() => song.value ? user.isFavorite(song.value) : false)

function toggleLike() {
  if (song.value) user.toggleFavorite(song.value)
}

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
</script>

<template>
  <div
    v-if="song"
    class="fixed bottom-14 lg:bottom-0 left-0 right-0 z-30 lg:relative bg-surface-925/95 backdrop-blur-xl border-t border-surface-700 lg:border-t"
    :class="$attrs.class"
  >
    <!-- Progress bar -->
    <div class="h-0.5 bg-surface-700">
      <div
        class="h-full bg-brand-500 transition-all duration-300"
        :style="{ width: `${progressPercent}%` }"
      />
    </div>

    <div class="flex items-center gap-3 px-3 py-2.5 lg:py-2">
      <!-- Cover -->
      <div
        class="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 cursor-pointer"
        :class="{ 'cover-spinning': player.isPlaying && user.settings.coverSpin }"
        @click="router.push('/player')"
      >
        <img
          v-if="song.cover"
          :src="song.cover"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full bg-gradient-to-br from-brand-600 to-purple-600" />
      </div>

      <!-- Info -->
      <div class="flex-1 min-w-0 cursor-pointer" @click="router.push('/player')">
        <div class="text-sm font-medium truncate">{{ song.title }}</div>
        <div class="text-xs text-gray-400 truncate">{{ song.artist }}</div>
      </div>

      <!-- Controls -->
      <div class="flex items-center gap-1">
        <button
          class="p-2 text-gray-400 hover:text-white transition-colors"
          @click.stop="toggleLike"
        >
          <Heart v-if="isLiked" class="w-5 h-5 text-red-500" />
          <HeartOutline v-else class="w-5 h-5" />
        </button>

        <button
          class="p-2 text-gray-400 hover:text-white transition-colors"
          :class="{ 'opacity-50': !player.hasPrev }"
          :disabled="!player.hasPrev"
          @click="player.prev()"
        >
          <PlaySkipBack class="w-5 h-5" />
        </button>

        <button
          class="p-2 text-white bg-white/10 rounded-full hover:bg-white/20 transition-colors"
          @click="player.togglePlay()"
        >
          <Pause v-if="player.isPlaying" class="w-5 h-5" />
          <Play v-else class="w-5 h-5" />
        </button>

        <button
          class="p-2 text-gray-400 hover:text-white transition-colors"
          :class="{ 'opacity-50': !player.hasNext }"
          :disabled="!player.hasNext"
          @click="player.next()"
        >
          <PlaySkipForward class="w-5 h-5" />
        </button>

        <button
          class="p-2 text-gray-400 hover:text-white transition-colors hidden lg:block"
          @click="router.push('/player')"
        >
          <ExpandOutline class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
