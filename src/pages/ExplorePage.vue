<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getRecommendPlaylists } from '@/api/musicApi'
import CoverRow from '@/components/CoverRow.vue'

const recommendPlaylists = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await getRecommendPlaylists('netease', 15)
    recommendPlaylists.value = data
  } catch {}
  loading.value = false
})
</script>

<template>
  <div class="explore-page">
    <!-- 推荐歌单 -->
    <section class="section">
      <div class="section-title">推荐歌单</div>
      <div v-if="loading" class="grid grid-cols-5 gap-[44px_24px]">
        <div v-for="i in 10" :key="i" class="aspect-square rounded-xl bg-[var(--color-secondary-bg)] animate-pulse" />
      </div>
      <CoverRow v-else-if="recommendPlaylists.length" type="playlist" :items="recommendPlaylists" sub-text="copywriter" :column-number="5" />
      <div v-else class="empty-state">
        <div class="empty-icon">🎵</div>
        <div class="empty-title">暂无推荐内容</div>
        <div class="empty-desc">请先在设置中配置 API 地址</div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.explore-page { padding-top: 8px; }
.section { margin-top: 16px; }
.section-title {
  margin-bottom: 20px; font-size: 28px; font-weight: 700; color: var(--color-text);
}
.empty-state {
  display: flex; flex-direction: column; align-items: center; padding: 64px 0;
  background: var(--color-secondary-bg); border-radius: 16px; text-align: center;
}
.empty-icon { font-size: 40px; margin-bottom: 12px; }
.empty-title { font-size: 18px; font-weight: 700; color: var(--color-text); margin-bottom: 4px; }
.empty-desc { font-size: 14px; opacity: 0.58; }
</style>
