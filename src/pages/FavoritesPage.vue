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
  <div>
    <div class="section-title">我喜欢的音乐</div>
    <SongList :songs="user.favorites" type="playlist" :show-index="true" :show-album="true" @play="(s, i) => play(s, user.favorites, i)" />
  </div>
</template>

<style scoped>
.section-title {
  font-size: 28px; font-weight: 700; color: var(--color-text); margin-bottom: 20px; margin-top: 24px;
}
</style>
