<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePlayerStore } from '@/stores/playerStore'
import type { Song } from '@/stores/playerStore'
import { parseAudioFile, fileToObjectUrl, isAudioFile, SUPPORTED_FORMATS } from '@/utils/id3Parser'
import SongList from '@/components/SongList.vue'

const player = usePlayerStore()
const localSongs = ref<Song[]>([])
const isDragging = ref(false)
const msg = ref('')

onMounted(() => {
  try { const s = localStorage.getItem('echomusic-local-songs'); if (s) localSongs.value = JSON.parse(s) } catch {}
})

function save() { localStorage.setItem('echomusic-local-songs', JSON.stringify(localSongs.value)) }

async function importFiles(files: FileList | File[]) {
  const arr = Array.from(files).filter(isAudioFile)
  if (!arr.length) { msg.value = '未识别到支持的音频文件'; setTimeout(() => msg.value = '', 3000); return }
  msg.value = `正在导入 ${arr.length} 首...`
  for (const f of arr) {
    try {
      const { metadata, coverBlob } = await parseAudioFile(f)
      let cover = ''; if (coverBlob) cover = URL.createObjectURL(coverBlob)
      localSongs.value.unshift({
        id: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        title: metadata.title || f.name, artist: metadata.artist || '未知歌手',
        album: metadata.album || '未知专辑', cover, url: fileToObjectUrl(f),
        duration: metadata.duration || 0, lyric: '', source: 'local', localPath: f.name, format: metadata.format,
      })
    } catch {}
  }
  save(); msg.value = `导入完成`; setTimeout(() => msg.value = '', 3000)
}

function playSong(s: Song, l: Song[], i: number) { player.playQueue(l, i) }
</script>

<template>
  <div>
    <div class="section">
      <div class="section-title">本地音乐
        <label class="px-4 py-1.5 bg-[var(--color-primary)] text-white rounded-full text-[13px] font-semibold cursor-pointer hover:opacity-90 transition-opacity">
          导入歌曲 <input type="file" class="hidden" multiple accept="audio/*" @change="importFiles(($event.target as HTMLInputElement).files!)" />
        </label>
      </div>

      <div v-if="msg" class="mb-4 px-4 py-3 bg-[var(--color-primary-bg)] rounded-xl text-sm text-[var(--color-primary)]">{{ msg }}</div>

      <div
        class="mb-6 border-2 border-dashed rounded-2xl p-12 text-center transition-colors cursor-pointer"
        :class="isDragging ? 'border-[var(--color-primary)] bg-[var(--color-primary-bg)]' : 'border-[#e0e0e0] hover:border-[#aaa]'"
        @dragover.prevent="isDragging = true" @dragleave="isDragging = false"
        @drop.prevent="isDragging = false; importFiles($event.dataTransfer!.files)"
      >
        <div class="text-3xl mb-2 opacity-28">📂</div>
        <div class="text-sm opacity-58">拖拽音频到此处</div>
        <div class="text-xs opacity-38 mt-1">支持 {{ SUPPORTED_FORMATS.join(', ') }}</div>
      </div>

      <SongList :songs="localSongs" type="tracklist" :show-index="true" @play="(s, i) => playSong(s, localSongs, i)" />
    </div>
  </div>
</template>

<style scoped>
.section { margin-top: 24px; }
.section-title {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 20px; font-size: 28px; font-weight: 700; color: var(--color-text);
}
</style>
