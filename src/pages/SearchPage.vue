<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePlayerStore } from '@/stores/playerStore'
import { searchMusic, SOURCE_NAMES } from '@/api/musicApi'
import type { MusicSource } from '@/api/musicApi'
import type { Song } from '@/stores/playerStore'
import SongList from '@/components/SongList.vue'
import CoverRow from '@/components/CoverRow.vue'

const route = useRoute()
const player = usePlayerStore()
const keywords = computed(() => (route.params.keywords as string) || '')
const tracks = ref<Song[]>([])
const artists = ref<any[]>([])
const albums = ref<any[]>([])
const playlists = ref<any[]>([])
const show = ref(false)

async function getData() {
  if (!keywords.value) return
  show.value = false
  try {
    const [trackRes, artistRes, albumRes, playlistRes] = await Promise.allSettled([
      searchMusic({ keyword: keywords.value, source: 'netease', type: 'song', limit: 10 }),
      searchMusic({ keyword: keywords.value, source: 'netease', type: 'artist', limit: 3 }),
      searchMusic({ keyword: keywords.value, source: 'netease', type: 'album', limit: 3 }),
      searchMusic({ keyword: keywords.value, source: 'netease', type: 'playlist', limit: 12 }),
    ])
    tracks.value = trackRes.status === 'fulfilled' ? trackRes.value.songs : []
    artists.value = artistRes.status === 'fulfilled' ? (artistRes.value as any).artists || [] : []
    albums.value = albumRes.status === 'fulfilled' ? (albumRes.value as any).albums || [] : []
    playlists.value = playlistRes.status === 'fulfilled' ? (playlistRes.value as any).playlists || [] : []
  } catch {}
  show.value = true
}

watch(keywords, () => { if (keywords.value) getData() }, { immediate: true })

function playSong(song: Song, songs: Song[], index: number) { player.playQueue(songs, index) }
</script>

<template>
  <div v-if="keywords">
    <!-- 艺人 + 专辑 -->
    <div v-if="artists.length || albums.length" class="flex gap-32 mt-[98px]">
      <div v-if="artists.length" class="flex-1">
        <div class="section-title">艺人<router-link :to="`/search/${keywords}/artists`">查看更多</router-link></div>
        <CoverRow type="artist" :items="artists.slice(0, 3)" :column-number="3" gap="34px 24px" />
      </div>
      <div v-if="albums.length" class="flex-1">
        <div class="section-title">专辑<router-link :to="`/search/${keywords}/albums`">查看更多</router-link></div>
        <CoverRow type="album" :items="albums.slice(0, 3)" sub-text="artist" :column-number="3" gap="34px 24px" />
      </div>
    </div>

    <!-- 歌曲 -->
    <div v-if="tracks.length" class="mt-[46px]">
      <div class="section-title">歌曲<router-link :to="`/search/${keywords}/tracks`">查看更多</router-link></div>
      <SongList :songs="tracks" type="tracklist" @play="(s, i) => playSong(s, tracks, i)" />
    </div>

    <!-- 歌单 -->
    <div v-if="playlists.length" class="mt-[46px]">
      <div class="section-title">歌单<router-link :to="`/search/${keywords}/playlists`">查看更多</router-link></div>
      <CoverRow type="playlist" :items="playlists.slice(0, 12)" :column-number="6" gap="34px 24px" />
    </div>
  </div>

  <!-- Empty -->
  <div v-if="!keywords" class="absolute inset-0 flex items-center justify-center text-2xl text-[var(--color-text)] opacity-28">
    🔍 输入关键字搜索
  </div>
</template>

<style scoped>
.section-title {
  font-weight: 600; font-size: 22px; opacity: 0.88; color: var(--color-text);
  margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;
}
.section-title a {
  font-size: 13px; font-weight: 600; opacity: 0.68;
}
.section-title a:hover { text-decoration: underline; }
</style>
