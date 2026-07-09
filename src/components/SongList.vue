<script setup lang="ts">
import type { Song } from '@/stores/playerStore'
import { SOURCE_NAMES } from '@/api/musicApi'

defineProps<{ songs: Song[]; showIndex?: boolean; showCover?: boolean; showAlbum?: boolean }>()
const emit = defineEmits<{ (e: 'play', song: Song, index: number): void }>()
</script>

<template>
  <div v-if="songs.length === 0" class="flex flex-col items-center justify-center py-20 text-[#ccc] gap-2">
    <span class="text-3xl">🎵</span><p class="text-xs">暂无歌曲</p>
  </div>
  <div v-else>
    <div
      v-for="(song, idx) in songs"
      :key="`${song.source}-${song.id}`"
      class="flex items-center gap-3 px-4 py-2.5 min-h-[48px] cursor-pointer transition-colors hover:bg-[#f5f5f5] group"
      :class="idx % 2 === 1 ? 'bg-[#fafafa]' : 'bg-white'"
      @click="emit('play', song, idx)"
    >
      <span v-if="showIndex" class="w-7 text-center text-xs text-[#ccc] tabular-nums flex-shrink-0">{{ idx + 1 }}</span>

      <div v-if="showCover" class="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-[#f0f0f0]">
        <img v-if="song.cover" :src="song.cover" class="w-full h-full object-cover" loading="lazy" alt="" />
        <div v-else class="w-full h-full flex items-center justify-center text-[#ddd] text-xs">♪</div>
      </div>

      <div class="flex-1 min-w-0">
        <div class="text-[13px] font-medium truncate text-[#333] group-hover:text-[#ec4141] transition-colors">{{ song.title }}</div>
        <div class="text-[11px] text-[#999] truncate mt-0.5">
          {{ song.artist }}<template v-if="showAlbum && song.album"> · {{ song.album }}</template>
        </div>
      </div>

      <span class="text-[10px] text-[#ccc] bg-[#f5f5f5] px-1.5 py-0.5 rounded hidden sm:block">{{ SOURCE_NAMES[song.source] || song.source }}</span>
      <span class="text-[11px] text-[#ccc] w-10 text-right tabular-nums hidden sm:block">{{ fmt(song.duration) }}</span>
    </div>
  </div>
</template>

<script lang="ts">
function fmt(s: number): string {
  if (!s || !isFinite(s)) return '--:--'
  const m = Math.floor(s / 60), sec = Math.floor(s % 60)
  return `${m}:${String(sec).padStart(2,'0')}`
}
</script>
