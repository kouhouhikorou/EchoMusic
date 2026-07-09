<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { LyricLine } from '@/utils/lrcParser'
import { parseLRC, findCurrentLine, isEmptyLyric } from '@/utils/lrcParser'
import { usePlayerStore } from '@/stores/playerStore'
import { useUserStore } from '@/stores/userStore'

const player = usePlayerStore()
const user = useUserStore()
const containerRef = ref<HTMLElement | null>(null)
const userScrolling = ref(false)
let scrollTimer: ReturnType<typeof setTimeout> | null = null

const lines = computed<LyricLine[]>(() => player.currentSong?.lyric ? parseLRC(player.currentSong.lyric) : [])
const cur = computed(() => findCurrentLine(lines.value, player.progress))
const empty = computed(() => isEmptyLyric(player.currentSong?.lyric || ''))
const fs = computed(() => `${user.settings.lyricFontSize}px`)

watch(cur, () => { if (!userScrolling.value) scrollTo() })

function scrollTo() {
  const el = containerRef.value?.querySelector(`[data-line="${cur.value}"]`)
  el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
function onScroll() {
  userScrolling.value = true
  if (scrollTimer) clearTimeout(scrollTimer)
  scrollTimer = setTimeout(() => { userScrolling.value = false; scrollTo() }, 3000)
}
</script>

<template>
  <div v-if="empty" class="flex-1 flex items-center justify-center text-[#ccc] text-[13px]">暂无歌词</div>
  <div v-else ref="containerRef" class="flex-1 overflow-y-auto px-6 py-12" @scroll="onScroll" :style="{ fontSize: fs }">
    <div class="flex flex-col items-center gap-3">
      <div v-for="(line, i) in lines" :key="`${line.time}-${i}`" :data-line="i"
        class="text-center transition-all duration-300 cursor-pointer px-4 py-1.5 rounded-lg max-w-lg leading-relaxed"
        :class="{
          'lyric-active': i === cur,
          'text-[#ccc]': i < cur - 1,
          'text-[#999] hover:text-[#666]': i !== cur && i >= cur - 1,
        }"
        @click="player.setProgress(line.time)">{{ line.text }}</div>
    </div>
  </div>
</template>
