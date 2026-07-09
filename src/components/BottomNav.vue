<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { HomeOutline, SearchOutline, MusicalNotesOutline, PersonOutline } from '@vicons/ionicons5'

const router = useRouter()
const route = useRoute()

const tabs = [
  { path: '/', label: '首页', icon: HomeOutline },
  { path: '/search', label: '搜索', icon: SearchOutline },
  { path: '/local', label: '歌单', icon: MusicalNotesOutline },
  { path: '/settings', label: '我的', icon: PersonOutline },
]
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 z-40 flex bg-surface-925/95 backdrop-blur-xl border-t border-surface-700 safe-bottom">
    <div
      v-for="tab in tabs"
      :key="tab.path"
      class="flex-1 flex flex-col items-center justify-center gap-1 py-2 cursor-pointer transition-colors"
      :class="route.path === tab.path ? 'text-brand-400' : 'text-gray-500'"
      @click="router.push(tab.path)"
    >
      <component :is="tab.icon" class="w-5 h-5" />
      <span class="text-[10px]">{{ tab.label }}</span>
    </div>
  </nav>
</template>
