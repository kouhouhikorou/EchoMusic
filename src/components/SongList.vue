<script setup lang="ts">
import type { Song } from '@/stores/playerStore'
import { SOURCE_NAMES } from '@/api/musicApi'

defineProps<{ songs: Song[]; showIndex?: boolean; showCover?: boolean; showAlbum?: boolean }>()
const emit = defineEmits<{ (e: 'play', song: Song, index: number): void }>()
</script>

<template>
  <div v-if="songs.length === 0" class="flex flex-col items-center justify-center py-20 text-gray-600 gap-2">
    <span class="text-3xl">🎵</span>
    <p class="text-xs">暂无歌曲</p>
  </div>
  <div v-else>
    <div
      v-for="(song, idx) in songs"
      :key="`${song.source}-${song.id}`"
      class="group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all hover:bg-white/5"
      :class="{ 'bg-brand-500/5': false }"
      @click="emit('play', song, idx)"
    >
      <!-- Index -->
      <span v-if="showIndex" class="w-6 text-center text-xs text-gray-600 flex-shrink-0 tabular-nums group-hover:hidden">
        {{ idx + 1 }}
      </span>
      <span v-else class="w-1" />

      <!-- Cover -->
      <div v-if="showCover" class="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-surface-800 ring-1 ring-white/5">
        <img v-if="song.cover" :src="song.cover" class="w-full h-full object-cover" loading="lazy" />
        <div v-else class="w-full h-full flex items-center justify-center text-gray-600 text-xs">♪</div>
      </div>

      <!-- Info -->
      <div class="flex-1 min-w-0">
        <div class="text-[13px] font-medium truncate leading-snug group-hover:text-brand-400 transition-colors">{{ song.title }}</div>
        <div class="text-[11px] text-gray-500 truncate mt-0.5">
          {{ song.artist }}
          <template v-if="showAlbum && song.album"> · {{ song.album }}</template>
        </div>
      </div>

      <!-- Source badge -->
      <span class="text-[10px] text-gray-600 bg-white/5 px-1.5 py-0.5 rounded flex-shrink-0 hidden sm:block">
        {{ SOURCE_NAMES[song.source] || song.source }}
      </span>

      <!-- Duration -->
      <span class="text-[11px] text-gray-600 flex-shrink-0 w-10 text-right tabular-nums hidden sm:block">
        {{ formatTime(song.duration) }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
function formatTime(s: number): string {
  if (!s || !isFinite(s)) return '--:--'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${String(sec).padStart(2, '0')}`
}
</script>
