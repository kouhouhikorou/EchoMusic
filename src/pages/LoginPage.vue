<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login, register, logout, isLoggedIn, getUser, getServerUrl } from '@/api/authApi'
import { MailOutline, LockClosedOutline, PersonOutline, ArrowForwardOutline, LogOutOutline } from '@vicons/ionicons5'

const router = useRouter()
const mode = ref<'login' | 'register'>('login')
const username = ref(''); const email = ref(''); const password = ref('')
const confirmPwd = ref('')
const error = ref(''); const loading = ref(false)
const loggedIn = ref(isLoggedIn())
const currentUser = ref(getUser())

async function submit() {
  error.value = ''
  if (!email.value || !password.value) { error.value = '请填写邮箱和密码'; return }
  if (mode.value === 'register') {
    if (!username.value) { error.value = '请填写用户名'; return }
    if (password.value.length < 6) { error.value = '密码至少 6 位'; return }
    if (password.value !== confirmPwd.value) { error.value = '两次密码不一致'; return }
  }
  loading.value = true
  try {
    if (mode.value === 'login') {
      await login(email.value, password.value)
    } else {
      await register(username.value, email.value, password.value)
    }
    loggedIn.value = true
    currentUser.value = getUser()
    router.push('/')
  } catch (e: any) {
    if (e?.response?.data?.error) {
      error.value = e.response.data.error
    } else if (e?.message === 'Network Error') {
      error.value = '无法连接服务器，请在设置中检查服务器地址或启动后端服务'
    } else {
      error.value = e.message || '操作失败'
    }
  } finally {
    loading.value = false
  }
}

function doLogout() { logout(); loggedIn.value = false; currentUser.value = null }
function switchMode() { mode.value = mode.value === 'login' ? 'register' : 'login'; error.value = '' }
</script>

<template>
  <div class="login-root">
    <!-- Logged in -->
    <div v-if="loggedIn && currentUser" class="logged-in">
      <div class="avatar-circle">
        <span>{{ currentUser.username[0].toUpperCase() }}</span>
      </div>
      <h2 class="user-name">{{ currentUser.username }}</h2>
      <p class="user-email">{{ currentUser.email }}</p>
      <div class="user-actions">
        <button class="btn-primary" @click="router.push('/')">
          <ArrowForwardOutline class="w-5 h-5" />
          返回首页
        </button>
        <button class="btn-ghost" @click="doLogout">
          <LogOutOutline class="w-5 h-5" />
          退出登录
        </button>
      </div>
    </div>

    <!-- Form -->
    <div v-else class="form-card">
      <div class="form-header">
        <div class="logo-mark">♪</div>
        <h1>EchoMusic</h1>
        <p>独立账号体系，与任何音乐平台无关</p>
      </div>

      <div class="form-body">
        <div v-if="mode === 'register'" class="field">
          <PersonOutline class="field-icon" />
          <input v-model="username" placeholder="用户名" @keyup.enter="submit" />
        </div>
        <div class="field">
          <MailOutline class="field-icon" />
          <input v-model="email" type="email" placeholder="邮箱" @keyup.enter="submit" />
        </div>
        <div class="field">
          <LockClosedOutline class="field-icon" />
          <input v-model="password" type="password" placeholder="密码" @keyup.enter="submit" />
        </div>
        <div v-if="mode === 'register'" class="field">
          <LockClosedOutline class="field-icon" />
          <input v-model="confirmPwd" type="password" placeholder="确认密码" @keyup.enter="submit" />
        </div>

        <div v-if="error" class="error-msg">{{ error }}</div>

        <button class="submit-btn" :disabled="loading" @click="submit">
          {{ loading ? '请稍候...' : mode === 'login' ? '登 录' : '注 册' }}
        </button>

        <p class="switch-text">
          {{ mode === 'login' ? '还没有账号？' : '已有账号？' }}
          <button @click="switchMode">{{ mode === 'login' ? '立即注册' : '去登录' }}</button>
        </p>
        <p class="server-hint">服务器：{{ getServerUrl() }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-root {
  min-height: 100%; display: flex; align-items: center; justify-content: center; padding: 40px 24px;
  overflow-y: auto;
}

/* ---- Logged In ---- */
.logged-in { text-align: center; }
.avatar-circle {
  width: 72px; height: 72px; border-radius: 50%;
  background: var(--color-primary-bg); color: var(--color-primary);
  display: flex; align-items: center; justify-content: center;
  font-size: 28px; font-weight: 800; margin: 0 auto 16px;
}
.user-name { font-size: 22px; font-weight: 700; color: var(--color-text); margin-bottom: 4px; }
.user-email { font-size: 14px; opacity: 0.58; margin-bottom: 24px; }
.user-actions { display: flex; flex-direction: column; gap: 10px; align-items: center; }
.btn-primary {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 28px; border-radius: 24px; font-size: 14px; font-weight: 700;
  background: var(--color-primary); color: #fff; transition: opacity 0.2s;
}
.btn-primary:hover { opacity: 0.9; }
.btn-ghost {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 600; opacity: 0.45; color: var(--color-text);
  transition: opacity 0.2s;
}
.btn-ghost:hover { opacity: 1; }

/* ---- Form Card ---- */
.form-card {
  width: 100%; max-width: 400px;
  background: #fff; border-radius: 20px; padding: 32px 28px;
  box-shadow: 0 2px 24px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.04);
}
.form-header {
  text-align: center; margin-bottom: 24px;
}
.logo-mark {
  width: 48px; height: 48px; border-radius: 14px;
  background: var(--color-primary); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; font-weight: 800; margin: 0 auto 12px;
  box-shadow: 0 8px 24px rgba(51,94,234,0.28);
}
.form-header h1 { font-size: 20px; font-weight: 800; color: var(--color-text); margin-bottom: 4px; }
.form-header p { font-size: 13px; opacity: 0.48; line-height: 1.5; }

