<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './Sidebar.vue'
import BottomNav from './BottomNav.vue'
import MiniPlayer from './MiniPlayer.vue'

const route = useRoute()
const hideChrome = computed(() => route.name === 'player')
</script>

<template>
  <div class="flex h-full w-full overflow-hidden bg-surface-950">
    <!-- Sidebar (desktop) -->
    <Sidebar v-if="!hideChrome" class="hidden lg:flex" />

    <!-- Main area -->
    <main class="flex-1 flex flex-col overflow-hidden min-w-0" :class="{ 'pb-16 lg:pb-[72px]': !hideChrome }">
      <div class="flex-1 overflow-y-auto overflow-x-hidden">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
      <MiniPlayer v-if="!hideChrome" />
    </main>
  </div>

  <!-- Bottom nav (mobile) -->
  <BottomNav v-if="!hideChrome" class="lg:hidden" />
</template>
