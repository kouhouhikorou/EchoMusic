<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePlayerStore } from '@/stores/playerStore'
import type { Song } from '@/stores/playerStore'
import { parseAudioFile, fileToObjectUrl, isAudioFile, SUPPORTED_FORMATS } from '@/utils/id3Parser'
import SongList from '@/components/SongList.vue'
import { CloudUploadOutline } from '@vicons/ionicons5'

const player = usePlayerStore()
const localSongs = ref<Song[]>([])
const isDragging = ref(false)
const importMsg = ref('')

onMounted(() => {
  try { const s = localStorage.getItem('echomusic-local-songs'); if (s) localSongs.value = JSON.parse(s) } catch {}
})

function save() { localStorage.setItem('echomusic-local-songs', JSON.stringify(localSongs.value)) }

async function importFiles(files: FileList | File[]) {
  const arr = Array.from(files).filter(isAudioFile)
  if (!arr.length) { importMsg.value = '未识别到支持的音频文件'; setTimeout(() => importMsg.value = '', 3000); return }
  importMsg.value = `正在导入 ${arr.length} 首...`
  const news: Song[] = []
  for (const f of arr) {
    try {
      const { metadata, coverBlob } = await parseAudioFile(f)
      let cover = ''; if (coverBlob) cover = URL.createObjectURL(coverBlob)
      news.push({ id: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`, title: metadata.title || f.name, artist: metadata.artist || '未知歌手', album: metadata.album || '未知专辑', cover, url: fileToObjectUrl(f), duration: metadata.duration || 0, lyric: '', source: 'local', localPath: f.name, format: metadata.format })
    } catch {}
  }
  localSongs.value = [...news, ...localSongs.value]; save()
  importMsg.value = `成功导入 ${news.length} 首`; setTimeout(() => importMsg.value = '', 3000)
}

function playSong(s: Song, list: Song[], i: number) { player.playQueue(list, i) }
</script>

<template>
  <div class="h-full overflow-y-auto bg-[#fafafa]">
    <div class="max-w-[900px] mx-auto px-6 py-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-[22px] font-bold text-[#1a1a1a]">本地音乐</h2>
        <label class="flex items-center gap-2 px-4 py-2 bg-[#ec4141] hover:bg-[#d63636] rounded-full text-[13px] font-medium text-white cursor-pointer transition-colors shadow-sm">
          <CloudUploadOutline class="w-4 h-4" /> 导入歌曲
          <input type="file" class="hidden" multiple accept="audio/*" @change="importFiles(($event.target as HTMLInputElement).files!)" />
        </label>
      </div>

      <div v-if="importMsg" class="mb-4 px-4 py-3 bg-[#fef0f0] border border-[#ec4141]/20 rounded-xl text-[13px] text-[#ec4141]">{{ importMsg }}</div>

      <div class="mb-6 border-2 border-dashed rounded-2xl p-12 text-center transition-colors bg-white"
        :class="isDragging ? 'border-[#ec4141] bg-[#fef0f0]' : 'border-[#e8e8e8] hover:border-[#ccc]'"
        @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="isDragging = false; importFiles($event.dataTransfer!.files)">
        <span class="text-3xl mb-2 block">📂</span>
        <p class="text-[13px] text-[#999] mb-1">拖拽音频文件到此处</p>
        <p class="text-[11px] text-[#ccc]">支持 {{ SUPPORTED_FORMATS.join(', ') }}</p>
      </div>

      <div class="bg-white rounded-xl border border-[#f0f0f0] overflow-hidden">
        <SongList :songs="localSongs" :show-index="true" :show-cover="true" @play="(s, i) => playSong(s, localSongs, i)" />
      </div>
    </div>
  </div>
</template>
