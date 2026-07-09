<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  items: any[]
  type: string
  subText?: string
  columnNumber?: number
  gap?: string
}>()

const router = useRouter()

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.columnNumber || 5}, 1fr)`,
  gap: props.gap || '44px 24px',
}))

function getImageUrl(item: any): string {
  const img = item.picUrl || item.coverImgUrl || item.img1v1Url || ''
  return img ? `${img}?param=512y512` : ''
}

function getSubText(item: any): string {
  if (props.subText === 'copywriter') return item.copywriter || ''
  if (props.subText === 'artist') return item.artist?.name || item.artists?.[0]?.name || ''
  return ''
}

function goTo(id: string | number) {
  router.push(`/${props.type}/${id}`)
}
</script>

<template>
  <div class="cover-row" :style="gridStyle">
    <div
      v-for="item in items" :key="item.id"
      class="cover-item"
      :class="{ artist: type === 'artist' }"
      @click="goTo(item.id)"
    >
      <div class="cover-img-wrap">
        <img v-if="getImageUrl(item)" :src="getImageUrl(item)" class="cover-img" />
        <div v-else class="cover-img-placeholder">♪</div>
      </div>
      <div class="cover-text">
        <div class="cover-title">{{ item.name }}</div>
        <div v-if="subText && getSubText(item)" class="cover-sub">{{ getSubText(item) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cover-row { display: grid; }
.cover-item { cursor: pointer; color: var(--color-text); }
.cover-item.artist { text-align: center; }

.cover-img-wrap {
  position: relative; width: 100%; aspect-ratio: 1;
  border-radius: 8px; overflow: hidden; background: var(--color-secondary-bg);
}
.cover-img { width: 100%; height: 100%; object-fit: cover; }
.cover-img-placeholder {
  width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
  font-size: 2rem; color: var(--color-secondary); background: var(--color-secondary-bg);
}
.cover-text { margin-top: 8px; }
.cover-title {
  font-size: 16px; font-weight: 600; line-height: 20px;
  display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2;
  overflow: hidden; word-break: break-all;
}
.cover-sub {
  font-size: 12px; opacity: 0.68; line-height: 18px; margin-top: 2px;
  display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1;
  overflow: hidden;
}
.cover-item:hover .cover-title { text-decoration: underline; }
</style>
