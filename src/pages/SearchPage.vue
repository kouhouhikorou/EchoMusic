<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePlayerStore } from '@/stores/playerStore'
import { searchMusic, searchAllSources, SOURCE_NAMES } from '@/api/musicApi'
import type { MusicSource } from '@/api/musicApi'
import type { Song } from '@/stores/playerStore'
import SongList from '@/components/SongList.vue'
import { SearchOutline, CloseCircleOutline } from '@vicons/ionicons5'

const player = usePlayerStore()

const keyword = ref('')
const results = ref<Song[]>([])
const loading = ref(false)
const searched = ref(false)
const currentSource = ref<MusicSource>('netease')
const activeTab = ref<'song' | 'album' | 'playlist'>('song')
const searchHistory = ref<string[]>([])

// Load search history
try {
  const stored = localStorage.getItem('echomusic-search-history')
  if (stored) searchHistory.value = JSON.parse(stored)
} catch {}

function saveHistory() {
  localStorage.setItem('echomusic-search-history', JSON.stringify(searchHistory.value.slice(0, 20)))
}

async function doSearch() {
  const kw = keyword.value.trim()
  if (!kw) return

  loading.value = true
  searched.value = true

  // Save to history
  if (!searchHistory.value.includes(kw)) {
    searchHistory.value.unshift(kw)
    saveHistory()
  }

  try {
    const res = await searchMusic({ keyword: kw, source: currentSource.value, type: activeTab.value === 'song' ? 'song' : activeTab.value })
    results.value = res.songs
  } catch {
    results.value = []
  }

  loading.value = false
}

function setKeyword(kw: string) {
  keyword.value = kw
  doSearch()
}

function clearKeyword() {
  keyword.value = ''
  results.value = []
  searched.value = false
}

function playSong(song: Song, songs: Song[], index: number) {
  player.playQueue(songs, index)
}

function changeSource(source: MusicSource) {
  currentSource.value = source
  if (keyword.value.trim()) doSearch()
}
</script>

<template>
  <div class="h-full overflow-y-auto">
    <div class="max-w-4xl mx-auto px-4 py-6">
      <!-- Search Bar -->
      <div class="relative mb-6">
        <div class="flex items-center gap-2 bg-surface-800 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-brand-500 transition-all">
          <SearchOutline class="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            v-model="keyword"
            class="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm"
            placeholder="搜索歌曲、歌手、专辑..."
            @keyup.enter="doSearch"
          />
          <CloseCircleOutline
            v-if="keyword"
            class="w-5 h-5 text-gray-500 hover:text-white cursor-pointer flex-shrink-0"
            @click="clearKeyword"
          />
        </div>

        <!-- Source Tabs -->
        <div class="flex items-center gap-1 mt-3">
          <button
            v-for="src in (['netease', 'qq', 'kugou', 'bilibili'] as MusicSource[])"
            :key="src"
            class="px-3 py-1 rounded-full text-xs font-medium transition-colors"
            :class="currentSource === src
              ? 'bg-brand-600 text-white'
              : 'bg-surface-800 text-gray-400 hover:text-white'"
            @click="changeSource(src)"
          >
            {{ SOURCE_NAMES[src] }}
          </button>
        </div>
      </div>

      <!-- Search History (before search) -->
      <div v-if="!searched && searchHistory.length > 0" class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-500">搜索历史</span>
          <button
            class="text-xs text-gray-600 hover:text-gray-400"
            @click="searchHistory = []; saveHistory()"
          >
            清除
          </button>
        </div>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="kw in searchHistory.slice(0, 12)"
            :key="kw"
            class="px-3 py-1.5 bg-surface-800 rounded-full text-xs text-gray-400 hover:text-white hover:bg-surface-700 cursor-pointer transition-colors"
            @click="setKeyword(kw)"
          >
            {{ kw }}
          </span>
        </div>
      </div>

      <!-- Results -->
      <div v-if="searched">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-1 bg-surface-850 rounded-lg p-1">
            <button
              v-for="tab in (['song', 'album', 'playlist'] as const)"
              :key="tab"
              class="px-4 py-1.5 rounded-md text-xs font-medium transition-colors"
              :class="activeTab === tab
                ? 'bg-brand-600 text-white'
                : 'text-gray-400 hover:text-white'"
              @click="activeTab = tab"
            >
              {{ tab === 'song' ? '单曲' : tab === 'album' ? '专辑' : '歌单' }}
            </button>
          </div>
          <span v-if="!loading" class="text-xs text-gray-500">{{ results.length }} 条结果</span>
        </div>

        <div v-if="loading" class="flex items-center justify-center py-16">
          <div class="animate-spin w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full" />
        </div>

        <SongList
          v-else
          :songs="results"
          :show-index="true"
          :show-cover="true"
          :show-album="true"
          @play="(song, idx) => playSong(song, results, idx)"
        />
      </div>

      <!-- Empty state -->
      <div
        v-if="!searched"
        class="flex flex-col items-center justify-center py-20 text-gray-600"
      >
        <span class="text-5xl mb-4">🔍</span>
        <p class="text-sm">搜索你喜欢的音乐</p>
      </div>
    </div>
  </div>
</template>
