<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePlayerStore } from '@/stores/playerStore'
import { useUserStore } from '@/stores/userStore'
import { getPlaylistDetail } from '@/api/musicApi'
import type { MusicSource } from '@/api/musicApi'
import type { Song } from '@/stores/playerStore'
import SongList from '@/components/SongList.vue'
import { PlayCircleOutline, HeartOutline, ShareOutline } from '@vicons/ionicons5'

const route = useRoute()
const player = usePlayerStore()
const user = useUserStore()

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
function playSong(song: Song, songs: Song[], index: number) { player.playQueue(songs, index) }
</script>

<template>
  <div class="h-full overflow-y-auto">
    <div v-if="loading" class="flex items-center justify-center h-full">
      <div class="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>

    <template v-else-if="playlist">
      <!-- Header -->
      <div class="relative">
        <div class="absolute inset-0 bg-gradient-to-b from-brand-900/30 via-surface-950 to-surface-950" />
        <div class="relative flex flex-col sm:flex-row items-center gap-5 p-6 sm:p-8 pt-10 sm:pt-12">
          <div class="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 bg-surface-800 ring-1 ring-white/5">
            <img v-if="playlist.cover" :src="playlist.cover" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-4xl">🎵</div>
          </div>
          <div class="flex-1 text-center sm:text-left">
            <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">歌单</div>
            <h1 class="text-xl sm:text-2xl font-bold mb-2 line-clamp-2">{{ playlist.name }}</h1>
            <p class="text-sm text-gray-400 mb-1">{{ playlist.creator }} · {{ playlist.songs?.length || 0 }} 首</p>
            <p v-if="playlist.description" class="text-xs text-gray-600 line-clamp-2 mb-4">{{ playlist.description }}</p>
            <div class="flex items-center justify-center sm:justify-start gap-2.5">
              <button
                class="flex items-center gap-2 px-6 py-2.5 bg-brand-500 hover:bg-brand-400 rounded-full text-sm font-medium transition-all shadow-lg shadow-brand-500/25 active:scale-95"
                @click="playAll"
              >
                <PlayCircleOutline class="w-5 h-5" /> 播放全部
              </button>
              <button class="p-2.5 rounded-full border border-white/10 text-gray-400 hover:text-brand-400 hover:border-brand-500/30 transition-all">
                <HeartOutline class="w-5 h-5" />
              </button>
              <button class="p-2.5 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all">
                <ShareOutline class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Songs -->
      <div class="px-4 pb-24">
        <SongList
          :songs="playlist.songs || []"
          :show-index="true"
          :show-cover="true"
          :show-album="true"
          @play="(s, i) => playSong(s, playlist.songs, i)"
        />
      </div>
    </template>

    <div v-else class="flex flex-col items-center justify-center h-full text-gray-500 gap-3">
      <span class="text-4xl">😕</span>
      <p class="text-sm">歌单加载失败</p>
    </div>
  </div>
</template>
