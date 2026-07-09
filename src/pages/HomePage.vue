<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/playerStore'
import { useUserStore } from '@/stores/userStore'
import { getRecommendPlaylists } from '@/api/musicApi'
import type { Song } from '@/stores/playerStore'
import CoverRow from '@/components/CoverRow.vue'
import SongList from '@/components/SongList.vue'

const router = useRouter()
const player = usePlayerStore()
const user = useUserStore()

const recommendPlaylists = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await getRecommendPlaylists('netease', 10)
    recommendPlaylists.value = data
  } catch {}
  loading.value = false
})

function playSong(song: Song, songs: Song[], index: number) { player.playQueue(songs, index) }
</script>

<template>
  <div class="home-page">
    <!-- Quick access cards -->
    <section class="section">
      <div class="section-title">快速入口</div>
      <div class="quick-grid">
        <div class="quick-card" @click="router.push('/recent')">
          <div class="quick-icon" style="background:#eef2ff; color:#335eea;">🕐</div>
          <div class="quick-label">最近播放</div>
        </div>
        <div class="quick-card" @click="router.push('/favorites')">
          <div class="quick-icon" style="background:#fef0f0; color:#ec4141;">♥</div>
          <div class="quick-label">我喜欢的</div>
        </div>
        <div class="quick-card" @click="router.push('/local')">
          <div class="quick-icon" style="background:#f0fdf4; color:#22c55e;">📂</div>
          <div class="quick-label">本地音乐</div>
        </div>
        <div class="quick-card" @click="router.push('/download')">
          <div class="quick-icon" style="background:#faf5ff; color:#a855f7;">⬇</div>
          <div class="quick-label">下载管理</div>
        </div>
      </div>
    </section>

    <!-- Recent plays -->
    <section v-if="user.recentPlays.length > 0" class="section">
      <div class="section-title">
        最近播放
        <router-link to="/recent">查看更多</router-link>
      </div>
      <SongList
        :songs="user.recentPlays.slice(0, 5)"
        type="tracklist"
        :show-index="false"
        :show-album="true"
        @play="(s, i) => playSong(s, user.recentPlays, i)"
      />
    </section>

    <!-- Recommended playlists -->
    <section class="section">
      <div class="section-title">
        推荐歌单
        <router-link to="/explore">查看更多</router-link>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-5 gap-[44px_24px]">
        <div v-for="i in 10" :key="i" class="aspect-square rounded-xl bg-[var(--color-secondary-bg)] animate-pulse" />
      </div>

      <!-- Loaded -->
      <CoverRow
        v-else-if="recommendPlaylists.length > 0"
        type="playlist"
        :items="recommendPlaylists"
        sub-text="copywriter"
        :column-number="5"
      />

      <!-- Empty -->
      <div v-else class="empty-state">
        <div class="empty-icon">🎵</div>
        <div class="empty-title">暂无推荐</div>
        <div class="empty-desc">API 服务未连接或暂无数据</div>
        <button class="empty-btn" @click="router.push('/settings')">前往设置配置 API</button>
      </div>
    </section>

    <!-- Bottom spacer -->
    <div class="h-20" />
  </div>
</template>

<style scoped>
.home-page { padding-top: 8px; }

.section { margin-top: 48px; }
.section:first-child { margin-top: 16px; }

.section-title {
  display: flex; justify-content: space-between; align-items: flex-end;
  margin-bottom: 20px; font-size: 28px; font-weight: 700; color: var(--color-text);
}
.section-title a {
  font-size: 13px; font-weight: 600; opacity: 0.68; text-decoration: none;
}
.section-title a:hover { text-decoration: underline; }

.quick-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.quick-card {
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  padding: 20px; border-radius: 12px; cursor: pointer;
  background: var(--color-secondary-bg); transition: all 0.2s;
}
.quick-card:hover { background: var(--color-primary-bg); transform: translateY(-2px); }
.quick-icon {
  width: 52px; height: 52px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center; font-size: 22px;
}
.quick-label { font-size: 14px; font-weight: 700; color: var(--color-text); }

.empty-state {
  display: flex; flex-direction: column; align-items: center; padding: 48px 0;
  background: var(--color-secondary-bg); border-radius: 16px; text-align: center;
}
.empty-icon { font-size: 40px; margin-bottom: 12px; }
.empty-title { font-size: 18px; font-weight: 700; color: var(--color-text); margin-bottom: 4px; }
.empty-desc { font-size: 14px; opacity: 0.58; color: var(--color-text); margin-bottom: 16px; }
.empty-btn {
  padding: 10px 24px; border-radius: 20px; font-size: 14px; font-weight: 600;
  background: var(--color-primary); color: white; transition: opacity 0.2s;
}
.empty-btn:hover { opacity: 0.9; }
</style>
