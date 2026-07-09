<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'

const props = defineProps<{ src: string; size?: 'sm' | 'md' | 'lg' | 'xl'; spinning?: boolean }>()
const user = useUserStore()

const sc = computed(() => ({ sm: 'w-10 h-10', md: 'w-16 h-16', lg: 'w-48 h-48', xl: 'w-64 h-64' }[props.size || 'md']))
</script>

<template>
  <div class="rounded-2xl overflow-hidden shadow-lg flex-shrink-0 ring-1 ring-black/5" :class="[sc, { 'cover-spinning': spinning && user.settings.coverSpin }]">
    <img v-if="src" :src="src" class="w-full h-full object-cover" />
    <div v-else class="w-full h-full bg-gradient-to-br from-[#ec4141] to-[#ff6b6b] flex items-center justify-center text-white/60 text-2xl">♪</div>
  </div>
</template>
