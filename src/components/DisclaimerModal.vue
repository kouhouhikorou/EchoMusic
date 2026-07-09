<script setup lang="ts">
import { ref } from 'vue'
import { hasAcceptedDisclaimer, acceptDisclaimer } from '@/utils/disclaimer'

const showModal = ref(!hasAcceptedDisclaimer())
const dontShowAgain = ref(false)

function handleAccept() { acceptDisclaimer(dontShowAgain.value); showModal.value = false }
</script>

<template>
  <Teleport to="body">
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" @click.self="handleAccept">
      <div class="bg-white rounded-3xl max-w-lg w-full shadow-2xl mx-4 flex flex-col max-h-[88vh] relative">
        <!-- Close button -->
        <button class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f0f0f0] text-[var(--color-text)] opacity-40 hover:opacity-80 transition-all z-10" @click="handleAccept">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <!-- Scrollable content -->
        <div class="overflow-y-auto px-8 pt-8 pb-4">
          <div class="text-center mb-4">
            <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-primary-bg)] text-[var(--color-primary)] text-2xl">⚠</div>
          </div>
          <h2 class="text-center text-xl font-bold mb-4 text-[var(--color-text)]">使用须知与免责声明</h2>
          <div class="space-y-2.5 text-sm text-[var(--color-text)] opacity-68 leading-relaxed">
            <p>1. 本软件为开源项目，<span class="font-semibold opacity-100">仅供学习交流使用</span>。</p>
            <p>2. 所有音乐数据均来自第三方公开 API，本软件<span class="font-semibold opacity-100">不存储、不提供任何音乐文件</span>。</p>
            <p>3. 公共 API 仅供测试体验，<span class="font-semibold opacity-100">不保证稳定性</span>，建议自部署。</p>
            <p>4. 因使用本软件产生的版权问题，由用户<span class="font-semibold opacity-100">自行承担</span>。</p>
            <p>5. 本软件账号为<span class="font-semibold opacity-100">独立体系</span>，与任何音乐平台无关。</p>
          </div>
        </div>
        <!-- Sticky footer: checkbox + button -->
        <div class="px-8 pb-8 pt-2 border-t border-[#f0f0f0]">
          <label class="flex items-center gap-2 text-sm opacity-58 cursor-pointer mb-4">
            <input v-model="dontShowAgain" type="checkbox" class="w-5 h-5 rounded accent-[var(--color-primary)]" /> 不再显示
          </label>
          <button class="w-full py-3.5 rounded-xl bg-[var(--color-primary)] hover:opacity-90 text-white text-base font-semibold transition-opacity" @click="handleAccept">
            我知道了，开始使用
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
