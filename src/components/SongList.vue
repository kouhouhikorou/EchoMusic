<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Song } from '@/stores/playerStore'
import { usePlayerStore } from '@/stores/playerStore'
import { useUserStore } from '@/stores/userStore'

const props = defineProps<{
  songs: Song[]
  type?: 'playlist' | 'album' | 'tracklist'
  showIndex?: boolean
  showAlbum?: boolean
}>()

const emit = defineEmits<{ (e: 'play', song: Song, index: number): void }>()
const router = useRouter()
const player = usePlayerStore()
const user = useUserStore()
const hoverIdx = ref(-1)

function isPlaying(song: Song) { return player.currentSong?.id === song.id && player.currentSong?.source === song.source }

function formatTime(d: number): string {
  if (!d || !isFinite(d)) return '--:--'
  const m = ~~(d / 60), s = (~~(d % 60)).toString().padStart(2, '0')
  return `${m}:${s}`
}
</script>

<template>
  <div v-if="songs.length === 0" class="py-16 text-center text-[var(--color-text)] opacity-28 text-2xl">暂无歌曲</div>
  <div v-else>
    <div
      v-for="(track, idx) in songs"
      :key="`${track.source}-${track.id}`"
      class="track-row"
      :class="{
        'track-playing': isPlaying(track),
        'track-hover': hoverIdx === idx,
      }"
      @mouseover="hoverIdx = idx"
      @mouseleave="hoverIdx = -1"
      @click="emit('play', track, idx)"
    >
      <div class="track-no">
        <span v-show="!isPlaying(track) && hoverIdx !== idx" class="opacity-58">{{ idx + 1 }}</span>
        <span v-show="isPlaying(track)" class="text-[var(--color-primary)]">♪</span>
        <span v-show="!isPlaying(track) && hoverIdx === idx" class="text-[var(--color-primary)]">▶</span>
      </div>

      <img
        v-if="track.cover && type !== 'album'"
        :src="track.cover + '?param=224y224'"
        class="track-img"
        @click.stop="router.push(`/album/0`)"
      />

      <div class="track-info">
        <div class="track-title">
          {{ track.title }}
          <span v-if="type === 'album'" class="track-featured">
            - {{ track.artist }}
          </span>
        </div>
        <div v-if="type !== 'album'" class="track-artist">
          {{ track.artist }}
        </div>
      </div>

      <div v-if="showAlbum && track.album && type !== 'album'" class="track-album">
        <a @click.stop="router.push(`/album/0`)">{{ track.album }}</a>
      </div>

      <div class="track-time">{{ formatTime(track.duration) }}</div>
    </div>
  </div>
</template>

<style scoped>
.track-row {
  display: flex; align-items: center;
  padding: 8px; border-radius: 12px;
  user-select: none; cursor: pointer; transition: background 0.3s;
}
.track-row.track-hover { background: var(--color-secondary-bg); }
.track-row.track-playing {
  background: var(--color-primary-bg); color: var(--color-primary);
}
.track-row.track-playing .track-title,
.track-row.track-playing .track-album,
.track-row.track-playing .track-time { color: var(--color-primary); }
.track-row.track-playing .track-artist { color: var(--color-primary); opacity: 0.88; }

.track-no {
  display: flex; justify-content: center; align-items: center; border-radius: 8px;
  margin: 0 20px 0 10px; width: 12px; color: var(--color-text);
  cursor: default; font-size: 14px;
}

.track-img {
  border-radius: 8px; height: 46px; width: 46px; margin-right: 20px;
  border: 1px solid rgba(0,0,0,0.04); cursor: pointer;
}

.track-info { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.track-title {
  font-size: 18px; font-weight: 600; color: var(--color-text);
  padding-right: 16px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.track-artist {
  margin-top: 2px; font-size: 13px; opacity: 0.68; color: var(--color-text);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.track-featured { font-weight: 500; font-size: 14px; opacity: 0.72; }

.track-album {
  flex: 1; font-size: 16px; opacity: 0.88; color: var(--color-text);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.track-album a:hover { text-decoration: underline; }

.track-time {
  font-size: 16px; width: 50px; text-align: right; margin-right: 10px;
  font-variant-numeric: tabular-nums; opacity: 0.88; color: var(--color-text);
}
</style>
