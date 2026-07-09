<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'
import Player from './components/Player.vue'
import DisclaimerModal from './components/DisclaimerModal.vue'

const route = useRoute()
const isPlayerPage = computed(() => route.name === 'player')
const showPlayer = computed(() => !['player', 'login'].includes(route.name as string))

const sidebarOpen = ref(false)
function toggleSidebar() { sidebarOpen.value = !sidebarOpen.value }
function closeSidebar() { sidebarOpen.value = false }
</script>

<template>
  <DisclaimerModal />

  <template v-if="isPlayerPage">
    <router-view v-slot="{ Component }">
      <transition name="page"><component :is="Component" /></transition>
    </router-view>
  </template>

  <template v-else>
    <Navbar :sidebar-open="sidebarOpen" @toggle-sidebar="toggleSidebar" />

    <!-- Mobile backdrop -->
    <div v-if="sidebarOpen" class="sidebar-backdrop lg:hidden" @click="closeSidebar" />

    <div class="app-body">
      <Sidebar :open="sidebarOpen" @navigate="closeSidebar" />
      <main>
        <router-view v-slot="{ Component }">
          <transition name="page"><component :is="Component" /></transition>
        </router-view>
      </main>
    </div>

    <transition name="slide-up">
      <Player v-if="showPlayer" />
    </transition>
  </template>
</template>

<style>
.app-body {
  display: flex;
  margin-top: 56px;
  height: calc(100vh - 56px - 56px);
  overflow: hidden;
}
@media (min-width: 640px) {
  .app-body { margin-top: 64px; height: calc(100vh - 64px - 64px); }
}
main {
  flex: 1; padding: 0 16px 16px;
  overflow-y: auto; overflow-x: hidden;
}
@media (min-width: 640px) { main { padding: 0 5vw 32px; } }

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.4s; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }

.sidebar-backdrop {
  position: fixed; inset: 0; z-index: 50;
  background: rgba(0,0,0,0.3); backdrop-filter: blur(2px);
}
</style>
