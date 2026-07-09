<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { HomeOutline, SearchOutline, MusicalNotesOutline, PersonOutline } from '@vicons/ionicons5'

const router = useRouter()
const route = useRoute()

const tabs = [
  { path: '/', label: '发现', icon: HomeOutline },
  { path: '/search', label: '搜索', icon: SearchOutline },
  { path: '/local', label: '歌单', icon: MusicalNotesOutline },
  { path: '/settings', label: '我的', icon: PersonOutline },
]
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 z-40 flex bg-white/85 backdrop-blur-xl border-t border-[#e8e8e8] safe-bottom lg:hidden">
    <div
      v-for="tab in tabs"
      :key="tab.path"
      class="flex-1 flex flex-col items-center justify-center gap-[2px] py-2 cursor-pointer transition-colors"
      :class="route.path === tab.path ? 'text-[#ec4141]' : 'text-[#999]'"
      @click="router.push(tab.path)"
    >
      <component :is="tab.icon" class="w-[22px] h-[22px]" />
      <span class="text-[10px] font-medium">{{ tab.label }}</span>
    </div>
  </nav>
</template>
