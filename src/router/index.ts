import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue'),
    meta: { title: '首页 - EchoMusic' },
  },
  {
    path: '/explore',
    name: 'explore',
    component: () => import('@/pages/ExplorePage.vue'),
    meta: { title: '发现音乐' },
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/pages/SearchPage.vue'),
    meta: { title: '搜索' },
  },
  {
    path: '/playlist/:id',
    name: 'playlist',
    component: () => import('@/pages/PlaylistPage.vue'),
    meta: { title: '歌单' },
  },
  {
    path: '/album/:id',
    name: 'album',
    component: () => import('@/pages/PlaylistPage.vue'),
    meta: { title: '专辑' },
  },
  {
    path: '/artist/:id',
    name: 'artist',
    component: () => import('@/pages/PlaylistPage.vue'),
    meta: { title: '歌手' },
  },
  {
    path: '/local',
    name: 'local',
    component: () => import('@/pages/LocalPage.vue'),
    meta: { title: '本地音乐' },
  },
  {
    path: '/player',
    name: 'player',
    component: () => import('@/pages/PlayerPage.vue'),
    meta: { title: '正在播放' },
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: () => import('@/pages/FavoritesPage.vue'),
    meta: { title: '我喜欢的' },
  },
  {
    path: '/recent',
    name: 'recent',
    component: () => import('@/pages/RecentPage.vue'),
    meta: { title: '最近播放' },
  },
  {
    path: '/download',
    name: 'download',
    component: () => import('@/pages/DownloadPage.vue'),
    meta: { title: '下载管理' },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/pages/SettingsPage.vue'),
    meta: { title: '设置' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { title: '登录' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  document.title = (to.meta.title as string) || 'EchoMusic'
})

export default router
