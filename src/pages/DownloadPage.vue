<script setup lang="ts">
import { usePlayerStore } from '@/stores/playerStore'
import type { Song } from '@/stores/playerStore'
import SongList from '@/components/SongList.vue'

const player = usePlayerStore()

// Download functionality placeholder (Phase 4)
const downloads: Song[] = []

function playSong(song: Song, songs: Song[], index: number) {
  player.playQueue(songs, index)
}
</script>

<template>
  <div class="h-full overflow-y-auto">
    <div class="max-w-4xl mx-auto px-4 py-6">
      <h2 class="text-2xl font-bold mb-6">下载管理</h2>

      <div v-if="downloads.length === 0" class="flex flex-col items-center justify-center py-20 text-gray-600">
        <span class="text-4xl mb-3">📥</span>
        <p class="text-sm">暂无下载</p>
        <p class="text-xs mt-1">下载功能将在后续版本中推出</p>
      </div>

      <SongList
        v-else
        :songs="downloads"
        :show-index="true"
        :show-cover="true"
        @play="(song, idx) => playSong(song, downloads, idx)"
      />
    </div>
  </div>
</template>
