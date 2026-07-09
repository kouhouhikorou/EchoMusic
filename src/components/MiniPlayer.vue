<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/playerStore'
import { useUserStore } from '@/stores/userStore'
import { Play, Pause, PlaySkipForward, PlaySkipBack, Heart, HeartOutline } from '@vicons/ionicons5'

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
    class="fixed bottom-14 lg:bottom-0 left-0 right-0 z-30 lg:relative bg-white/82 backdrop-blur-xl border-t border-[#e8e8e8]"
  >
    <div class="h-[3px] bg-[#f0f0f0]">
      <div class="h-full bg-[#ec4141] rounded-r-sm transition-all duration-300" :style="{ width: `${progressPercent}%` }" />
    </div>

    <div class="flex items-center gap-3 px-3 py-2">
      <div class="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer shadow-sm" @click="router.push('/player')">
        <img v-if="song.cover" :src="song.cover" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full bg-gradient-to-br from-[#ec4141] to-[#ff6b6b] flex items-center justify-center text-white text-sm">♪</div>
      </div>

      <div class="flex-1 min-w-0 cursor-pointer" @click="router.push('/player')">
        <div class="text-[13px] font-medium truncate text-[#1a1a1a]">{{ song.title }}</div>
        <div class="text-[11px] text-[#999] truncate mt-0.5">{{ song.artist }}</div>
      </div>

      <div class="flex items-center gap-0.5">
        <button class="p-2 text-[#999] hover:text-[#ec4141] transition-colors" @click.stop="toggleLike">
          <Heart v-if="isLiked" class="w-[18px] h-[18px] text-[#ec4141]" />
          <HeartOutline v-else class="w-[18px] h-[18px]" />
        </button>
        <button class="p-2 text-[#666] hover:text-[#333] transition-colors" :class="{ 'opacity-30': !player.hasPrev }" @click="player.prev()">
          <PlaySkipBack class="w-[18px] h-[18px]" />
        </button>
        <button class="p-2 text-[#ec4141] hover:scale-105 transition-transform" @click="player.togglePlay()">
          <Pause v-if="player.isPlaying" class="w-6 h-6" />
          <Play v-else class="w-6 h-6" />
        </button>
        <button class="p-2 text-[#666] hover:text-[#333] transition-colors" :class="{ 'opacity-30': !player.hasNext }" @click="player.next()">
          <PlaySkipForward class="w-[18px] h-[18px]" />
        </button>
      </div>
    </div>
  </div>
</template>
