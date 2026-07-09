<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { usePlayerStore } from '@/stores/playerStore'
import { useUserStore } from '@/stores/userStore'
import { parseLRC, findCurrentLine, isEmptyLyric } from '@/utils/lrcParser'

const player = usePlayerStore()
const user = useUserStore()
const lyricsContainer = ref<HTMLElement | null>(null)
const highlightIdx = ref(-1)
let lyricsTimer: ReturnType<typeof setInterval> | null = null

const currentTrack = computed(() => player.currentSong)
const imageUrl = computed(() => currentTrack.value?.cover ? currentTrack.value.cover + '?param=1024y1024' : '')
const lyricLines = computed(() => currentTrack.value?.lyric ? parseLRC(currentTrack.value.lyric) : [])
const noLyric = computed(() => lyricLines.value.length === 0)

function formatTime(v: number): string {
  if (!v) return '0:00'
  const m = ~~(v / 60), s = (~~(v % 60)).toString().padStart(2, '0')
  return `${m}:${s}`
}

onMounted(() => {
  lyricsTimer = setInterval(() => {
    const idx = findCurrentLine(lyricLines.value, player.progress)
    if (idx !== highlightIdx.value) {
      highlightIdx.value = idx
      const el = document.getElementById(`line${idx}`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, 100)
})

onBeforeUnmount(() => { if (lyricsTimer) clearInterval(lyricsTimer) })

function seek(time: number) { player.setProgress(time) }
</script>

<template>
  <div v-if="currentTrack" class="lyrics-page" :class="{ 'no-lyric': noLyric }">
    <!-- Left: cover + controls -->
    <div class="left-side">
      <div>
        <div class="cover">
          <div class="cover-container">
            <img v-if="imageUrl" :src="imageUrl" />
            <div v-else class="cover-placeholder">♪</div>
            <div v-if="imageUrl" class="cover-shadow" :style="{ backgroundImage: `url(${imageUrl})` }" />
          </div>
        </div>
        <div class="controls">
          <div class="top-part">
            <div class="track-info">
              <div class="title">{{ currentTrack.title }}</div>
              <div class="subtitle">{{ currentTrack.artist }} - {{ currentTrack.album }}</div>
            </div>
          </div>
          <div class="progress-bar">
            <span>{{ formatTime(player.progress) }}</span>
            <div class="slider">
              <div class="slider-track" @click="(e: MouseEvent) => { const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); player.setProgress(((e.clientX - r.left) / r.width) * player.duration); }">
                <div class="slider-fill" :style="{ width: `${player.duration > 0 ? (player.progress / player.duration) * 100 : 0}%` }">
                  <div class="slider-dot" />
                </div>
              </div>
            </div>
            <span>{{ formatTime(player.duration) }}</span>
          </div>
          <div class="media-controls">
            <button :class="{ active: player.mode !== 'list' }" @click="player.toggleMode()">🔁</button>
            <div class="middle">
              <button @click="player.prev()">⏮</button>
              <button @click="player.togglePlay()">
                <span v-if="player.isPlaying" class="text-[28px]">⏸</span>
                <span v-else class="text-[28px]">▶</span>
              </button>
              <button @click="player.next()">⏭</button>
            </div>
            <button :class="{ active: player.mode === 'shuffle' }" @="player.mode = player.mode === 'shuffle' ? 'list' : 'shuffle'">🔀</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Right: lyrics -->
    <div class="right-side">
      <div v-if="!noLyric" ref="lyricsContainer" class="lyrics-container">
        <div class="lyric-spacer" />
        <div
          v-for="(line, idx) in lyricLines" :key="idx"
          :id="`line${idx}`"
          class="lyric-line"
          :class="{ highlight: idx === highlightIdx }"
          @click="seek(line.time)"
        >
          <span>{{ line.text }}</span>
        </div>
        <div class="lyric-spacer" />
      </div>
    </div>

    <!-- Close button -->
    <div class="close-btn" @click="$router.back()">
      <span>✕</span>
    </div>
  </div>
</template>

<style scoped>
.lyrics-page {
  position: fixed; top: 0; right: 0; left: 0; bottom: 0;
  z-index: 200; background: var(--color-body-bg); display: flex;
}
.left-side {
  flex: 1; display: flex; justify-content: flex-end;
  margin-right: 32px; margin-top: 24px; align-items: center;
}
.cover { position: relative; }
.cover-container { position: relative; }
.cover-container img, .cover-placeholder {
  border-radius: 0.75em; width: 54vh; height: 54vh; object-fit: cover;
  background: var(--color-secondary-bg);
}
.cover-placeholder {
  display: flex; align-items: center; justify-content: center; font-size: 5rem;
  color: var(--color-secondary);
}
.cover-shadow {
  position: absolute; top: 12px; height: 54vh; width: 54vh;
  filter: blur(16px) opacity(0.6); transform: scale(0.92, 0.96);
  z-index: -1; background-size: cover; border-radius: 0.75em;
}

.controls { max-width: 54vh; margin-top: 24px; color: var(--color-text); }
.title { font-size: 1.4rem; font-weight: 600; opacity: 0.88; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.subtitle { margin-top: 4px; font-size: 1rem; opacity: 0.58; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.top-part { display: flex; justify-content: space-between; }

.progress-bar { margin-top: 22px; display: flex; align-items: center; gap: 10px; }
.progress-bar span { font-size: 15px; opacity: 0.58; min-width: 28px; }
.slider { flex: 1; }
.slider-track { height: 2px; background: #e0e0e0; border-radius: 1px; cursor: pointer; position: relative; }
.slider-fill { height: 100%; background: var(--color-primary); border-radius: 1px; position: relative; transition: width 0.2s; }
.slider-dot { position: absolute; right: -6px; top: -5px; width: 12px; height: 12px; border-radius: 50%; background: var(--color-primary); opacity: 0; transition: opacity 0.2s; }
.slider-track:hover .slider-dot { opacity: 1; }

.media-controls { display: flex; justify-content: center; margin-top: 18px; align-items: center; gap: 8px; }
.media-controls button { padding: 4px; opacity: 0.38; color: var(--color-text); font-size: 16px; }
.media-controls button:hover { opacity: 0.88; }
.media-controls .active { opacity: 0.88; }
.media-controls .middle { display: flex; align-items: center; padding: 0 16px; gap: 16px; }
.media-controls .middle button { opacity: 0.88; font-size: 22px; }

.right-side { flex: 1; font-weight: 600; color: var(--color-text); margin-right: 24px; overflow: hidden; }
.lyrics-container { height: 100%; max-width: 460px; overflow-y: auto; padding-left: 78px; }
.lyrics-container::-webkit-scrollbar { display: none; }
.lyric-spacer { height: 50vh; }
.lyric-line { padding: 18px; border-radius: 12px; cursor: pointer; transition: 0.2s; }
.lyric-line:hover { background: var(--color-secondary-bg); }
.lyric-line span { opacity: 0.28; }
.lyric-line.highlight span { opacity: 0.98; transition: 0.5s; }

.close-btn {
  position: fixed; top: 24px; right: 24px; z-index: 300;
  border-radius: 0.75rem; height: 44px; width: 44px;
  display: flex; justify-content: center; align-items: center;
  opacity: 0.28; cursor: pointer; transition: 0.2s; font-size: 20px;
  color: var(--color-text);
}
.close-btn:hover { background: var(--color-secondary-bg); opacity: 0.88; }

.no-lyric .left-side { transform: translateX(27vh); margin-right: 0; transition: all 0.5s; }
</style>
