<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePlayerStore } from '@/stores/playerStore'
import { useUserStore } from '@/stores/userStore'
import { getPlaylistDetail } from '@/api/musicApi'
import type { MusicSource } from '@/api/musicApi'
import type { Song } from '@/stores/playerStore'
import SongList from '@/components/SongList.vue'

const route = useRoute()
const player = usePlayerStore()
const user = useUserStore()
const playlist = ref<any>(null)
const loading = ref(true)

onMounted(() => {
  const id = route.params.id as string
  // Local playlist: look up from userStore
  if (typeof id === 'string' && id.startsWith('local-')) {
    const found = user.playlists.find(p => p.id === id)
    playlist.value = found || null
    loading.value = false
    return
  }
  // Remote playlist: fetch from API
  const source = (route.query.source as MusicSource) || 'netease'
  getPlaylistDetail(id, source).then(data => {
    playlist.value = data
  }).finally(() => {
    loading.value = false
  })
})

function playAll() { if (playlist.value?.songs) player.playQueue(playlist.value.songs, 0) }
function playSong(s: Song, songs: Song[], i: number) { player.playQueue(songs, i) }
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center py-20">
    <div class="w-8 h-8 border-[3px] border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
  </div>

  <template v-else-if="playlist">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-center gap-6 mb-8 mt-4">
      <div class="w-[200px] h-[200px] rounded-xl overflow-hidden shadow-lg flex-shrink-0 bg-[var(--color-secondary-bg)]">
        <img v-if="playlist.cover" :src="playlist.cover + '?param=512y512'" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full flex items-center justify-center text-5xl text-[var(--color-secondary)]">♪</div>
      </div>
      <div class="flex-1 text-center sm:text-left">
        <div class="text-xs text-[var(--color-secondary)] uppercase tracking-wider mb-1">歌单</div>
        <h1 class="text-2xl font-bold text-[var(--color-text)] mb-2">{{ playlist.name }}</h1>
        <p class="text-sm text-[var(--color-secondary)]">{{ playlist.creator }} · {{ playlist.songs?.length || 0 }} 首</p>
        <button
          class="mt-4 px-6 py-2.5 bg-[var(--color-primary)] hover:opacity-90 rounded-full text-sm font-semibold text-white transition-all active:scale-95"
          @click="playAll"
        >▶ 播放全部</button>
      </div>
    </div>

    <!-- Track list -->
    <SongList
      :songs="playlist.songs || []"
      type="playlist"
      :show-index="true"
      :show-album="true"
      @play="(s, i) => playSong(s, playlist.songs, i)"
    />
  </template>

  <div v-else class="flex items-center justify-center py-20 text-xl text-[var(--color-text)] opacity-28">加载失败</div>
</template>
