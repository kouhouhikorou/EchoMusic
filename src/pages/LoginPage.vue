<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login, register, logout, isLoggedIn, getUser } from '@/api/authApi'

const router = useRouter()
const isLogin = ref(true)
const username = ref(''); const email = ref(''); const password = ref('')
const error = ref(''); const loading = ref(false)
const loggedIn = ref(isLoggedIn())
const currentUser = ref(getUser())

async function submit() {
  error.value = ''; loading.value = true
  try {
    if (isLogin.value) {
      await login(email.value, password.value)
    } else {
      await register(username.value, email.value, password.value)
    }
    loggedIn.value = true
    currentUser.value = getUser()
    router.push('/')
  } catch (e: any) {
    error.value = e.message || '操作失败'
  } finally {
    loading.value = false
  }
}

function doLogout() {
  logout()
  loggedIn.value = false
  currentUser.value = null
}
</script>

<template>
  <div class="h-full flex items-center justify-center px-4">
    <!-- Already logged in -->
    <div v-if="loggedIn && currentUser" class="text-center max-w-sm">
      <div class="w-16 h-16 rounded-full bg-[var(--color-primary-bg)] flex items-center justify-center mx-auto mb-4 text-2xl text-[var(--color-primary)]">
        {{ currentUser.username[0].toUpperCase() }}
      </div>
      <h2 class="text-xl font-bold text-[var(--color-text)] mb-1">{{ currentUser.username }}</h2>
      <p class="text-sm opacity-58 mb-6">{{ currentUser.email }}</p>
      <button class="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity" @click="router.push('/')">
        返回首页
      </button>
      <button class="block mx-auto mt-3 text-sm opacity-48 hover:opacity-100 transition-opacity" @click="doLogout">
        退出登录
      </button>
    </div>

    <!-- Login form -->
    <div v-else class="w-full max-w-[360px]">
      <div class="text-center mb-8">
        <div class="w-16 h-16 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center mx-auto mb-3 shadow-lg">
          <span class="text-white text-2xl font-bold">♪</span>
        </div>
        <h1 class="text-xl font-bold text-[var(--color-text)]">EchoMusic</h1>
        <p class="text-[13px] opacity-58 mt-1">独立账号，与任何音乐平台无关</p>
      </div>

      <div class="space-y-3">
        <div v-if="!isLogin" class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 opacity-28">👤</span>
          <input v-model="username" class="w-full bg-[var(--color-secondary-bg)] border border-transparent rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] transition-colors font-[inherit]" placeholder="用户名" />
        </div>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 opacity-28">✉</span>
          <input v-model="email" type="email" class="w-full bg-[var(--color-secondary-bg)] border border-transparent rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] transition-colors font-[inherit]" placeholder="邮箱" />
        </div>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 opacity-28">🔒</span>
          <input v-model="password" type="password" class="w-full bg-[var(--color-secondary-bg)] border border-transparent rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] transition-colors font-[inherit]" placeholder="密码" @keyup.enter="submit" />
        </div>
        <div v-if="error" class="text-[13px] text-red-500 text-center">{{ error }}</div>
        <button class="w-full py-3 bg-[var(--color-primary)] hover:opacity-90 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-50" :disabled="loading" @click="submit">
          {{ loading ? '请稍候...' : (isLogin ? '登录' : '注册') }}
        </button>
        <p class="text-center text-[13px] opacity-58">
          {{ isLogin ? '还没有账号？' : '已有账号？' }}
          <button class="text-[var(--color-primary)] hover:underline font-semibold" @click="isLogin = !isLogin; error = ''">{{ isLogin ? '立即注册' : '去登录' }}</button>
        </p>
      </div>
    </div>
  </div>
</template>
