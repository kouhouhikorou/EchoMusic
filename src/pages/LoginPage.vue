<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login, register } from '@/api/authApi'
import { PersonOutline, LockClosedOutline, MailOutline } from '@vicons/ionicons5'

const router = useRouter()
const isLogin = ref(true)
const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    if (isLogin.value) {
      await login(email.value, password.value)
    } else {
      await register(username.value, email.value, password.value)
    }
    router.push('/')
  } catch (e: any) {
    error.value = e.message || '操作失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="h-full flex items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="text-4xl mb-2">🎵</div>
        <h1 class="text-2xl font-bold">EchoMusic</h1>
        <p class="text-sm text-gray-500 mt-1">独立账号，与任何音乐平台无关</p>
      </div>

      <!-- Form -->
      <div class="space-y-4">
        <div v-if="!isLogin" class="relative">
          <PersonOutline class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            v-model="username"
            class="w-full bg-surface-800 border border-surface-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-brand-500 transition-colors"
            placeholder="用户名"
          />
        </div>

        <div class="relative">
          <MailOutline class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            v-model="email"
            type="email"
            class="w-full bg-surface-800 border border-surface-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-brand-500 transition-colors"
            placeholder="邮箱"
          />
        </div>

        <div class="relative">
          <LockClosedOutline class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            v-model="password"
            type="password"
            class="w-full bg-surface-800 border border-surface-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-brand-500 transition-colors"
            placeholder="密码"
            @keyup.enter="submit"
          />
        </div>

        <div v-if="error" class="text-sm text-red-400 text-center">{{ error }}</div>

        <button
          class="w-full py-3 bg-brand-600 hover:bg-brand-500 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
          :disabled="loading"
          @click="submit"
        >
          {{ loading ? '请稍候...' : (isLogin ? '登录' : '注册') }}
        </button>

        <p class="text-center text-sm text-gray-500">
          {{ isLogin ? '还没有账号？' : '已有账号？' }}
          <button
            class="text-brand-400 hover:text-brand-300 font-medium"
            @click="isLogin = !isLogin; error = ''"
          >
            {{ isLogin ? '立即注册' : '去登录' }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>
