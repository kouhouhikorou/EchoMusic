<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/playerStore'
import { useUserStore } from '@/stores/userStore'
import { getRecommendPlaylists } from '@/api/musicApi'
import SongList from '@/components/SongList.vue'
import type { Song } from '@/stores/playerStore'
import { SearchOutline, PlayCircleOutline } from '@vicons/ionicons5'

const router = useRouter()
const player = usePlayerStore()
const user = useUserStore()

const recommendPlaylists = ref<any[]>([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  recommendPlaylists.value = await getRecommendPlaylists('netease', 12)
  loading.value = false
})

function playSong(song: Song, songs: Song[], index: number) {
  player.playQueue(songs, index)
}
</script>

<template>
  <div class="h-full overflow-y-auto">
    <div class="max-w-5xl mx-auto px-4 py-6 lg:py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">发现音乐</h2>
        <div
          class="flex items-center gap-2 px-4 py-2 bg-surface-800 rounded-xl text-sm text-gray-400 cursor-pointer hover:text-white transition-colors lg:hidden"
          @click="router.push('/search')"
        >
          <SearchOutline class="w-4 h-4" />
          <span>搜索</span>
        </div>
      </div>

      <!-- Quick Entry: Recent + Favorites -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div
          class="flex items-center gap-3 p-4 bg-surface-850 rounded-xl cursor-pointer hover:bg-surface-800 transition-colors"
          @click="router.push('/recent')"
        >
          <div class="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-400">
            <PlayCircleOutline class="w-5 h-5" />
          </div>
          <span class="text-sm font-medium">最近播放</span>
        </div>
        <div
          class="flex items-center gap-3 p-4 bg-surface-850 rounded-xl cursor-pointer hover:bg-surface-800 transition-colors"
          @click="router.push('/favorites')"
        >
          <div class="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center text-red-400">
            ❤️
          </div>
          <span class="text-sm font-medium">我喜欢的</span>
        </div>
        <div
          class="flex items-center gap-3 p-4 bg-surface-850 rounded-xl cursor-pointer hover:bg-surface-800 transition-colors"
          @click="router.push('/local')"
        >
          <div class="w-10 h-10 rounded-lg bg-green-600/20 flex items-center justify-center text-green-400">
            📁
          </div>
          <span class="text-sm font-medium">本地音乐</span>
        </div>
        <div
          class="flex items-center gap-3 p-4 bg-surface-850 rounded-xl cursor-pointer hover:bg-surface-800 transition-colors"
          @click="router.push('/download')"
        >
          <div class="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center text-purple-400">
            ⬇️
          </div>
          <span class="text-sm font-medium">下载管理</span>
        </div>
      </div>

      <!-- Recent Plays -->
      <section v-if="user.recentPlays.length > 0" class="mb-8">
        <h3 class="text-lg font-semibold mb-3">最近播放</h3>
        <SongList
          :songs="user.recentPlays.slice(0, 10)"
          :show-index="false"
          :show-cover="true"
          @play="(song, idx) => playSong(song, user.recentPlays, idx)"
        />
      </section>

      <!-- Recommended Playlists -->
      <section class="mb-8">
        <h3 class="text-lg font-semibold mb-3">推荐歌单</h3>
        <div
          v-if="loading"
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          <div
            v-for="i in 6" :key="i"
            class="aspect-square rounded-xl bg-surface-800 animate-pulse"
          />
        </div>
        <div
          v-else
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          <div
            v-for="pl in recommendPlaylists"
            :key="pl.id"
            class="group cursor-pointer"
            @click="router.push(`/playlist/${pl.id}`)"
          >
            <div class="aspect-square rounded-xl overflow-hidden mb-2 bg-surface-800">
              <img
                v-if="pl.picUrl || pl.coverImgUrl"
                :src="pl.picUrl || pl.coverImgUrl"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-600 text-2xl">🎵</div>
            </div>
            <div class="text-sm line-clamp-2 text-gray-300 group-hover:text-white transition-colors">
              {{ pl.name }}
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
