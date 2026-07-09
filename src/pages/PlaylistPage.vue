<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePlayerStore } from '@/stores/playerStore'
import { getPlaylistDetail } from '@/api/musicApi'
import type { MusicSource } from '@/api/musicApi'
import type { Song } from '@/stores/playerStore'
import SongList from '@/components/SongList.vue'
import { PlayCircleOutline, HeartOutline, DownloadOutline, ShareOutline } from '@vicons/ionicons5'

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

function playAll() {
  if (playlist.value?.songs) {
    player.playQueue(playlist.value.songs, 0)
  }
}

function playSong(song: Song, songs: Song[], index: number) {
  player.playQueue(songs, index)
}
</script>

<template>
  <div class="h-full overflow-y-auto">
    <div v-if="loading" class="flex items-center justify-center h-full">
      <div class="animate-spin w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full" />
    </div>

    <template v-else-if="playlist">
      <!-- Header -->
      <div class="relative">
        <div class="absolute inset-0 bg-gradient-to-b from-surface-800 to-surface-950" />
        <div class="relative flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8">
          <!-- Cover -->
          <div class="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 bg-surface-800">
            <img
              v-if="playlist.cover"
              :src="playlist.cover"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-4xl">🎵</div>
          </div>

          <!-- Info -->
          <div class="flex-1 text-center sm:text-left">
            <h1 class="text-2xl font-bold mb-2">{{ playlist.name }}</h1>
            <p class="text-sm text-gray-400 mb-1">
              {{ playlist.creator }} · {{ playlist.songs?.length || 0 }} 首
            </p>
            <p v-if="playlist.description" class="text-sm text-gray-500 line-clamp-2 mb-4">
              {{ playlist.description }}
            </p>
            <div class="flex items-center justify-center sm:justify-start gap-3">
              <button
                class="flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-500 rounded-full text-sm font-medium transition-colors"
                @click="playAll"
              >
                <PlayCircleOutline class="w-5 h-5" />
                播放全部
              </button>
              <button class="p-2.5 rounded-full border border-surface-600 text-gray-400 hover:text-white hover:border-surface-500 transition-colors">
                <HeartOutline class="w-5 h-5" />
              </button>
              <button class="p-2.5 rounded-full border border-surface-600 text-gray-400 hover:text-white hover:border-surface-500 transition-colors">
                <ShareOutline class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Song list -->
      <div class="px-4 pb-20">
        <SongList
          :songs="playlist.songs || []"
          :show-index="true"
          :show-cover="true"
          :show-album="true"
          @play="(song, idx) => playSong(song, playlist.songs, idx)"
        />
      </div>
    </template>

    <div v-else class="flex flex-col items-center justify-center h-full text-gray-500">
      <span class="text-4xl mb-3">😕</span>
      <p>歌单加载失败</p>
    </div>
  </div>
</template>
