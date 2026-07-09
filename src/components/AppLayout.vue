<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './Sidebar.vue'
import BottomNav from './BottomNav.vue'
import MiniPlayer from './MiniPlayer.vue'

const route = useRoute()
const hideLayout = computed(() => route.name === 'player')
</script>

<template>
  <div class="flex h-full w-full overflow-hidden bg-[#fafafa]">
    <Sidebar v-if="!hideLayout" class="hidden lg:flex" />

    <main class="flex-1 flex flex-col overflow-hidden min-w-0" :class="{ 'pb-16 lg:pb-[68px]': !hideLayout }">
      <div class="flex-1 overflow-y-auto overflow-x-hidden">
        <slot />
      </div>
      <MiniPlayer v-if="!hideLayout" />
    </main>
  </div>

  <BottomNav v-if="!hideLayout" class="lg:hidden" />
</template>
