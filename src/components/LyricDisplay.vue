<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import type { LyricLine } from '@/utils/lrcParser'
import { parseLRC, findCurrentLine, isEmptyLyric } from '@/utils/lrcParser'
import { usePlayerStore } from '@/stores/playerStore'
import { useUserStore } from '@/stores/userStore'

const player = usePlayerStore()
const user = useUserStore()
const containerRef = ref<HTMLElement | null>(null)
const userScrolling = ref(false)
let scrollTimeout: ReturnType<typeof setTimeout> | null = null

const lines = computed<LyricLine[]>(() => {
  if (!player.currentSong?.lyric) return []
  return parseLRC(player.currentSong.lyric)
})

const currentIndex = computed(() => {
  return findCurrentLine(lines.value, player.progress)
})

const isEmpty = computed(() => {
  return isEmptyLyric(player.currentSong?.lyric || '')
})

const fontSize = computed(() => `${user.settings.lyricFontSize}px`)

watch(currentIndex, () => {
  if (!userScrolling.value && containerRef.value) {
    scrollToLine()
  }
})

function scrollToLine() {
  if (!containerRef.value) return
  const el = containerRef.value.querySelector(`[data-line="${currentIndex.value}"]`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

function handleScroll() {
  userScrolling.value = true
  if (scrollTimeout) clearTimeout(scrollTimeout)
  scrollTimeout = setTimeout(() => {
    userScrolling.value = false
    scrollToLine()
  }, 3000)
}
</script>

<template>
  <div
    v-if="isEmpty"
    class="flex-1 flex items-center justify-center text-gray-500 text-sm"
  >
    暂无歌词
  </div>
  <div
    v-else
    ref="containerRef"
    class="flex-1 overflow-y-auto overflow-x-hidden px-6 py-8 scroll-smooth"
    @scroll="handleScroll"
  >
    <div class="flex flex-col items-center gap-3" :style="{ fontSize }">
      <div
        v-for="(line, idx) in lines"
        :key="`${line.time}-${idx}`"
        :data-line="idx"
        class="text-center transition-all duration-300 cursor-pointer px-3 py-1.5 rounded-lg max-w-lg"
        :class="{
          'lyric-active': idx === currentIndex,
          'text-gray-500 hover:text-gray-300': idx !== currentIndex,
          'text-gray-700': idx < currentIndex - 1,
        }"
        @click="player.setProgress(line.time)"
      >
        {{ line.text }}
      </div>
    </div>
  </div>
</template>
