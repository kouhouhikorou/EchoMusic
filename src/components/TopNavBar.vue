<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowBack, ArrowForward, SearchOutline } from '@vicons/ionicons5'

const router = useRouter()

function goBack() { router.back() }
function goForward() { router.forward() }
function goSearch() { router.push('/search') }
</script>

<template>
  <header class="flex items-center justify-between h-14 px-4 bg-white/80 backdrop-blur-xl border-b border-[#e8e8e8] flex-shrink-0">
    <!-- Left: nav arrows -->
    <div class="flex items-center gap-1">
      <button
        class="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full text-[#666] hover:text-[#333] hover:bg-[#f5f5f5] transition-colors"
        @click="goBack"
      >
        <ArrowBack class="w-5 h-5" />
      </button>
      <button
        class="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full text-[#ccc] hover:text-[#666] hover:bg-[#f5f5f5] transition-colors cursor-not-allowed"
      >
        <ArrowForward class="w-5 h-5" />
      </button>
    </div>

    <!-- Center: search (desktop) -->
    <div
      class="hidden sm:flex items-center gap-2 bg-[#f5f5f5] hover:bg-[#eee] rounded-full px-4 py-1.5 min-w-[240px] max-w-[360px] cursor-pointer transition-colors"
      @click="goSearch"
    >
      <SearchOutline class="w-4 h-4 text-[#999] flex-shrink-0" />
      <span class="text-[13px] text-[#999]">搜索</span>
    </div>

    <!-- Spacer -->
    <div class="w-[72px]" />
  </header>
</template>
