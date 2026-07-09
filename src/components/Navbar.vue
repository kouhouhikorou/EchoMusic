<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowBack, ArrowForward, SearchOutline, MenuOutline } from '@vicons/ionicons5'

const props = defineProps<{ sidebarOpen: boolean }>()
const emit = defineEmits<{ (e: 'toggle-sidebar'): void }>()

const router = useRouter()
const route = useRoute()
const keywords = ref('')
const inputFocus = ref(false)

function go(where: string) { where === 'back' ? router.go(-1) : router.go(1) }
function doSearch() {
  if (!keywords.value) return
  router.push({ name: 'search', params: { keywords: keywords.value } })
}
</script>

<template>
  <nav class="navbar">
    <div class="nav-left">
      <!-- Hamburger (mobile) -->
      <button class="nav-btn flex lg:hidden" @click="emit('toggle-sidebar')">
        <MenuOutline class="w-5 h-5" />
      </button>
      <!-- Back/Forward (desktop) -->
      <button class="nav-btn hidden sm:flex" @click="go('back')">
        <ArrowBack class="w-5 h-5" />
      </button>
      <button class="nav-btn hidden sm:flex" @click="go('forward')">
        <ArrowForward class="w-5 h-5" />
      </button>
    </div>

    <div class="nav-links">
      <router-link to="/" :class="{ active: route.name === 'home' }">首页</router-link>
      <router-link to="/explore" :class="{ active: route.name === 'explore' }">发现</router-link>
      <router-link to="/local" :class="{ active: route.name === 'local' }">本地</router-link>
    </div>

    <div class="nav-right">
      <div class="search-box" :class="{ active: inputFocus }">
        <SearchOutline class="search-icon" />
        <input
          v-model="keywords"
          :placeholder="inputFocus ? '' : '搜索'"
          @keydown.enter="doSearch"
          @focus="inputFocus = true"
          @blur="inputFocus = false"
        />
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed; top: 0; right: 0; left: 0;
  display: flex; justify-content: space-between; align-items: center;
  height: 56px; padding: 0 16px;
  backdrop-filter: saturate(180%) blur(20px);
  background-color: var(--color-navbar-bg); z-index: 100;
}
@media (min-width: 640px) {
  .navbar { height: 64px; padding-right: 5vw; padding-left: 5vw; }
}
@media (min-width: 1340px) {
  .navbar { padding-right: 5vw; padding-left: calc(200px + 5vw); }
}

.nav-left { flex: 1; display: flex; align-items: center; }
.nav-btn {
  display: flex; align-items: center; justify-content: center;
  height: 32px; width: 32px; border-radius: 8px;
  color: var(--color-text); opacity: 0.68;
}
.nav-btn:hover { background: var(--color-secondary-bg-for-transparent); opacity: 1; }

.nav-links {
  display: flex; justify-content: center; gap: 8px;
  text-transform: uppercase; user-select: none;
}
@media (min-width: 640px) { .nav-links { gap: 24px; } }
.nav-links a {
  font-size: 15px; font-weight: 700; padding: 6px 8px;
  border-radius: 6px; color: var(--color-text); transition: 0.2s;
}
@media (min-width: 640px) {
  .nav-links a { font-size: 18px; padding: 6px 10px; }
}
.nav-links a:hover { background: var(--color-secondary-bg-for-transparent); text-decoration: none; }
.nav-links a:active { transform: scale(0.92); }
.nav-links a.active { color: var(--color-primary); }

.nav-right { flex: 1; display: flex; justify-content: flex-end; }

.search-box {
  display: flex; align-items: center; gap: 4px;
  height: 32px; background: var(--color-secondary-bg-for-transparent);
  border-radius: 8px; width: 140px; padding: 0 8px;
  color: var(--color-text); opacity: 0.68;
}
@media (min-width: 640px) { .search-box { width: 200px; } }
.search-box.active {
  background: var(--color-primary-bg-for-transparent); opacity: 1;
  color: var(--color-primary);
}
.search-box input {
  flex: 1; background: transparent; border: none;
  font-size: 15px; font-weight: 600; color: inherit; width: 96%;
  font-family: inherit; margin-top: -1px;
}
.search-box input::placeholder { color: inherit; opacity: 0.6; }
.search-icon { width: 15px; height: 15px; flex-shrink: 0; }
</style>
