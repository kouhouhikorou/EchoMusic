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
  <div class="flex flex-col h-full w-full overflow-hidden bg-[#fafafa]">
    <!-- Player page: fullscreen, no layout chrome -->
    <template v-if="isPlayerPage">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </template>

    <!-- All other pages -->
    <template v-else>
      <!-- Top NavBar: full width -->
      <TopNavBar />

      <!-- Body: Sidebar + Content -->
      <div class="flex flex-1 overflow-hidden">
        <Sidebar class="hidden lg:flex" />

        <!-- Main content area -->
        <div class="flex-1 flex flex-col overflow-hidden min-w-0">
          <div
            class="flex-1 overflow-y-auto overflow-x-hidden"
            style="overscroll-behavior: contain; touch-action: manipulation;"
          >
            <router-view v-slot="{ Component }">
              <transition name="page" mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
          </div>

          <!-- MiniPlayer: at bottom of content area -->
          <MiniPlayer />
        </div>
      </div>

      <!-- Mobile bottom nav -->
      <BottomNav class="lg:hidden" />
    </template>
  </div>
</template>
