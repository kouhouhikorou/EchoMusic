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

function isActive(p: string) {
  if (p === '/') return route.path === '/'
  return route.path.startsWith(p)
}
</script>

<template>
  <aside class="w-[200px] h-full flex flex-col flex-shrink-0 overflow-hidden select-none"
    style="background: rgba(255,255,255,0.48); border-right: 1px solid rgba(0,0,0,0.06);"
  >
    <nav class="flex-1 overflow-y-auto px-2 pt-2 pb-2">
      <div class="space-y-[1px]">
        <div
          v-for="item in navItems"
          :key="item.path"
          class="px-3 py-2 rounded-lg cursor-pointer text-[13px] transition-colors"
          :class="isActive(item.path)
            ? 'bg-[#fef0f0] text-[#ec4141] font-semibold'
            : 'text-[#333] hover:bg-[#f0f0f0]'"
          @click="router.push(item.path)"
        >
          {{ item.label }}
        </div>
      </div>

      <!-- User playlists -->
      <div class="mt-5">
        <div class="flex items-center justify-between px-3 mb-2">
          <span class="text-[11px] font-semibold text-[#999] uppercase tracking-widest">我的歌单</span>
          <button
            class="text-[#999] hover:text-[#333] transition-colors min-h-[28px] min-w-[28px] flex items-center justify-center"
            @click="user.createPlaylist('新歌单')"
          >
            <AddOutline class="w-[18px] h-[18px]" />
          </button>
        </div>
        <div class="space-y-[1px]">
          <div
            v-for="pl in user.playlists"
            :key="pl.id"
            class="group flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-[13px] transition-colors"
            :class="route.params.id === pl.id ? 'bg-[#fef0f0] text-[#ec4141] font-semibold' : 'text-[#333] hover:bg-[#f0f0f0]'"
            @click="router.push(`/playlist/${pl.id}`)"
          >
            <div class="w-7 h-7 rounded-md bg-[#f0f0f0] flex-shrink-0 overflow-hidden">
              <img v-if="pl.cover" :src="pl.cover" class="w-full h-full object-cover" alt="" />
              <div v-else class="w-full h-full flex items-center justify-center">
                <MusicalNotesOutline class="w-3.5 h-3.5 text-[#ccc]" />
              </div>
            </div>
            <span class="truncate flex-1">{{ pl.name }}</span>
          </div>
        </div>
      </div>
    </nav>

    <!-- Bottom links -->
    <div class="px-2 py-2 border-t border-[rgba(0,0,0,0.05)] space-y-[1px]">
      <div
        class="px-3 py-2 rounded-lg cursor-pointer text-[13px] transition-colors"
        :class="isActive('/settings') ? 'bg-[#fef0f0] text-[#ec4141] font-semibold' : 'text-[#666] hover:bg-[#f0f0f0]'"
        @click="router.push('/settings')"
      >设置</div>
      <div
        class="px-3 py-2 rounded-lg cursor-pointer text-[13px] transition-colors"
        :class="isActive('/login') ? 'bg-[#fef0f0] text-[#ec4141] font-semibold' : 'text-[#666] hover:bg-[#f0f0f0]'"
        @click="router.push('/login')"
      >登录</div>
    </div>
  </aside>
</template>
