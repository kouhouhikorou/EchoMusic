<script setup lang="ts">
import { ref } from 'vue'
import { hasAcceptedDisclaimer, acceptDisclaimer } from '@/utils/disclaimer'

const showModal = ref(!hasAcceptedDisclaimer())
const dontShowAgain = ref(false)

function handleAccept() {
  acceptDisclaimer(dontShowAgain.value)
  showModal.value = false
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      >
        <div class="bg-surface-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
          <div class="text-center mb-4">
            <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/15 text-amber-400 text-2xl">⚠️</div>
          </div>

          <h2 class="text-center text-lg font-bold mb-4">使用须知与免责声明</h2>

          <div class="space-y-2.5 text-[13px] text-gray-400 mb-5 leading-relaxed">
            <p>1. 本软件为开源项目，<span class="text-white font-medium">仅供学习交流使用</span>。</p>
            <p>2. 所有音乐数据均来自第三方公开 API，本软件<span class="text-white font-medium">不存储、不提供任何音乐文件</span>，不对版权合法性负责。</p>
            <p>3. 公共 API 仅供测试体验，<span class="text-white font-medium">不保证稳定性</span>，建议自部署。</p>
            <p>4. 因使用本软件产生的版权问题，由用户<span class="text-white font-medium">自行承担</span>。请支持正版音乐。</p>
            <p>5. 本软件账号为<span class="text-white font-medium">独立体系</span>，与任何音乐平台无关，不存在封号风险。</p>
          </div>

          <label class="flex items-center gap-2 text-xs text-gray-500 cursor-pointer mb-4">
            <input v-model="dontShowAgain" type="checkbox" class="w-4 h-4 rounded accent-brand-500" />
            不再显示此提示
          </label>

          <button
            class="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-medium transition-all active:scale-[0.98] shadow-lg shadow-brand-500/20"
            @click="handleAccept"
          >
            我知道了，开始使用
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from > div { transform: scale(0.95); }
</style>
