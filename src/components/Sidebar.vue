<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { MusicalNotesOutline, AddOutline } from '@vicons/ionicons5'

const router = useRouter()
const route = useRoute()
const user = useUserStore()

const navItems = [
  { path: '/', label: '发现音乐' },
  { path: '/search', label: '搜索' },
  { path: '/local', label: '本地音乐' },
  { path: '/favorites', label: '我喜欢的音乐' },
  { path: '/recent', label: '最近播放' },
  { path: '/download', label: '下载管理' },
]

const bottomItems = [
  { path: '/settings', label: '设置' },
  { path: '/login', label: '登录' },
]

function isActive(p: string) {
  if (p === '/') return route.path === '/'
  return route.path.startsWith(p)
}
</script>

<template>
  <aside class="w-[200px] h-full flex flex-col flex-shrink-0 border-r border-[#e8e8e8]"
    style="background: rgba(255,255,255,0.76); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);">
    <!-- Logo -->
    <div class="px-5 pt-6 pb-5 cursor-pointer select-none" @click="router.push('/')">
      <div class="flex items-center gap-2.5">
        <div class="w-7 h-7 rounded-lg bg-[#ec4141] flex items-center justify-center">
          <span class="text-white text-[13px] font-bold">♪</span>
        </div>
        <span class="text-base font-bold text-[#1a1a1a] tracking-tight">EchoMusic</span>
      </div>
    </div>

    <!-- Nav -->
    <nav class="flex-1 overflow-y-auto px-3">
      <div class="space-y-[1px]">
        <div
          v-for="item in navItems"
          :key="item.path"
          class="flex items-center px-3 py-2 rounded-lg cursor-pointer text-[13px] transition-colors"
          :class="isActive(item.path)
            ? 'bg-[#fef0f0] text-[#ec4141] font-semibold'
            : 'text-[#333] hover:bg-[#f5f5f5]'"
          @click="router.push(item.path)"
        >
          <span>{{ item.label }}</span>
        </div>
      </div>

      <!-- Playlists -->
      <div class="mt-6">
        <div class="flex items-center justify-between px-3 mb-2">
          <span class="text-[11px] font-semibold text-[#999] uppercase tracking-widest">我的歌单</span>
          <button class="text-[#999] hover:text-[#333] transition-colors" @click="user.createPlaylist('新歌单')">
            <AddOutline class="w-[18px] h-[18px]" />
          </button>
        </div>
        <div class="space-y-[1px]">
          <div
            v-for="pl in user.playlists"
            :key="pl.id"
            class="group flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-[13px] transition-colors"
            :class="route.params.id === pl.id ? 'bg-[#fef0f0] text-[#ec4141] font-semibold' : 'text-[#333] hover:bg-[#f5f5f5]'"
            @click="router.push(`/playlist/${pl.id}`)"
          >
            <div class="w-7 h-7 rounded-md bg-[#f0f0f0] flex-shrink-0 overflow-hidden">
              <img v-if="pl.cover" :src="pl.cover" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center">
                <MusicalNotesOutline class="w-3.5 h-3.5 text-[#ccc]" />
              </div>
            </div>
            <span class="truncate flex-1">{{ pl.name }}</span>
          </div>
          <div v-if="user.playlists.length === 0" class="px-3 py-3 text-xs text-[#ccc] text-center">
            暂无歌单
          </div>
        </div>
      </div>
    </nav>

    <!-- Bottom -->
    <div class="px-3 py-3 border-t border-[#f0f0f0] space-y-[1px]">
      <div
        v-for="item in bottomItems"
        :key="item.path"
        class="flex items-center px-3 py-2 rounded-lg cursor-pointer text-[13px] transition-colors"
        :class="isActive(item.path) ? 'bg-[#fef0f0] text-[#ec4141] font-semibold' : 'text-[#666] hover:bg-[#f5f5f5]'"
        @click="router.push(item.path)"
      >
        <span>{{ item.label }}</span>
      </div>
    </div>
  </aside>
</template>
