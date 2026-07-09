<script setup lang="ts">
import { ref } from 'vue'
import { usePlayerStore } from '@/stores/playerStore'
import type { Song } from '@/stores/playerStore'
import { parseAudioFile, fileToObjectUrl, isAudioFile, SUPPORTED_FORMATS } from '@/utils/id3Parser'
import SongList from '@/components/SongList.vue'
import { CloudUploadOutline, FolderOpenOutline } from '@vicons/ionicons5'

const player = usePlayerStore()
const localSongs = ref<Song[]>([])
const isDragging = ref(false)
const importMessage = ref('')

// Load local songs from IndexedDB
async function loadLocalSongs() {
  // For now, store in localStorage as serialized list
  try {
    const stored = localStorage.getItem('echomusic-local-songs')
    if (stored) {
      localSongs.value = JSON.parse(stored)
    }
  } catch {}
}

loadLocalSongs()

function saveLocalSongs() {
  localStorage.setItem('echomusic-local-songs', JSON.stringify(localSongs.value))
}

async function importFiles(files: FileList | File[]) {
  const fileArray = Array.from(files).filter(isAudioFile)
  if (fileArray.length === 0) {
    importMessage.value = '未识别到支持的音频文件'
    setTimeout(() => importMessage.value = '', 3000)
    return
  }

  importMessage.value = `正在导入 ${fileArray.length} 首歌曲...`
  const newSongs: Song[] = []

  for (const file of fileArray) {
    try {
      const { metadata, coverBlob } = await parseAudioFile(file)
      const url = fileToObjectUrl(file)
      let coverUrl = ''
      if (coverBlob) {
        coverUrl = URL.createObjectURL(coverBlob)
      }

      newSongs.push({
        id: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        title: metadata.title || file.name,
        artist: metadata.artist || '未知歌手',
        album: metadata.album || '未知专辑',
        cover: coverUrl,
        url,
        duration: metadata.duration || 0,
        lyric: '',
        source: 'local',
        localPath: file.name,
        format: metadata.format,
      })
    } catch {
      // Skip failed files
    }
  }

  localSongs.value = [...newSongs, ...localSongs.value]
  saveLocalSongs()
  importMessage.value = `成功导入 ${newSongs.length} 首歌曲`
  setTimeout(() => importMessage.value = '', 3000)
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  if (e.dataTransfer?.files) {
    importFiles(e.dataTransfer.files)
  }
}

function onFileInput(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files) {
    importFiles(input.files)
  }
}

function playSong(song: Song, songs: Song[], index: number) {
  player.playQueue(songs, index)
}

function clearLocal() {
  localSongs.value = []
  saveLocalSongs()
}
</script>

<template>
  <div class="h-full overflow-y-auto">
    <div class="max-w-4xl mx-auto px-4 py-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">本地音乐</h2>
        <div class="flex items-center gap-2">
          <label
            class="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded-xl text-sm font-medium cursor-pointer transition-colors"
          >
            <CloudUploadOutline class="w-4 h-4" />
            导入歌曲
            <input type="file" class="hidden" multiple accept="audio/*" @change="onFileInput" />
          </label>
        </div>
      </div>

      <!-- Import message -->
      <div
        v-if="importMessage"
        class="mb-4 px-4 py-3 bg-brand-600/20 border border-brand-600/30 rounded-xl text-sm"
      >
        {{ importMessage }}
      </div>

      <!-- Drop zone -->
      <div
        class="mb-6 border-2 border-dashed rounded-2xl p-12 text-center transition-colors"
        :class="isDragging
          ? 'border-brand-500 bg-brand-500/10'
          : 'border-surface-700 hover:border-surface-500'"
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
        @drop.prevent="onDrop"
      >
        <FolderOpenOutline class="w-10 h-10 text-gray-500 mx-auto mb-3" />
        <p class="text-sm text-gray-400 mb-1">拖拽音频文件到此处</p>
        <p class="text-xs text-gray-600">支持 {{ SUPPORTED_FORMATS.join(', ') }}</p>
      </div>

      <!-- Song list -->
      <SongList
        :songs="localSongs"
        :show-index="true"
        :show-cover="true"
        @play="(song, idx) => playSong(song, localSongs, idx)"
      />

      <!-- Clear button -->
      <div v-if="localSongs.length > 0" class="text-center mt-6">
        <button
          class="text-xs text-gray-600 hover:text-red-400 transition-colors"
          @click="clearLocal"
        >
          清除所有本地歌曲
        </button>
      </div>
    </div>
  </div>
</template>
