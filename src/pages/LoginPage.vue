<script setup lang="ts">
import { ref } from 'vue'
import { login, register } from '@/api/authApi'
import { PersonOutline, LockClosedOutline, MailOutline } from '@vicons/ionicons5'

const isLogin = ref(true)
const username = ref(''); const email = ref(''); const password = ref('')
const error = ref(''); const loading = ref(false)

async function submit() {
  error.value = ''; loading.value = true
  try { isLogin.value ? await login(email.value, password.value) : await register(username.value, email.value, password.value) }
  catch (e: any) { error.value = e.message || '操作失败' }
  finally { loading.value = false }
}
</script>

<template>
  <div class="h-full flex items-center justify-center px-4 bg-[#fafafa]">
    <div class="w-full max-w-[360px]">
      <div class="text-center mb-8">
        <div class="w-16 h-16 rounded-2xl bg-[#ec4141] flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#ec4141]/20">
          <span class="text-white text-2xl font-bold">♪</span>
        </div>
        <h1 class="text-xl font-bold text-[#1a1a1a]">EchoMusic</h1>
        <p class="text-[13px] text-[#999] mt-1">独立账号，与任何音乐平台无关</p>
      </div>

      <div class="space-y-3">
        <div v-if="!isLogin" class="relative">
          <PersonOutline class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ccc]" />
          <input v-model="username" class="w-full bg-white border border-[#e8e8e8] rounded-xl pl-10 pr-4 py-3 text-[14px] text-[#333] outline-none focus:border-[#ec4141] transition-colors" placeholder="用户名" />
        </div>
        <div class="relative">
          <MailOutline class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ccc]" />
          <input v-model="email" type="email" class="w-full bg-white border border-[#e8e8e8] rounded-xl pl-10 pr-4 py-3 text-[14px] text-[#333] outline-none focus:border-[#ec4141] transition-colors" placeholder="邮箱" />
        </div>
        <div class="relative">
          <LockClosedOutline class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ccc]" />
          <input v-model="password" type="password" class="w-full bg-white border border-[#e8e8e8] rounded-xl pl-10 pr-4 py-3 text-[14px] text-[#333] outline-none focus:border-[#ec4141] transition-colors" placeholder="密码" @keyup.enter="submit" />
        </div>
        <div v-if="error" class="text-[13px] text-[#ec4141] text-center">{{ error }}</div>
        <button class="w-full py-3 bg-[#ec4141] hover:bg-[#d63636] rounded-xl text-[14px] font-medium text-white transition-colors disabled:opacity-50" :disabled="loading" @click="submit">
          {{ loading ? '请稍候...' : (isLogin ? '登录' : '注册') }}
        </button>
        <p class="text-center text-[13px] text-[#999]">
          {{ isLogin ? '还没有账号？' : '已有账号？' }}
          <button class="text-[#ec4141] hover:text-[#d63636] font-medium" @click="isLogin = !isLogin; error = ''">{{ isLogin ? '立即注册' : '去登录' }}</button>
        </p>
      </div>
    </div>
  </div>
</template>
