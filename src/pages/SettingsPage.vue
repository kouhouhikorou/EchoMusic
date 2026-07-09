<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { resetDisclaimer } from '@/utils/disclaimer'
import { SOURCE_NAMES } from '@/api/musicApi'
import type { MusicSource } from '@/api/musicApi'
import { MoonOutline, SunnyOutline, ColorPaletteOutline } from '@vicons/ionicons5'

const user = useUserStore()
const router = useRouter()
const apiUrlInput = ref(user.settings.apiUrl)
const showApiSaved = ref(false)

function updateTheme(theme: 'light' | 'dark' | 'auto') {
  user.updateSettings({ theme })
}

function saveApiUrl() {
  user.updateSettings({ apiUrl: apiUrlInput.value })
  showApiSaved.value = true
  setTimeout(() => showApiSaved.value = false, 2000)
}

function showDisclaimer() {
  resetDisclaimer()
  window.location.reload()
}

// Drag sort for source priority
const sources = ref([...user.settings.sourcePriority])
let dragIdx = -1

function onDragStart(idx: number) {
  dragIdx = idx
}

function onDragOver(e: DragEvent, idx: number) {
  e.preventDefault()
  if (dragIdx === -1 || dragIdx === idx) return
  const copy = [...sources.value]
  ;[copy[dragIdx], copy[idx]] = [copy[idx], copy[dragIdx]]
  sources.value = copy
  dragIdx = idx
}

function onDragEnd() {
  dragIdx = -1
  user.updateSourcePriority(sources.value)
}
</script>

<template>
  <div class="h-full overflow-y-auto">
    <div class="max-w-2xl mx-auto px-4 py-6 space-y-8">
      <h2 class="text-2xl font-bold">设置</h2>

      <!-- Theme -->
      <section>
        <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">外观</h3>
        <div class="bg-surface-850 rounded-xl p-1 flex gap-1">
          <button
            v-for="t in (['dark', 'light', 'auto'] as const)"
            :key="t"
            class="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm transition-colors"
            :class="user.settings.theme === t ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'"
            @click="updateTheme(t)"
          >
            <MoonOutline v-if="t === 'dark'" class="w-4 h-4" />
            <SunnyOutline v-else-if="t === 'light'" class="w-4 h-4" />
            <ColorPaletteOutline v-else class="w-4 h-4" />
            {{ t === 'dark' ? '深色' : t === 'light' ? '浅色' : '自动' }}
          </button>
        </div>
      </section>

      <!-- API Config -->
      <section>
        <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">API 配置</h3>
        <div class="bg-surface-850 rounded-xl p-4 space-y-3">
          <div>
            <label class="text-xs text-gray-400 block mb-1">API 地址</label>
            <div class="flex gap-2">
              <input
                v-model="apiUrlInput"
                class="flex-1 bg-surface-900 border border-surface-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-brand-500 transition-colors"
                placeholder="https://your-api.vercel.app"
              />
              <button
                class="px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded-lg text-sm font-medium transition-colors"
                @click="saveApiUrl"
              >
                保存
              </button>
            </div>
            <p v-if="showApiSaved" class="text-xs text-green-400 mt-1">✓ API 地址已保存</p>
          </div>

          <div>
            <label class="text-xs text-gray-400 block mb-2">音源优先级 (拖拽排序)</label>
            <div class="space-y-1">
              <div
                v-for="(src, idx) in sources"
                :key="src"
                class="flex items-center gap-3 px-3 py-2.5 bg-surface-900 rounded-lg cursor-move text-sm hover:bg-surface-800 transition-colors"
                draggable="true"
                @dragstart="onDragStart(idx)"
                @dragover="onDragOver($event, idx)"
                @dragend="onDragEnd"
              >
                <span class="text-gray-500 text-xs w-4">☰</span>
                <span class="text-gray-500 text-xs">{{ idx + 1 }}</span>
                <span>{{ SOURCE_NAMES[src] }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Playback -->
      <section>
        <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">播放</h3>
        <div class="bg-surface-850 rounded-xl p-4 space-y-3">
          <label class="flex items-center justify-between">
            <span class="text-sm">淡入淡出</span>
            <input
              type="checkbox"
              :checked="user.settings.crossfadeEnabled"
              class="w-5 h-5 rounded accent-brand-500"
              @change="user.updateSettings({ crossfadeEnabled: ($event.target as HTMLInputElement).checked })"
            />
          </label>
          <label class="flex items-center justify-between">
            <span class="text-sm">封面旋转动画</span>
            <input
              type="checkbox"
              :checked="user.settings.coverSpin"
              class="w-5 h-5 rounded accent-brand-500"
              @change="user.updateSettings({ coverSpin: ($event.target as HTMLInputElement).checked })"
            />
          </label>
          <label class="flex items-center justify-between">
            <span class="text-sm">音源切换确认弹窗</span>
            <input
              type="checkbox"
              :checked="user.settings.sourceSwitchConfirm"
              class="w-5 h-5 rounded accent-brand-500"
              @change="user.updateSettings({ sourceSwitchConfirm: ($event.target as HTMLInputElement).checked })"
            />
          </label>
        </div>
      </section>

      <!-- About -->
      <section>
        <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">关于</h3>
        <div class="bg-surface-850 rounded-xl divide-y divide-surface-700">
          <div
            class="px-4 py-3 text-sm cursor-pointer hover:text-white transition-colors text-gray-400"
            @click="showDisclaimer"
          >
            查看免责声明
          </div>
          <div class="px-4 py-3 text-sm text-gray-500">
            EchoMusic v0.1.0 · MIT License
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
