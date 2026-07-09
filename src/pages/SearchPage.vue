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
const searchHistory = ref<string[]>(JSON.parse(localStorage.getItem('echomusic-search-history') || '[]'))

const hotKeywords = ['周杰伦', 'Taylor Swift', '林俊杰', '陈奕迅', 'Beyond', 'ACG', '纯音乐', '说唱', '告五人', '邓紫棋']

function saveHistory() { localStorage.setItem('echomusic-search-history', JSON.stringify(searchHistory.value.slice(0, 20))) }

async function doSearch() {
  const kw = keyword.value.trim(); if (!kw) return
  loading.value = true; searched.value = true
  if (!searchHistory.value.includes(kw)) { searchHistory.value.unshift(kw); saveHistory() }
  try { const res = await searchMusic({ keyword: kw, source: currentSource.value, type: activeTab.value === 'song' ? 'song' : activeTab.value }); results.value = res.songs }
  catch { results.value = [] }
  loading.value = false
}

function setKeyword(kw: string) { keyword.value = kw; doSearch() }
function clearKeyword() { keyword.value = ''; results.value = []; searched.value = false }
function playSong(song: Song, songs: Song[], index: number) { player.playQueue(songs, index) }
</script>

<template>
  <div class="h-full overflow-y-auto">
    <div class="max-w-[900px] mx-auto px-6 py-6">
      <!-- Search bar -->
      <div class="relative mb-5">
        <div class="flex items-center gap-3 bg-white border border-[#e8e8e8] rounded-2xl px-4 py-3 focus-within:border-[#ec4141] focus-within:shadow-sm transition-all">
          <SearchOutline class="w-5 h-5 text-[#ccc] flex-shrink-0" />
          <input v-model="keyword" class="flex-1 bg-transparent border-none outline-none text-[15px] text-[#1a1a1a] placeholder-[#ccc]"
            placeholder="搜索歌曲、歌手、专辑..." @keyup.enter="doSearch" />
          <CloseCircleOutline v-if="keyword" class="w-5 h-5 text-[#ccc] hover:text-[#666] cursor-pointer flex-shrink-0" @click="clearKeyword" />
        </div>

        <div class="flex items-center gap-1.5 mt-3">
          <button v-for="src in (['netease', 'qq', 'kugou', 'bilibili'] as MusicSource[])" :key="src"
            class="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border"
            :class="currentSource === src
              ? 'bg-[#ec4141] text-white border-[#ec4141]'
              : 'bg-white text-[#666] border-[#e8e8e8] hover:border-[#ec4141] hover:text-[#ec4141]'"
            @click="currentSource = src; if(keyword.trim()) doSearch()">
            {{ SOURCE_NAMES[src] }}
          </button>
        </div>
      </div>

      <!-- Before search -->
      <div v-if="!searched">
        <div class="mb-6">
          <div class="flex items-center gap-2 mb-3">
            <FlameOutline class="w-4 h-4 text-[#ec4141]" />
            <span class="text-sm font-semibold text-[#333]">热门搜索</span>
          </div>
          <div class="flex flex-wrap gap-2">
            <span v-for="kw in hotKeywords" :key="kw"
              class="px-3.5 py-2 bg-white border border-[#f0f0f0] rounded-xl text-[13px] text-[#666] hover:text-[#ec4141] hover:border-[#ec4141]/20 cursor-pointer transition-all"
              @click="setKeyword(kw)">{{ kw }}</span>
          </div>
        </div>

        <div v-if="searchHistory.length > 0">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-semibold text-[#333]">搜索历史</span>
            <button class="text-xs text-[#ccc] hover:text-[#666]" @click="searchHistory = []; saveHistory()">清除</button>
          </div>
          <div class="flex flex-wrap gap-2">
            <span v-for="kw in searchHistory.slice(0, 10)" :key="kw"
              class="px-3.5 py-2 bg-white border border-[#f0f0f0] rounded-xl text-[13px] text-[#999] hover:text-[#666] hover:border-[#ddd] cursor-pointer transition-all"
              @click="setKeyword(kw)">{{ kw }}</span>
          </div>
        </div>
      </div>

      <!-- Results -->
      <div v-if="searched">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-1 bg-[#f5f5f5] rounded-xl p-1">
            <button v-for="tab in (['song', 'album', 'playlist'] as const)" :key="tab"
              class="px-4 py-1.5 rounded-lg text-xs font-medium transition-all"
              :class="activeTab === tab ? 'bg-white text-[#ec4141] shadow-sm' : 'text-[#999] hover:text-[#666]'"
              @click="activeTab = tab">
              {{ tab === 'song' ? '单曲' : tab === 'album' ? '专辑' : '歌单' }}
            </button>
          </div>
          <span v-if="!loading" class="text-xs text-[#ccc]">{{ results.length }} 条结果</span>
        </div>
        <div v-if="loading" class="flex items-center justify-center py-20">
          <div class="w-7 h-7 border-2 border-[#ec4141] border-t-transparent rounded-full animate-spin" />
        </div>
        <SongList v-else :songs="results" :show-index="true" :show-cover="true" :show-album="true"
          @play="(s, i) => playSong(s, results, i)" />
      </div>
    </div>
  </div>
</template>
