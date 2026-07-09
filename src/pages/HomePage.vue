<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/playerStore'
import { useUserStore } from '@/stores/userStore'
import { getRecommendPlaylists } from '@/api/musicApi'
import type { Song } from '@/stores/playerStore'
import SongList from '@/components/SongList.vue'
import { SearchOutline, PlayCircleOutline, ChevronForward, Play } from '@vicons/ionicons5'

const router = useRouter()
const player = usePlayerStore()
const user = useUserStore()

const recommendPlaylists = ref<any[]>([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  recommendPlaylists.value = await getRecommendPlaylists('netease', 10)
  loading.value = false
})

function playSong(song: Song, songs: Song[], index: number) {
  player.playQueue(songs, index)
}
</script>

<template>
  <div class="h-full overflow-y-auto">
    <div class="max-w-5xl mx-auto px-5 py-6 lg:py-8">
      <!-- Hero banner -->
      <div
        class="relative rounded-2xl overflow-hidden mb-8 cursor-pointer group"
        @click="router.push('/search')"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-500 to-orange-500 opacity-90" />
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <div class="relative flex items-center justify-between px-6 py-8 sm:px-8 sm:py-10">
          <div>
            <h2 class="text-xl sm:text-2xl font-bold text-white mb-1.5">发现你的音乐</h2>
            <p class="text-sm text-white/70">搜索网易云 · QQ · 酷狗 · Bilibili 多平台歌曲</p>
          </div>
          <div class="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:bg-white/30 transition-all group-hover:scale-105">
            <SearchOutline class="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <!-- Quick entry -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div
          class="flex items-center gap-3 px-4 py-3.5 bg-surface-900/70 rounded-xl cursor-pointer hover:bg-surface-800 transition-all border border-white/5 hover:border-white/10"
          @click="router.push('/recent')"
        >
          <div class="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <PlayCircleOutline class="w-5 h-5 text-blue-400" />
          </div>
          <span class="text-[13px] font-medium">最近播放</span>
        </div>
        <div
          class="flex items-center gap-3 px-4 py-3.5 bg-surface-900/70 rounded-xl cursor-pointer hover:bg-surface-800 transition-all border border-white/5 hover:border-white/10"
          @click="router.push('/favorites')"
        >
          <div class="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center">
            <span class="text-base">♥</span>
          </div>
          <span class="text-[13px] font-medium">我喜欢的</span>
        </div>
        <div
          class="flex items-center gap-3 px-4 py-3.5 bg-surface-900/70 rounded-xl cursor-pointer hover:bg-surface-800 transition-all border border-white/5 hover:border-white/10"
          @click="router.push('/local')"
        >
          <div class="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center">
            <span class="text-base">📂</span>
          </div>
          <span class="text-[13px] font-medium">本地音乐</span>
        </div>
        <div
          class="flex items-center gap-3 px-4 py-3.5 bg-surface-900/70 rounded-xl cursor-pointer hover:bg-surface-800 transition-all border border-white/5 hover:border-white/10"
          @click="router.push('/download')"
        >
          <div class="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <span class="text-base">⬇</span>
          </div>
          <span class="text-[13px] font-medium">下载管理</span>
        </div>
      </div>

      <!-- Recent plays -->
      <section v-if="user.recentPlays.length > 0" class="mb-8">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-base font-semibold">最近播放</h3>
          <button class="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1" @click="router.push('/recent')">
            查看全部 <ChevronForward class="w-3 h-3" />
          </button>
        </div>
        <div class="bg-surface-900/50 rounded-xl border border-white/5 overflow-hidden">
          <SongList
            :songs="user.recentPlays.slice(0, 8)"
            :show-cover="true"
            @play="(song, idx) => playSong(song, user.recentPlays, idx)"
          />
        </div>
      </section>

      <!-- Recommended playlists -->
      <section class="mb-8">
        <h3 class="text-base font-semibold mb-4">推荐歌单</h3>
        <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div v-for="i in 5" :key="i" class="aspect-square rounded-xl bg-surface-800 animate-pulse" />
        </div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div
            v-for="pl in recommendPlaylists"
            :key="pl.id"
            class="group cursor-pointer"
            @click="router.push(`/playlist/${pl.id}`)"
          >
            <div class="relative aspect-square rounded-xl overflow-hidden mb-2.5 bg-surface-800 shadow-lg">
              <img
                v-if="pl.picUrl || pl.coverImgUrl"
                :src="pl.picUrl || pl.coverImgUrl"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-600 text-2xl">🎵</div>
              <!-- Play count overlay -->
              <div v-if="pl.playCount" class="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/50 text-[10px] text-white/80">
                <ChevronForward class="w-2.5 h-2.5" />
                {{ pl.playCount > 10000 ? `${(pl.playCount / 10000).toFixed(1)}万` : pl.playCount }}
              </div>
              <!-- Hover play button -->
              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                <div class="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                  <Play class="w-4 h-4 text-black ml-0.5" />
                </div>
              </div>
            </div>
            <div class="text-[13px] leading-snug line-clamp-2 text-gray-300 group-hover:text-white transition-colors">
              {{ pl.name }}
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