/* ---- Fields ---- */
.form-body { display: flex; flex-direction: column; gap: 10px; }
.field {
  position: relative; display: flex; align-items: center;
}
.field-icon {
  position: absolute; left: 14px; width: 18px; height: 18px;
  color: var(--color-text); opacity: 0.22; pointer-events: none; flex-shrink: 0;
}
.field input {
  width: 100%; padding: 12px 14px 12px 42px;
  background: var(--color-secondary-bg); border: 2px solid transparent;
  border-radius: 12px; font-size: 14px; font-weight: 500;
  color: var(--color-text); outline: none; font-family: inherit;
  transition: border-color 0.2s, background 0.2s;
}
.field input:focus { border-color: var(--color-primary); background: #fff; }
.field input::placeholder { color: var(--color-text); opacity: 0.28; }

.error-msg {
  font-size: 13px; color: #ef4444; text-align: center; font-weight: 500;
}

.submit-btn {
  margin-top: 4px; padding: 13px;
  background: var(--color-primary); color: #fff; border-radius: 12px;
  font-size: 15px; font-weight: 700; font-family: inherit; letter-spacing: 0.3em;
  transition: opacity 0.2s, transform 0.1s;
}
.submit-btn:hover { opacity: 0.92; }
.submit-btn:active { transform: scale(0.98); }
.submit-btn:disabled { opacity: 0.5; pointer-events: none; }

.switch-text {
  text-align: center; font-size: 13px; opacity: 0.48; margin-top: 4px;
}
.switch-text button {
  color: var(--color-primary); font-weight: 700; font-family: inherit; font-size: 13px;
}
.switch-text button:hover { text-decoration: underline; }
.server-hint { text-align: center; font-size: 11px; opacity: 0.28; margin-top: 16px; font-family: monospace; word-break: break-all; }
</style>
