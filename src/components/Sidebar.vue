<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import {
  HomeOutline, SearchOutline, MusicalNotesOutline,
  FolderOpenOutline, HeartOutline, TimeOutline,
  SettingsOutline, AddCircleOutline, TrashOutline,
  CloudDownloadOutline,
} from '@vicons/ionicons5'

const router = useRouter()
const route = useRoute()
const user = useUserStore()

const navItems = [
  { path: '/', label: '首页', icon: HomeOutline },
  { path: '/search', label: '搜索', icon: SearchOutline },
  { path: '/local', label: '本地音乐', icon: FolderOpenOutline },
  { path: '/favorites', label: '我喜欢的', icon: HeartOutline },
  { path: '/recent', label: '最近播放', icon: TimeOutline },
  { path: '/download', label: '下载管理', icon: CloudDownloadOutline },
]

const isActive = (path: string) => route.path === path
</script>

<template>
  <aside class="w-60 h-full flex flex-col bg-surface-925 border-r border-surface-700 flex-shrink-0">
    <!-- Logo -->
    <div class="p-5 border-b border-surface-700">
      <h1
        class="text-xl font-bold bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent cursor-pointer"
        @click="router.push('/')"
      >
        🎵 EchoMusic
      </h1>
    </div>

    <!-- Main Nav -->
    <nav class="flex-1 overflow-y-auto py-3 px-2">
      <div class="space-y-0.5">
        <div
          v-for="item in navItems"
          :key="item.path"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-sm"
          :class="isActive(item.path)
            ? 'bg-brand-600/20 text-brand-400'
            : 'text-gray-400 hover:text-white hover:bg-surface-800'"
          @click="router.push(item.path)"
        >
          <component :is="item.icon" class="w-5 h-5" />
          <span>{{ item.label }}</span>
        </div>
      </div>

      <!-- Playlists -->
      <div class="mt-6">
        <div class="flex items-center justify-between px-3 mb-2">
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">我的歌单</span>
          <AddCircleOutline
            class="w-4 h-4 text-gray-500 hover:text-white cursor-pointer"
            @click="user.createPlaylist('新歌单')"
          />
        </div>
        <div class="space-y-0.5">
          <div
            v-for="playlist in user.playlists"
            :key="playlist.id"
            class="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm text-gray-400 hover:text-white hover:bg-surface-800 group"
            @click="router.push(`/playlist/${playlist.id}`)"
          >
            <span class="truncate">{{ playlist.name }}</span>
            <span class="text-xs text-gray-600">{{ playlist.songs.length }}</span>
          </div>
          <div
            v-if="user.playlists.length === 0"
            class="px-3 py-2 text-xs text-gray-600"
          >
            暂无歌单，点击 + 创建
          </div>
        </div>
      </div>
    </nav>

    <!-- Bottom: Settings -->
    <div class="p-3 border-t border-surface-700">
      <div
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-gray-400 hover:text-white hover:bg-surface-800 transition-colors"
        :class="{ 'bg-brand-600/20 text-brand-400': isActive('/settings') }"
        @click="router.push('/settings')"
      >
        <SettingsOutline class="w-5 h-5" />
        <span>设置</span>
      </div>
    </div>
  </aside>
</template>
