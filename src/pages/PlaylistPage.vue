<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePlayerStore } from '@/stores/playerStore'
import { getPlaylistDetail } from '@/api/musicApi'
import type { MusicSource } from '@/api/musicApi'
import type { Song } from '@/stores/playerStore'
import SongList from '@/components/SongList.vue'
import { PlayCircleOutline, HeartOutline, ShareOutline } from '@vicons/ionicons5'

const route = useRoute()
const player = usePlayerStore()
const playlist = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  const id = route.params.id as string
  const source = (route.query.source as MusicSource) || 'netease'
  loading.value = true
  playlist.value = await getPlaylistDetail(id, source)
  loading.value = false
})

function playAll() { if (playlist.value?.songs) player.playQueue(playlist.value.songs, 0) }
function playSong(s: Song, songs: Song[], i: number) { player.playQueue(songs, i) }
</script>

<template>
  <div class="h-full overflow-y-auto">
    <div v-if="loading" class="flex items-center justify-center h-full"><div class="w-7 h-7 border-2 border-[#ec4141] border-t-transparent rounded-full animate-spin" /></div>

    <template v-else-if="playlist">
      <div class="relative">
        <div class="absolute inset-0 bg-gradient-to-b from-[#fef0f0] via-white to-white" />
        <div class="relative flex flex-col sm:flex-row items-center gap-5 p-6 sm:p-8 pt-10 sm:pt-12">
          <div class="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shadow-lg flex-shrink-0 bg-[#f0f0f0] ring-1 ring-black/5">
            <img v-if="playlist.cover" :src="playlist.cover" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-4xl">🎵</div>
          </div>
          <div class="flex-1 text-center sm:text-left">
            <div class="text-xs text-[#999] uppercase tracking-wider mb-1">歌单</div>
            <h1 class="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-2 line-clamp-2">{{ playlist.name }}</h1>
            <p class="text-sm text-[#999] mb-1">{{ playlist.creator }} · {{ playlist.songs?.length || 0 }} 首</p>
            <p v-if="playlist.description" class="text-xs text-[#ccc] line-clamp-2 mb-4">{{ playlist.description }}</p>
            <div class="flex items-center justify-center sm:justify-start gap-2.5">
              <button class="flex items-center gap-2 px-6 py-2.5 bg-[#ec4141] hover:bg-[#d63636] rounded-full text-sm font-medium text-white transition-all shadow-lg shadow-[#ec4141]/25 active:scale-95" @click="playAll">
                <PlayCircleOutline class="w-5 h-5" /> 播放全部
              </button>
              <button class="p-2.5 rounded-full border border-[#e8e8e8] text-[#999] hover:text-[#ec4141] hover:border-[#ec4141]/30 transition-all bg-white">
                <HeartOutline class="w-5 h-5" />
              </button>
              <button class="p-2.5 rounded-full border border-[#e8e8e8] text-[#999] hover:text-[#666] hover:border-[#ccc] transition-all bg-white">
                <ShareOutline class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="px-4 pb-24">
        <SongList :songs="playlist.songs || []" :show-index="true" :show-cover="true" :show-album="true" @play="(s, i) => playSong(s, playlist.songs, i)" />
      </div>
    </template>

    <div v-else class="flex flex-col items-center justify-center h-full text-[#ccc] gap-3"><span class="text-4xl">😕</span><p class="text-sm">加载失败</p></div>
  </div>
</template>
