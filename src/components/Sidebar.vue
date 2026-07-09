<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import {
  HomeOutline, SearchOutline, FolderOpenOutline,
  HeartOutline, TimeOutline, SettingsOutline,
  AddCircleOutline, CloudDownloadOutline, MusicalNotesOutline,
} from '@vicons/ionicons5'

const router = useRouter()
const route = useRoute()
const user = useUserStore()

const navItems = [
  { path: '/', label: '发现音乐', icon: HomeOutline },
  { path: '/search', label: '搜索', icon: SearchOutline },
  { path: '/local', label: '本地音乐', icon: FolderOpenOutline },
  { path: '/favorites', label: '我喜欢的', icon: HeartOutline },
  { path: '/recent', label: '最近播放', icon: TimeOutline },
  { path: '/download', label: '下载管理', icon: CloudDownloadOutline },
]

const isActive = (p: string) => {
  if (p === '/') return route.path === '/'
  return route.path.startsWith(p)
}
</script>

<template>
  <aside class="w-56 h-full flex flex-col bg-surface-900/70 backdrop-blur-xl border-r border-white/5 flex-shrink-0">
    <!-- Logo -->
    <div class="px-5 pt-5 pb-4 cursor-pointer" @click="router.push('/')">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-red-400 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-brand-500/25">
          ♪
        </div>
        <span class="text-base font-bold tracking-tight">EchoMusic</span>
      </div>
    </div>

    <!-- Nav -->
    <nav class="flex-1 overflow-y-auto px-3">
      <div class="space-y-0.5">
        <div
          v-for="item in navItems"
          :key="item.path"
          class="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 text-[13px]"
          :class="isActive(item.path)
            ? 'bg-brand-500/10 text-brand-400 font-medium'
            : 'text-gray-400 hover:text-white hover:bg-white/5'"
          @click="router.push(item.path)"
        >
          <component :is="item.icon" class="w-[18px] h-[18px] flex-shrink-0" />
          <span>{{ item.label }}</span>
        </div>
      </div>

      <!-- Playlists -->
      <div class="mt-6">
        <div class="flex items-center justify-between px-3 mb-2">
          <span class="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">我的歌单</span>
          <button class="text-gray-500 hover:text-white transition-colors" @click="user.createPlaylist('新歌单')">
            <AddCircleOutline class="w-4 h-4" />
          </button>
        </div>
        <div class="space-y-0.5">
          <div
            v-for="pl in user.playlists"
            :key="pl.id"
            class="group flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-[13px] text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            :class="{ 'text-brand-400 bg-brand-500/10': route.params.id === pl.id }"
            @click="router.push(`/playlist/${pl.id}`)"
          >
            <div class="w-7 h-7 rounded-md bg-surface-800 flex-shrink-0 overflow-hidden">
              <img v-if="pl.cover" :src="pl.cover" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center text-[10px] text-gray-600">
                <MusicalNotesOutline class="w-3.5 h-3.5" />
              </div>
            </div>
            <span class="truncate flex-1">{{ pl.name }}</span>
            <span class="text-[11px] text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">{{ pl.songs.length }}</span>
          </div>
          <div v-if="user.playlists.length === 0" class="px-3 py-4 text-center text-xs text-gray-600">
            暂无歌单，点击 + 创建
          </div>
        </div>
      </div>
    </nav>

    <!-- Settings -->
    <div class="p-3 border-t border-white/5">
      <div
        class="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-[13px] transition-all"
        :class="isActive('/settings') ? 'bg-brand-500/10 text-brand-400' : 'text-gray-400 hover:text-white hover:bg-white/5'"
        @click="router.push('/settings')"
      >
        <SettingsOutline class="w-[18px] h-[18px]" />
        <span>设置</span>
      </div>
    </div>
  </aside>
</template>
