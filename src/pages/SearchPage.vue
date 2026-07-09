<script setup lang="ts">
import { ref } from 'vue'
import { usePlayerStore } from '@/stores/playerStore'
import { searchMusic, SOURCE_NAMES } from '@/api/musicApi'
import type { MusicSource } from '@/api/musicApi'
import type { Song } from '@/stores/playerStore'
import SongList from '@/components/SongList.vue'
import { SearchOutline, CloseCircleOutline, FlameOutline } from '@vicons/ionicons5'

const player = usePlayerStore()

const keyword = ref('')
const results = ref<Song[]>([])
const loading = ref(false)
const searched = ref(false)
const currentSource = ref<MusicSource>('netease')
const activeTab = ref<'song' | 'album' | 'playlist'>('song')
const searchHistory = ref<string[]>(
  JSON.parse(localStorage.getItem('echomusic-search-history') || '[]')
)

// Hot search keywords (placeholder)
const hotKeywords = ['周杰伦', 'Taylor Swift', 'ACG', '说唱', '纯音乐', 'Beyond', '林俊杰', '钢琴曲']

function saveHistory() {
  localStorage.setItem('echomusic-search-history', JSON.stringify(searchHistory.value.slice(0, 20)))
}

async function doSearch() {
  const kw = keyword.value.trim()
  if (!kw) return
  loading.value = true
  searched.value = true
  if (!searchHistory.value.includes(kw)) {
    searchHistory.value.unshift(kw)
    saveHistory()
  }
  try {
    const res = await searchMusic({ keyword: kw, source: currentSource.value, type: activeTab.value === 'song' ? 'song' : activeTab.value })
    results.value = res.songs
  } catch { results.value = [] }
  loading.value = false
}

function setKeyword(kw: string) { keyword.value = kw; doSearch() }
function clearKeyword() { keyword.value = ''; results.value = []; searched.value = false }
function playSong(song: Song, songs: Song[], index: number) { player.playQueue(songs, index) }
function changeSource(s: MusicSource) { currentSource.value = s; if (keyword.value.trim()) doSearch() }
</script>

<template>
  <div class="h-full overflow-y-auto">
    <div class="max-w-3xl mx-auto px-5 py-6">
      <!-- Search bar -->
      <div class="relative mb-5">
        <div class="flex items-center gap-3 bg-surface-900/70 border border-white/5 rounded-2xl px-4 py-3 focus-within:border-brand-500/30 focus-within:bg-surface-900 transition-all shadow-lg">
          <SearchOutline class="w-5 h-5 text-gray-500 flex-shrink-0" />
          <input
            v-model="keyword"
            class="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-600 text-[15px]"
            placeholder="搜索歌曲、歌手、专辑..."
            @keyup.enter="doSearch"
          />
          <CloseCircleOutline
            v-if="keyword"
            class="w-5 h-5 text-gray-600 hover:text-gray-400 cursor-pointer flex-shrink-0"
            @click="clearKeyword"
          />
        </div>

        <!-- Source tabs -->
        <div class="flex items-center gap-1.5 mt-3">
          <button
            v-for="src in (['netease', 'qq', 'kugou', 'bilibili'] as MusicSource[])"
            :key="src"
            class="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all"
            :class="currentSource === src
              ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
              : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'"
            @click="changeSource(src)"
          >
            {{ SOURCE_NAMES[src] }}
          </button>
        </div>
      </div>

      <!-- Before search: Hot + History -->
      <div v-if="!searched">
        <!-- Hot search -->
        <div class="mb-6">
          <div class="flex items-center gap-2 mb-3">
            <FlameOutline class="w-4 h-4 text-brand-400" />
            <span class="text-sm font-semibold text-gray-300">热门搜索</span>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="kw in hotKeywords"
              :key="kw"
              class="px-3.5 py-2 bg-white/5 rounded-xl text-[13px] text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer transition-all border border-white/5 hover:border-white/10"
              @click="setKeyword(kw)"
            >{{ kw }}</span>
          </div>
        </div>

        <!-- History -->
        <div v-if="searchHistory.length > 0">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-semibold text-gray-400">搜索历史</span>
            <button class="text-xs text-gray-600 hover:text-gray-400 transition-colors" @click="searchHistory = []; saveHistory()">清除全部</button>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="kw in searchHistory.slice(0, 10)"
              :key="kw"
              class="px-3.5 py-2 bg-white/5 rounded-xl text-[13px] text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer transition-all border border-white/5 hover:border-white/10"
              @click="setKeyword(kw)"
            >{{ kw }}</span>
          </div>
        </div>
      </div>

      <!-- Results -->
      <div v-if="searched">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-1 bg-surface-900/70 rounded-xl p-1 border border-white/5">
            <button
              v-for="tab in (['song', 'album', 'playlist'] as const)"
              :key="tab"
              class="px-4 py-1.5 rounded-lg text-xs font-medium transition-all"
              :class="activeTab === tab
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                : 'text-gray-400 hover:text-white'"
              @click="activeTab = tab"
            >
              {{ tab === 'song' ? '单曲' : tab === 'album' ? '专辑' : '歌单' }}
            </button>
          </div>
          <span v-if="!loading" class="text-xs text-gray-600">{{ results.length }} 条结果</span>
        </div>

        <div v-if="loading" class="flex items-center justify-center py-20">
          <div class="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>

        <SongList
          v-else
          :songs="results"
          :show-index="true"
          :show-cover="true"
          :show-album="true"
          @play="(song, idx) => playSong(song, results, idx)"
        />

        <div v-if="!loading && results.length === 0" class="flex flex-col items-center py-20 text-gray-600 gap-2">
          <span class="text-4xl">🔍</span>
          <p class="text-sm">未找到相关结果</p>
          <p class="text-xs">试试其他关键词或切换音源</p>
        </div>
      </div>
    </div>
  </div>
</template>
