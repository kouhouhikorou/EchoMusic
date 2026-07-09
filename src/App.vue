<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Player from './components/Player.vue'
import DisclaimerModal from './components/DisclaimerModal.vue'

const route = useRoute()
const showPlayer = computed(() => !['player', 'login'].includes(route.name as string))
</script>

<template>
  <DisclaimerModal />
  <Navbar />
  <main>
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
  <transition name="slide-up">
    <Player v-if="showPlayer" />
  </transition>
</template>

<style>
main {
  margin-top: 64px;
  margin-bottom: 96px;
  padding-right: 10vw;
  padding-left: 10vw;
  height: calc(100vh - 64px - 96px);
  overflow-y: auto;
  overflow-x: hidden;
}
@media (max-width: 1336px) {
  main { padding: 0 5vw; }
}

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.4s; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }
</style>
