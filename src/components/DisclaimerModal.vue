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
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
    >
      <div class="bg-surface-900 border border-surface-700 rounded-2xl p-6 mx-4 max-w-md w-full shadow-2xl">
        <!-- Icon -->
        <div class="text-center mb-4">
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-yellow-500/20 text-yellow-500 text-2xl">
            ⚠️
          </div>
        </div>

        <!-- Title -->
        <h2 class="text-center text-lg font-bold mb-4">使用须知与免责声明</h2>

        <!-- Content -->
        <div class="space-y-3 text-sm text-gray-300 mb-6">
          <p>1. 本软件为开源项目，<span class="text-white font-medium">仅供学习交流使用</span>。</p>
          <p>2. 所有音乐数据均来自第三方公开 API，本软件<span class="text-white font-medium">不存储、不提供任何音乐文件</span>，也不对音频内容的版权合法性负责。</p>
          <p>3. 公共 API 仅供测试体验，<span class="text-white font-medium">不保证稳定性</span>；建议用户自行部署 API 服务以获得更好的使用体验（详见设置页）。</p>
          <p>4. 用户因使用本软件产生的任何版权问题，由用户<span class="text-white font-medium">自行承担</span>。请支持正版音乐。</p>
          <p>5. 本软件账号为<span class="text-white font-medium">独立体系</span>，与任何音乐平台无关，不存在封号风险。</p>
        </div>

        <!-- Don't show again -->
        <label class="flex items-center gap-2 text-sm text-gray-400 cursor-pointer mb-4">
          <input
            v-model="dontShowAgain"
            type="checkbox"
            class="w-4 h-4 rounded border-surface-600 bg-surface-800 accent-brand-500"
          />
          不再显示此提示
        </label>

        <!-- Button -->
        <button
          class="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium transition-colors"
          @click="handleAccept"
        >
          我知道了，开始使用
        </button>
      </div>
    </div>
  </Teleport>
</template>
