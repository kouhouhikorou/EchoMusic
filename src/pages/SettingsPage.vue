<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { resetDisclaimer } from '@/utils/disclaimer'

const user = useUserStore()
const apiUrl = ref(user.settings.apiUrl)
const saved = ref(false)

function saveApi() { user.updateSettings({ apiUrl: apiUrl.value }); saved.value = true; setTimeout(() => saved.value = false, 2000) }
function showDisclaimer() { resetDisclaimer(); window.location.reload() }
</script>

<template>
  <div>
    <div class="section-title">设置</div>

    <div class="settings-group">
      <div class="settings-label">API 地址</div>
      <div class="flex gap-2">
        <input v-model="apiUrl" class="settings-input" placeholder="https://your-api.vercel.app" />
        <button class="settings-btn" @click="saveApi">保存</button>
      </div>
      <div v-if="saved" class="text-xs text-green-500 mt-1">✓ 已保存</div>
    </div>

    <div class="settings-group">
      <div class="settings-label">外观</div>
      <div class="flex gap-2">
        <button v-for="t in (['light','dark','auto'] as const)" :key="t"
          class="settings-btn" :class="{ '!bg-[var(--color-primary)] !text-white': user.settings.theme === t }"
          @click="user.updateSettings({ theme: t })"
        >{{ t === 'light' ? '浅色' : t === 'dark' ? '深色' : '自动' }}</button>
      </div>
    </div>

    <div class="settings-group">
      <div class="settings-label">播放</div>
      <label class="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" :checked="user.settings.coverSpin" class="accent-[var(--color-primary)]" @change="user.updateSettings({ coverSpin: ($event.target as HTMLInputElement).checked })" /> 封面旋转动画
      </label>
    </div>

    <div class="settings-group">
      <button class="text-sm text-[var(--color-primary)] hover:underline" @click="showDisclaimer">查看免责声明</button>
      <div class="text-xs opacity-38 mt-2">EchoMusic v0.1.0 · MIT</div>
    </div>
  </div>
</template>

<style scoped>
.section-title { font-size: 28px; font-weight: 700; color: var(--color-text); margin-bottom: 32px; margin-top: 24px; }
.settings-group { margin-bottom: 24px; }
.settings-label { font-size: 14px; font-weight: 600; opacity: 0.68; margin-bottom: 8px; color: var(--color-text); }
.settings-input {
  flex: 1; background: var(--color-secondary-bg); border: 1px solid #e0e0e0;
  border-radius: 8px; padding: 8px 12px; font-size: 14px; color: var(--color-text);
  outline: none; font-family: inherit;
}
.settings-input:focus { border-color: var(--color-primary); }
.settings-btn {
  padding: 8px 16px; background: var(--color-secondary-bg); border-radius: 8px;
  font-size: 14px; font-weight: 600; color: var(--color-text); transition: all 0.2s;
}
.settings-btn:hover { background: var(--color-primary-bg-for-transparent); }
</style>
