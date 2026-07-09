<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/playerStore'
import { useUserStore } from '@/stores/userStore'
import {
  Play, Pause, PlaySkipForward, PlaySkipBack,
  Heart, HeartOutline,
} from '@vicons/ionicons5'

const router = useRouter()
const player = usePlayerStore()
const user = useUserStore()

const song = computed(() => player.currentSong)
const progressPercent = computed(() =>
  player.duration > 0 ? (player.progress / player.duration) * 100 : 0
)
const isLiked = computed(() => song.value ? user.isFavorite(song.value) : false)

function toggleLike() { if (song.value) user.toggleFavorite(song.value) }
</script>

<template>
  <div
    v-if="song"
    class="fixed bottom-14 lg:bottom-0 left-0 right-0 z-30 lg:relative bg-surface-900/80 backdrop-blur-2xl border-t border-white/5"
  >
    <!-- Progress -->
    <div class="h-[2px] bg-white/5">
      <div class="h-full bg-brand-500 transition-all duration-300 rounded-r-sm" :style="{ width: `${progressPercent}%` }" />
    </div>

    <div class="flex items-center gap-3 px-3 py-2">
      <!-- Cover -->
      <div
        class="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer shadow-lg ring-1 ring-white/5"
        @click="router.push('/player')"
      >
        <img v-if="song.cover" :src="song.cover" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full bg-gradient-to-br from-brand-500 to-red-600 flex items-center justify-center text-sm">♪</div>
      </div>

      <!-- Info -->
      <div class="flex-1 min-w-0 cursor-pointer" @click="router.push('/player')">
        <div class="text-[13px] font-medium truncate leading-tight">{{ song.title }}</div>
        <div class="text-[11px] text-gray-500 truncate mt-0.5">{{ song.artist }}</div>
      </div>

      <!-- Controls -->
      <div class="flex items-center gap-0.5">
        <button class="p-2 text-gray-400 hover:text-brand-400 transition-colors" @click.stop="toggleLike">
          <Heart v-if="isLiked" class="w-[18px] h-[18px] text-brand-500" />
          <HeartOutline v-else class="w-[18px] h-[18px]" />
        </button>
        <button
          class="p-2 text-gray-400 hover:text-white transition-colors"
          :class="{ 'opacity-40 pointer-events-none': !player.hasPrev }"
          @click="player.prev()"
        >
          <PlaySkipBack class="w-[18px] h-[18px]" />
        </button>
        <button
          class="p-2 text-white hover:scale-105 transition-transform"
          @click="player.togglePlay()"
        >
          <Pause v-if="player.isPlaying" class="w-6 h-6" />
          <Play v-else class="w-6 h-6" />
        </button>
        <button
          class="p-2 text-gray-400 hover:text-white transition-colors"
          :class="{ 'opacity-40 pointer-events-none': !player.hasNext }"
          @click="player.next()"
        >
          <PlaySkipForward class="w-[18px] h-[18px]" />
        </button>
      </div>
    </div>
  </div>
</template>
