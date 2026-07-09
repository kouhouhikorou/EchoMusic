<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppLayout from './components/AppLayout.vue'
import DisclaimerModal from './components/DisclaimerModal.vue'

const router = useRouter()
</script>

<template>
  <DisclaimerModal />
  <AppLayout>
    <router-view />
  </AppLayout>
</template>
