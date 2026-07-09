<script setup lang="ts">
import type { Song } from '@/stores/playerStore'

defineProps<{ songs: Song[]; showIndex?: boolean; showCover?: boolean; showAlbum?: boolean }>()
const emit = defineEmits<{ (e: 'play', song: Song, index: number): void }>()
</script>

<template>
  <div v-if="songs.length === 0" class="flex flex-col items-center justify-center py-16 text-gray-500">
    <div class="text-4xl mb-3">🎵</div>
    <p class="text-sm">暂无歌曲</p>
  </div>
  <div v-else class="divide-y divide-surface-800/50">
    <div
      v-for="(song, idx) in songs"
      :key="`${song.source}-${song.id}`"
      class="flex items-center gap-3 px-3 py-2.5 hover:bg-surface-800/50 cursor-pointer transition-colors group"
      @click="emit('play', song, idx)"
    >
      <span v-if="showIndex" class="w-6 text-center text-xs text-gray-500 flex-shrink-0">{{ idx + 1 }}</span>
      <div
        v-if="showCover"
        class="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-surface-800"
      >
        <img v-if="song.cover" :src="song.cover" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full flex items-center justify-center text-gray-600">
          <span class="text-xs">🎵</span>
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium truncate">{{ song.title }}</div>
        <div class="text-xs text-gray-400 truncate">
          {{ song.artist }}
          <template v-if="showAlbum && song.album"> · {{ song.album }}</template>
        </div>
      </div>
      <span class="text-xs text-gray-600 flex-shrink-0 hidden sm:block">
        {{ formatTime(song.duration) }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return '--:--'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
</script>
