<script setup lang="ts">
import { usePlayerStore } from '@/stores/playerStore'
import { useUserStore } from '@/stores/userStore'
import type { Song } from '@/stores/playerStore'
import SongList from '@/components/SongList.vue'

const player = usePlayerStore()
const user = useUserStore()
function play(s: Song, l: Song[], i: number) { player.playQueue(l, i) }
</script>

<template>
  <div class="h-full overflow-y-auto bg-[#fafafa]">
    <div class="max-w-[900px] mx-auto px-6 py-6">
      <h2 class="text-[22px] font-bold text-[#1a1a1a] mb-6">我喜欢的音乐</h2>
      <div class="bg-white rounded-xl border border-[#f0f0f0] overflow-hidden">
        <SongList :songs="user.favorites" :show-index="true" :show-cover="true" :show-album="true" @play="(s, i) => play(s, user.favorites, i)" />
      </div>
    </div>
  </div>
</template>
