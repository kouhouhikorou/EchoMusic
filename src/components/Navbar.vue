<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowBack, ArrowForward, SearchOutline } from '@vicons/ionicons5'

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
      <button class="nav-btn" @click="go('back')">
        <ArrowBack class="w-5 h-5" />
      </button>
      <button class="nav-btn" @click="go('forward')">
        <ArrowForward class="w-5 h-5" />
      </button>
    </div>

    <div class="nav-links">
      <router-link to="/" :class="{ active: route.name === 'home' }">发现</router-link>
      <router-link to="/search" :class="{ active: route.name === 'search' }">搜索</router-link>
      <router-link to="/local" :class="{ active: route.name === 'local' }">本地</router-link>
    </div>

    <div class="nav-right">
      <div class="search-box" :class="{ active: inputFocus }">
        <SearchOutline class="w-[15px] h-[15px]" />
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
  position: fixed;
  top: 0; right: 0; left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding-right: 10vw;
  padding-left: 10vw;
  backdrop-filter: saturate(180%) blur(20px);
  background-color: var(--color-navbar-bg);
  z-index: 100;
}
@media (max-width: 1336px) {
  .navbar { padding: 0 5vw; }
}

.nav-left { flex: 1; display: flex; align-items: center; }
.nav-btn {
  display: flex; align-items: center; justify-content: center;
  height: 32px; width: 32px; border-radius: 8px;
  color: var(--color-text); opacity: 0.68;
}
.nav-btn:hover { background: var(--color-secondary-bg-for-transparent); opacity: 1; }

.nav-links {
  flex: 1; display: flex; justify-content: center; gap: 24px;
  text-transform: uppercase; user-select: none;
}
.nav-links a {
  font-size: 18px; font-weight: 700; padding: 6px 10px;
  border-radius: 6px; color: var(--color-text); transition: 0.2s;
}
.nav-links a:hover { background: var(--color-secondary-bg-for-transparent); text-decoration: none; }
.nav-links a:active { transform: scale(0.92); }
.nav-links a.active { color: var(--color-primary); }

.nav-right { flex: 1; display: flex; justify-content: flex-end; }

.search-box {
  display: flex; align-items: center; gap: 4px;
  height: 32px; background: var(--color-secondary-bg-for-transparent);
  border-radius: 8px; width: 200px; padding: 0 8px;
  color: var(--color-text); opacity: 0.68;
}
.search-box.active {
  background: var(--color-primary-bg-for-transparent); opacity: 1;
  color: var(--color-primary);
}
.search-box input {
  flex: 1; background: transparent; border: none;
  font-size: 16px; font-weight: 600; color: inherit; width: 96%;
  font-family: inherit; margin-top: -1px;
}
.search-box input::placeholder { color: inherit; opacity: 0.6; }
</style>
