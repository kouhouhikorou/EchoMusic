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
  <div class="flex h-full w-full overflow-hidden">
    <!-- Desktop Sidebar -->
    <Sidebar v-if="!hideChrome" class="hidden lg:flex" />

    <!-- Main Content -->
    <main
      class="flex-1 flex flex-col overflow-hidden"
      :class="{ 'pb-16 lg:pb-20': !hideChrome }"
    >
      <div class="flex-1 overflow-y-auto overflow-x-hidden">
        <slot />
      </div>

      <!-- Mini Player -->
      <MiniPlayer v-if="!hideChrome" />
    </main>
  </div>

  <!-- Mobile Bottom Nav -->
  <BottomNav v-if="!hideChrome" class="lg:hidden" />
</template>
