<script setup lang="ts">
import { usePlayerStore } from '@/stores/playerStore'
import { useUserStore } from '@/stores/userStore'
import type { Song } from '@/stores/playerStore'
import SongList from '@/components/SongList.vue'

const player = usePlayerStore()
const user = useUserStore()

function playSong(song: Song, songs: Song[], index: number) {
  player.playQueue(songs, index)
}
</script>

<template>
  <div class="h-full overflow-y-auto">
    <div class="max-w-4xl mx-auto px-4 py-6">
      <h2 class="text-2xl font-bold mb-6">我喜欢的音乐</h2>

      <SongList
        :songs="user.favorites"
        :show-index="true"
        :show-cover="true"
        :show-album="true"
        @play="(song, idx) => playSong(song, user.favorites, idx)"
      />
    </div>
  </div>
</template>
