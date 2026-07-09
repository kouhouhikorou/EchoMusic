<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/playerStore'
import { useUserStore } from '@/stores/userStore'
import { getRecommendPlaylists } from '@/api/musicApi'
import type { Song } from '@/stores/playerStore'
import SongList from '@/components/SongList.vue'
import { Play } from '@vicons/ionicons5'

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

function playSong(song: Song, songs: Song[], index: number) { player.playQueue(songs, index) }
</script>

<template>
  <div class="max-w-[1100px] mx-auto px-6 py-6">
    <!-- Quick entry cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      <div
        v-for="item in [
          { path: '/recent', label: '最近播放', icon: '🕐', bg: '#eef2ff', color: '#6366f1' },
          { path: '/favorites', label: '我喜欢的', icon: '♥', bg: '#fef0f0', color: '#ec4141' },
          { path: '/local', label: '本地音乐', icon: '📂', bg: '#f0fdf4', color: '#22c55e' },
          { path: '/download', label: '下载管理', icon: '⬇', bg: '#faf5ff', color: '#a855f7' },
        ]"
        :key="item.path"
        class="flex items-center gap-3 px-4 py-3.5 min-h-[56px] bg-white rounded-xl cursor-pointer hover:shadow-md transition-shadow border border-[#f0f0f0]"
        @click="router.push(item.path)"
      >
        <div class="w-9 h-9 rounded-lg flex items-center justify-center text-sm shrink-0" :style="{ background: item.bg, color: item.color }">
          {{ item.icon }}
        </div>
        <span class="text-[13px] font-medium text-[#1a1a1a]">{{ item.label }}</span>
      </div>
    </div>

    <!-- Recent plays -->
    <section v-if="user.recentPlays.length > 0" class="mb-8">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-bold text-[#1a1a1a]">最近播放</h3>
        <button class="text-[13px] text-[#999] hover:text-[#666] cursor-pointer" @click="router.push('/recent')">查看全部 →</button>
      </div>
      <div class="bg-white rounded-xl border border-[#f0f0f0] overflow-hidden">
        <SongList :songs="user.recentPlays.slice(0, 8)" :show-cover="true" @play="(s, i) => playSong(s, user.recentPlays, i)" />
      </div>
    </section>

    <!-- Recommended playlists -->
    <section>
      <h3 class="text-lg font-bold text-[#1a1a1a] mb-4">推荐歌单</h3>
      <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div v-for="i in 5" :key="i" class="aspect-square rounded-xl bg-[#f5f5f5] animate-pulse" />
      </div>
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div
          v-for="pl in recommendPlaylists"
          :key="pl.id"
          class="group cursor-pointer"
          @click="router.push(`/playlist/${pl.id}`)"
        >
          <div class="relative aspect-square rounded-xl overflow-hidden mb-2.5 bg-[#f0f0f0] shadow-sm">
            <img
              v-if="pl.picUrl || pl.coverImgUrl"
              :src="pl.picUrl || pl.coverImgUrl"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
              alt=""
            />
            <div v-else class="w-full h-full flex items-center justify-center text-3xl">🎵</div>
            <div v-if="pl.playCount" class="absolute top-2 right-2 text-[10px] text-white/90 bg-black/40 px-1.5 py-0.5 rounded-full">
              ▶ {{ pl.playCount > 100000 ? `${(pl.playCount / 10000).toFixed(0)}万` : pl.playCount }}
            </div>
            <div class="absolute right-2 bottom-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg translate-y-1 group-hover:translate-y-0">
              <Play class="w-3.5 h-3.5 text-[#ec4141] ml-0.5" />
            </div>
          </div>
          <div class="text-[13px] leading-snug line-clamp-2 text-[#333] group-hover:text-[#1a1a1a]">{{ pl.name }}</div>
        </div>
      </div>
    </section>
  </div>
</template>
