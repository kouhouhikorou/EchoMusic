<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { ref } from 'vue'
import { resetDisclaimer } from '@/utils/disclaimer'
import { SOURCE_NAMES } from '@/api/musicApi'
import { MoonOutline, SunnyOutline } from '@vicons/ionicons5'

const user = useUserStore()
const apiUrlInput = ref(user.settings.apiUrl)
const showSaved = ref(false)
const sources = ref([...user.settings.sourcePriority])

function saveApi() { user.updateSettings({ apiUrl: apiUrlInput.value }); showSaved.value = true; setTimeout(() => showSaved.value = false, 2000) }
function showDisclaimer() { resetDisclaimer(); window.location.reload() }

let dragIdx = -1
function onDragStart(i: number) { dragIdx = i }
function onDragOver(e: DragEvent, i: number) { e.preventDefault(); if (dragIdx === -1 || dragIdx === i) return; const c = [...sources.value]; [c[dragIdx], c[i]] = [c[i], c[dragIdx]]; sources.value = c; dragIdx = i }
function onDragEnd() { dragIdx = -1; user.updateSourcePriority(sources.value) }
</script>

<template>
  <div class="h-full overflow-y-auto bg-[#fafafa]">
    <div class="max-w-[640px] mx-auto px-6 py-6 space-y-8">
      <h2 class="text-[22px] font-bold text-[#1a1a1a]">设置</h2>

      <!-- Theme -->
      <section class="bg-white rounded-xl border border-[#f0f0f0] p-4">
        <h3 class="text-xs font-semibold text-[#999] uppercase tracking-wider mb-3">外观</h3>
        <div class="flex gap-2">
          <button v-for="t in ([{k:'light',l:'浅色',i:SunnyOutline},{k:'dark',l:'深色',i:MoonOutline},{k:'auto',l:'自动',i:SunnyOutline}] as const)" :key="t.k"
            class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-medium transition-all border"
            :class="user.settings.theme === t.k ? 'bg-[#fef0f0] text-[#ec4141] border-[#ec4141]/20' : 'text-[#999] border-[#f0f0f0] hover:border-[#ddd]'"
            @click="user.updateSettings({ theme: t.k })">
            <component :is="t.i" class="w-4 h-4" />{{ t.l }}
          </button>
        </div>
      </section>

      <!-- API -->
      <section class="bg-white rounded-xl border border-[#f0f0f0] p-4">
        <h3 class="text-xs font-semibold text-[#999] uppercase tracking-wider mb-3">API 配置</h3>
        <div class="space-y-3">
          <div>
            <label class="text-[11px] text-[#999] block mb-1">API 地址</label>
            <div class="flex gap-2">
              <input v-model="apiUrlInput" class="flex-1 bg-[#fafafa] border border-[#e8e8e8] rounded-lg px-3 py-2 text-[13px] text-[#333] outline-none focus:border-[#ec4141] transition-colors" placeholder="https://your-api.vercel.app" />
              <button class="px-4 py-2 bg-[#ec4141] hover:bg-[#d63636] rounded-lg text-[13px] font-medium text-white transition-colors" @click="saveApi">保存</button>
            </div>
            <p v-if="showSaved" class="text-xs text-green-500 mt-1">✓ 已保存</p>
          </div>
          <div>
            <label class="text-[11px] text-[#999] block mb-2">音源优先级 (拖拽排序)</label>
            <div class="space-y-1">
              <div v-for="(src, idx) in sources" :key="src"
                class="flex items-center gap-3 px-3 py-2.5 bg-[#fafafa] border border-[#f0f0f0] rounded-lg cursor-move text-[13px] text-[#333] hover:border-[#ddd] transition-colors"
                draggable="true" @dragstart="onDragStart(idx)" @dragover="onDragOver($event, idx)" @dragend="onDragEnd">
                <span class="text-[#ccc] text-xs">☰</span>
                <span class="text-[#ccc] text-xs w-4">{{ idx + 1 }}</span>
                <span>{{ SOURCE_NAMES[src] }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Playback -->
      <section class="bg-white rounded-xl border border-[#f0f0f0] p-4">
        <h3 class="text-xs font-semibold text-[#999] uppercase tracking-wider mb-3">播放</h3>
        <div class="space-y-3">
          <label class="flex items-center justify-between"><span class="text-[13px] text-[#333]">封面旋转动画</span><input type="checkbox" :checked="user.settings.coverSpin" class="w-5 h-5 rounded accent-[#ec4141]" @change="user.updateSettings({ coverSpin: ($event.target as HTMLInputElement).checked })" /></label>
          <label class="flex items-center justify-between"><span class="text-[13px] text-[#333]">淡入淡出</span><input type="checkbox" :checked="user.settings.crossfadeEnabled" class="w-5 h-5 rounded accent-[#ec4141]" @change="user.updateSettings({ crossfadeEnabled: ($event.target as HTMLInputElement).checked })" /></label>
        </div>
      </section>

      <!-- About -->
      <section class="bg-white rounded-xl border border-[#f0f0f0] divide-y divide-[#f0f0f0]">
        <div class="px-4 py-3 text-[13px] text-[#666] cursor-pointer hover:text-[#ec4141] transition-colors" @click="showDisclaimer">查看免责声明</div>
        <div class="px-4 py-3 text-[13px] text-[#ccc]">EchoMusic v0.1.0 · MIT</div>
      </section>
    </div>
  </div>
</template>
