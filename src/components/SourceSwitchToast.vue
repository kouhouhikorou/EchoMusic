<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { usePlayerStore } from '@/stores/playerStore'
import { SOURCE_NAMES } from '@/api/musicApi'

interface SwitchEvent {
  fromSource: string
  toSource: string
  reason: '404' | 'timeout' | '403'
  success: boolean
}

const player = usePlayerStore()
const toast = ref<SwitchEvent | null>(null)
const visible = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

function show(evt: SwitchEvent) {
  toast.value = evt
  visible.value = true
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    visible.value = false
  }, evt.success ? 1500 : 3000)
}

// Listen for source switch events (can be called from musicApi)
;(window as any).__showSourceSwitchToast = show

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})

const fromName = (s: string) => SOURCE_NAMES[s] || s
</script>

<template>
  <Transition name="toast">
    <div
      v-if="visible && toast"
      class="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg"
      :class="toast.success
        ? 'bg-green-600/90 text-white'
        : 'bg-yellow-600/90 text-white'"
    >
      <template v-if="!toast.success">
        ⚠ {{ fromName(toast.fromSource) }} 音源暂不可用
        <template v-if="toast.reason === '404'">(404)</template>
        <template v-else-if="toast.reason === 'timeout'">(超时)</template>
        <template v-else-if="toast.reason === '403'">(地区限制)</template>
        ，正在切换到 {{ fromName(toast.toSource) }}...
      </template>
      <template v-else>
        ✓ 已切换至 {{ fromName(toast.toSource) }}
      </template>
    </div>
  </Transition>
</template>

<style scoped>
.toast-enter-active { transition: all 0.3s ease; }
.toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translate(-50%, -12px); }
.toast-leave-to { opacity: 0; transform: translate(-50%, -12px); }
</style>
