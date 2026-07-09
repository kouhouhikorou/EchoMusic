<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getRecommendPlaylists } from '@/api/musicApi'
import CoverRow from '@/components/CoverRow.vue'

const router = useRouter()
const recommendPlaylists = ref<any[]>([])
const show = ref(false)

onMounted(async () => {
  try {
    const data = await getRecommendPlaylists('netease', 10)
    recommendPlaylists.value = data
  } catch {}
  show.value = true
})
</script>

<template>
  <div v-show="show">
    <!-- 推荐歌单 -->
    <section class="section">
      <div class="section-title">
        推荐歌单
        <router-link to="/explore?category=推荐歌单">查看更多</router-link>
      </div>
      <CoverRow type="playlist" :items="recommendPlaylists" sub-text="copywriter" :column-number="5" />
    </section>

    <!-- 快速入口 -->
    <section class="section">
      <div class="section-title">快速入口</div>
      <div class="flex gap-6">
        <div class="quick-card" @click="router.push('/recent')">
          <div class="quick-icon bg-[#eef2ff] text-[#335eea]">🕐</div>
          <div class="quick-label">最近播放</div>
        </div>
        <div class="quick-card" @click="router.push('/favorites')">
          <div class="quick-icon bg-[#fef0f0] text-[#335eea]">♥</div>
          <div class="quick-label">我喜欢的</div>
        </div>
        <div class="quick-card" @click="router.push('/local')">
          <div class="quick-icon bg-[#f0fdf4] text-[#22c55e]">📂</div>
          <div class="quick-label">本地音乐</div>
        </div>
        <div class="quick-card" @click="router.push('/download')">
          <div class="quick-icon bg-[#faf5ff] text-[#a855f7]">⬇</div>
          <div class="quick-label">下载管理</div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.section { margin-top: 54px; }
.section-title {
  display: flex; justify-content: space-between; align-items: flex-end;
  margin-bottom: 20px; font-size: 28px; font-weight: 700;
  color: var(--color-text);
}
.section-title a {
  font-size: 13px; font-weight: 600; opacity: 0.68;
}
.section-title a:hover { text-decoration: underline; }

.quick-card {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  cursor: pointer; padding: 16px 24px; border-radius: 12px;
  background: var(--color-secondary-bg); transition: background 0.2s;
}
.quick-card:hover { background: var(--color-primary-bg-for-transparent); }
.quick-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
.quick-label { font-size: 13px; font-weight: 600; color: var(--color-text); }
</style>
