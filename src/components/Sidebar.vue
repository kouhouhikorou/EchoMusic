<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { MusicalNotesOutline, AddOutline } from '@vicons/ionicons5'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'navigate'): void }>()

const router = useRouter()
const route = useRoute()
const user = useUserStore()

function navigate(path: string) {
  router.push(path)
  emit('navigate')
}

const primaryNav = [
  { path: '/', label: '首页' },
  { path: '/explore', label: '发现音乐' },
  { path: '/search', label: '搜索' },
  { path: '/local', label: '本地音乐' },
]

const libraryNav = [
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
  <aside class="sidebar" :class="{ open: open }">
    <!-- Primary nav -->
    <nav class="sidebar-nav">
      <div
        v-for="item in primaryNav"
        :key="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
        @click="navigate(item.path)"
      >
        {{ item.label }}
      </div>
    </nav>

    <!-- Divider -->
    <div class="sidebar-divider" />

    <!-- Library -->
    <div class="sidebar-section">
      <div class="sidebar-label">音乐库</div>
      <div
        v-for="item in libraryNav"
        :key="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
        @click="navigate(item.path)"
      >
        {{ item.label }}
      </div>
    </div>

    <!-- Divider -->
    <div class="sidebar-divider" />

    <!-- Playlists -->
    <div class="sidebar-section flex-1">
      <div class="sidebar-label-row">
        <span class="sidebar-label">我的歌单</span>
        <button class="sidebar-add-btn" @click="user.createPlaylist('新歌单')">
          <AddOutline class="w-[16px] h-[16px]" />
        </button>
      </div>
      <div
        v-for="pl in user.playlists"
        :key="pl.id"
        class="nav-item text-[13px]"
        :class="{ active: route.params.id === pl.id }"
        @click="navigate(`/playlist/${pl.id}`)"
      >
        <div class="w-6 h-6 rounded bg-[#f0f0f0] flex-shrink-0 overflow-hidden mr-2">
          <img v-if="pl.cover" :src="pl.cover" class="w-full h-full object-cover" />
          <MusicalNotesOutline v-else class="w-3.5 h-3.5 m-auto text-[#ccc]" />
        </div>
        <span class="truncate">{{ pl.name }}</span>
      </div>
    </div>

    <!-- Bottom -->
    <div class="sidebar-footer">
      <div
        class="nav-item"
        :class="{ active: isActive('/settings') }"
        @click="navigate('/settings')"
      >设置</div>
      <div
        class="nav-item"
        :class="{ active: isActive('/login') }"
        @click="navigate('/login')"
      >登录</div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 200px; height: 100%; display: flex; flex-direction: column; flex-shrink: 0;
  overflow-y: auto; overflow-x: hidden; user-select: none;
  border-right: 1px solid rgba(0,0,0,0.06);
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* Mobile: fixed drawer */
@media (max-width: 1023px) {
  .sidebar {
    position: fixed; top: 56px; left: 0; bottom: 56px; z-index: 60;
    transform: translateX(-100%); transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 4px 0 24px rgba(0,0,0,0.08);
    padding-bottom: env(safe-area-inset-bottom);
  }
  .sidebar.open { transform: translateX(0); }
  .sidebar-footer { margin-top: 0; }
  .nav-item { padding: 6px 10px; font-size: 13px; }
}

.sidebar-nav { padding: 8px; }
.sidebar-section { padding: 0 8px; }
.sidebar-footer { padding: 8px; border-top: 1px solid rgba(0,0,0,0.05); margin-top: auto; flex-shrink: 0; }

.nav-item {
  display: flex; align-items: center; gap: 8px; padding: 8px 12px;
  border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600;
  color: var(--color-text); opacity: 0.88; transition: all 0.15s;
}
.nav-item:hover { background: var(--color-secondary-bg-for-transparent); opacity: 1; }
.nav-item.active { background: var(--color-primary-bg); color: var(--color-primary); opacity: 1; }

.sidebar-divider { height: 1px; background: rgba(0,0,0,0.05); margin: 4px 16px; }

.sidebar-label {
  font-size: 11px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.05em; color: var(--color-secondary); padding: 8px 12px 4px;
}
.sidebar-label-row {
  display: flex; justify-content: space-between; align-items: center;
  padding-right: 8px;
}
.sidebar-add-btn {
  display: flex; align-items: center; justify-content: center;
  width: 24px; height: 24px; border-radius: 6px;
  color: var(--color-secondary); opacity: 0.6; transition: all 0.15s;
}
.sidebar-add-btn:hover { background: var(--color-secondary-bg); opacity: 1; }
</style>
