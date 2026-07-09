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

  <!-- No keywords: show search prompt -->
  <div v-if="!keywords" class="search-empty">
    <div class="search-empty-icon">🔍</div>
    <div class="search-empty-title">搜索音乐</div>
    <div class="search-empty-desc">在上方搜索框中输入关键词 或 点击热门搜索</div>
    <div class="hot-tags">
      <span v-for="kw in ['周杰伦','Taylor Swift','林俊杰','陈奕迅','ACG','纯音乐']" :key="kw"
        class="hot-tag" @click="$router.push({ name: 'search', params: { keywords: kw } })">{{ kw }}</span>
    </div>
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

.search-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding-top: 15vh; text-align: center;
}
.search-empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.28; }
.search-empty-title { font-size: 28px; font-weight: 700; color: var(--color-text); margin-bottom: 8px; }
.search-empty-desc { font-size: 14px; opacity: 0.48; color: var(--color-text); margin-bottom: 24px; }
.hot-tags { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; max-width: 420px; }
.hot-tag {
  padding: 8px 18px; border-radius: 20px; font-size: 14px; font-weight: 600;
  background: var(--color-secondary-bg); color: var(--color-text); opacity: 0.68;
  cursor: pointer; transition: all 0.15s;
}
.hot-tag:hover { opacity: 1; background: var(--color-primary-bg); color: var(--color-primary); }
</style>
