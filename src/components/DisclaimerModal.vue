<script setup lang="ts">
import { ref } from 'vue'
import { hasAcceptedDisclaimer, acceptDisclaimer } from '@/utils/disclaimer'

const showModal = ref(!hasAcceptedDisclaimer())
const dontShowAgain = ref(false)

function handleAccept() { acceptDisclaimer(dontShowAgain.value); showModal.value = false }
</script>

<template>
  <Teleport to="body">
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-[#eee] max-h-[85vh] overflow-y-auto">
        <div class="text-center mb-3">
          <div class="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[var(--color-primary-bg)] text-[var(--color-primary)] text-lg">⚠</div>
        </div>
        <h2 class="text-center text-base font-bold mb-3 text-[var(--color-text)]">使用须知与免责声明</h2>
        <div class="space-y-1.5 text-[12px] text-[var(--color-text)] opacity-68 mb-4 leading-relaxed">
          <p>1. 本软件为开源项目，<span class="font-semibold opacity-100">仅供学习交流使用</span>。</p>
          <p>2. 所有音乐数据均来自第三方公开 API，本软件<span class="font-semibold opacity-100">不存储、不提供任何音乐文件</span>。</p>
          <p>3. 公共 API 仅供测试体验，<span class="font-semibold opacity-100">不保证稳定性</span>，建议自部署。</p>
          <p>4. 因使用本软件产生的版权问题，由用户<span class="font-semibold opacity-100">自行承担</span>。</p>
          <p>5. 本软件账号为<span class="font-semibold opacity-100">独立体系</span>，与任何音乐平台无关。</p>
        </div>
        <label class="flex items-center gap-2 text-xs opacity-58 cursor-pointer mb-4">
          <input v-model="dontShowAgain" type="checkbox" class="w-4 h-4 rounded accent-[var(--color-primary)]" /> 不再显示
        </label>
        <button class="w-full py-3 rounded-xl bg-[var(--color-primary)] hover:opacity-90 text-white text-sm font-semibold transition-opacity" @click="handleAccept">
          我知道了，开始使用
        </button>
      </div>
    </div>
  </Teleport>
</template>
