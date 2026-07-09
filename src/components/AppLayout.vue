<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TopNavBar from './TopNavBar.vue'
import Sidebar from './Sidebar.vue'
import BottomNav from './BottomNav.vue'
import MiniPlayer from './MiniPlayer.vue'

const route = useRoute()
const isPlayerPage = computed(() => route.name === 'player')
</script>

<template>
  <div class="flex h-full w-full overflow-hidden bg-[#fafafa]">
    <!-- Player page: full screen, no chrome -->
    <template v-if="isPlayerPage">
      <main class="flex-1 flex flex-col overflow-hidden">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </template>

    <!-- Normal pages: sidebar + topbar + content + minibar -->
    <template v-else>
      <!-- Desktop Sidebar -->
      <Sidebar class="hidden lg:flex" />

      <!-- Main column -->
      <div class="flex-1 flex flex-col overflow-hidden min-w-0">
        <!-- Top NavBar -->
        <TopNavBar />

        <!-- Page content -->
        <div class="flex-1 overflow-y-auto overflow-x-hidden" style="overscroll-behavior: contain; touch-action: manipulation;">
          <router-view v-slot="{ Component }">
            <transition name="page" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>

        <!-- Mini Player -->
        <MiniPlayer />
      </div>
    </template>
  </div>

  <!-- Mobile Bottom Nav -->
  <BottomNav v-if="!isPlayerPage" class="lg:hidden" />
</template>
