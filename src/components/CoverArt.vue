<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'

const props = defineProps<{
  src: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  spinning?: boolean
}>()

const user = useUserStore()

const sizeClass = computed(() => ({
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-48 h-48',
  xl: 'w-64 h-64',
}[props.size || 'md']))
</script>

<template>
  <div
    class="rounded-2xl overflow-hidden shadow-2xl flex-shrink-0"
    :class="[sizeClass, { 'cover-spinning': spinning && user.settings.coverSpin }]"
  >
    <img
      v-if="src"
      :src="src"
      class="w-full h-full object-cover"
      @error="($event.target as HTMLImageElement).style.display = 'none'"
    />
    <div
      v-else
      class="w-full h-full bg-gradient-to-br from-brand-600 via-purple-600 to-pink-600 flex items-center justify-center"
    >
      <span class="text-white/40 text-2xl">🎵</span>
    </div>
  </div>
</template>
