<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowBack, ArrowForward, SearchOutline } from '@vicons/ionicons5'

const router = useRouter()
const searchKeyword = ref('')

function goBack() { router.back() }
function goForward() { router.forward() }
function doSearch() {
  const kw = searchKeyword.value.trim()
  if (kw) router.push({ path: '/search', query: { q: kw } })
}
</script>

<template>
  <header class="flex items-center h-14 px-5 flex-shrink-0 z-20"
    style="background: rgba(255,255,255,0.72); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom: 1px solid rgba(0,0,0,0.06);"
  >
    <!-- Left: nav arrows -->
    <div class="flex items-center gap-2 w-[200px]">
      <button
        class="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full text-[#666] hover:text-[#333] hover:bg-[#f0f0f0] transition-colors"
        @click="goBack"
      >
        <ArrowBack class="w-[18px] h-[18px]" />
      </button>
      <button
        class="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full text-[#ccc] transition-colors"
      >
        <ArrowForward class="w-[18px] h-[18px]" />
      </button>
    </div>

    <!-- Center spacer -->
    <div class="flex-1" />

    <!-- Right: search bar -->
    <div class="flex items-center gap-2 bg-[#f5f5f5] hover:bg-[#eee] rounded-full pl-4 pr-2 py-1.5 min-w-[200px] max-w-[300px] transition-colors">
      <SearchOutline class="w-4 h-4 text-[#999] flex-shrink-0" />
      <input
        v-model="searchKeyword"
        class="flex-1 bg-transparent border-none outline-none text-[13px] text-[#333] placeholder-[#999] min-w-0"
        placeholder="搜索"
        @keyup.enter="doSearch"
      />
    </div>
  </header>
</template>
