<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { usePlayerStore } from '@/stores/playerStore'
import { useUserStore } from '@/stores/userStore'
import { useMediaSession } from '@/composables/useMediaSession'
import { SOURCE_NAMES } from '@/api/musicApi'
import LyricDisplay from '@/components/LyricDisplay.vue'
import { Play, Pause, PlaySkipForward, PlaySkipBack, Shuffle, Repeat, ChevronDown, Heart, HeartOutline, ListOutline } from '@vicons/ionicons5'

const player = usePlayerStore()
const user = useUserStore()
const showLyrics = ref(false)
useMediaSession()

const song = computed(() => player.currentSong)
const progressPercent = computed(() => player.duration > 0 ? (player.progress / player.duration) * 100 : 0)
const isLiked = computed(() => song.value ? user.isFavorite(song.value) : false)

function fmt(s: number): string {
  if (!s || !isFinite(s)) return '00:00'
  const m = Math.floor(s / 60), sec = Math.floor(s % 60)
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
}
function onBarClick(e: MouseEvent) {
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  player.setProgress(((e.clientX - r.left) / r.width) * player.duration)
}
function toggleLike() { if (song.value) user.toggleFavorite(song.value) }
function skipBack() { player.progress > 3 ? player.setProgress(0) : player.prev() }
function skipFwd() { player.setProgress(Math.min(player.duration, player.progress + 15)) }
</script>

<template>
  <div class="h-full flex flex-col relative" :style="song?.cover ? { backgroundImage: `url(${song.cover})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}">
    <!-- Blur backdrop -->
    <div class="absolute inset-0 bg-white/90 backdrop-blur-3xl" />

    <div v-if="!song" class="relative flex-1 flex flex-col items-center justify-center text-[#ccc] gap-4">
      <span class="text-7xl">🎵</span>
      <p class="text-sm">暂无播放歌曲</p>
    </div>

    <template v-else>
      <!-- Top -->
      <div class="relative flex items-center justify-between px-5 py-4">
        <button class="p-2 -ml-2 text-[#666] hover:text-[#333]" @click="$router.back()"><ChevronDown class="w-6 h-6" /></button>
        <div class="text-xs text-[#999] uppercase tracking-wider">{{ SOURCE_NAMES[player.currentSource] || '' }}</div>
        <button class="p-2 -mr-2 text-[#666] hover:text-[#333]" @click="showLyrics = !showLyrics">
          <ListOutline class="w-5 h-5" :class="{ 'text-[#ec4141]': showLyrics }" />
        </button>
      </div>

      <!-- Content -->
      <div class="relative flex-1 flex flex-col items-center justify-center overflow-hidden px-6">
        <Transition name="fade">
          <div v-if="!showLyrics" class="flex flex-col items-center w-full max-w-sm">
            <!-- Large cover -->
            <div class="w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden shadow-2xl mb-8 ring-1 ring-black/5">
              <img v-if="song.cover" :src="song.cover" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full bg-gradient-to-br from-[#ec4141] to-[#ff6b6b] flex items-center justify-center text-5xl">♪</div>
            </div>

            <!-- Info -->
            <div class="text-center w-full mb-2">
              <h1 class="text-xl font-bold text-[#1a1a1a] truncate">{{ song.title }}</h1>
              <p class="text-sm text-[#999] mt-1.5">{{ song.artist }} · {{ song.album }}</p>
            </div>
          </div>
        </Transition>

        <Transition name="fade">
          <LyricDisplay v-if="showLyrics" class="absolute inset-0 bg-white/60 backdrop-blur-md w-full h-full" />
        </Transition>
      </div>

      <!-- Controls -->
      <div class="relative w-full max-w-sm mx-auto px-6 pb-8">
        <div class="mb-3">
          <div class="h-1 bg-[#e8e8e8] rounded-full cursor-pointer group relative" @click="onBarClick">
            <div class="h-full bg-[#ec4141] rounded-full relative transition-all duration-200" :style="{ width: `${progressPercent}%` }">
              <div class="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#ec4141] opacity-0 group-hover:opacity-100 transition-all shadow-md" />
            </div>
          </div>
          <div class="flex justify-between mt-1.5 text-[11px] text-[#ccc] font-mono">
            <span>{{ fmt(player.progress) }}</span><span>{{ fmt(player.duration) }}</span>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <button class="p-2 text-[#999] hover:text-[#ec4141]" @click="toggleLike">
            <Heart v-if="isLiked" class="w-6 h-6 text-[#ec4141]" /><HeartOutline v-else class="w-6 h-6" />
          </button>
          <button class="p-2 text-[#666] hover:text-[#333]" @click="skipBack"><PlaySkipBack class="w-7 h-7" /></button>
          <button class="p-4 bg-[#ec4141] rounded-full hover:bg-[#d63636] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#ec4141]/30"
            @click="player.togglePlay()">
            <Pause v-if="player.isPlaying" class="w-7 h-7 text-white" />
            <Play v-else class="w-7 h-7 text-white ml-0.5" />
          </button>
          <button class="p-2 text-[#666] hover:text-[#333]" @click="skipFwd"><PlaySkipForward class="w-7 h-7" /></button>
          <button class="p-2" :class="player.mode === 'list' ? 'text-[#ccc]' : 'text-[#ec4141]'" @click="player.toggleMode()">
            <Shuffle v-if="player.mode === 'shuffle'" class="w-5 h-5" />
            <Repeat v-else class="w-5 h-5" />
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
