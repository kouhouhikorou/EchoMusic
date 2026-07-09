<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'
import Player from './components/Player.vue'
import DisclaimerModal from './components/DisclaimerModal.vue'

const route = useRoute()
const isPlayerPage = computed(() => route.name === 'player')
const showPlayer = computed(() => !['player', 'login'].includes(route.name as string))
</script>

<template>
  <DisclaimerModal />

  <!-- Player page: fullscreen overlay -->
  <template v-if="isPlayerPage">
    <router-view v-slot="{ Component }">
      <transition name="page" >
        <component :is="Component" />
      </transition>
    </router-view>
  </template>

  <!-- Normal layout: Navbar + Sidebar + Content + Player -->
  <template v-else>
    <Navbar />
    <div class="app-body">
      <Sidebar />
      <main>
        <router-view v-slot="{ Component }">
          <transition name="page" >
            <component :is="Component" />
          </transition>
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
  margin-top: 64px;
  height: calc(100vh - 64px - 64px);
  overflow: hidden;
}
main {
  flex: 1;
  padding: 0 5vw 96px;
  overflow-y: auto;
  overflow-x: hidden;
}
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.4s; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }
</style>
