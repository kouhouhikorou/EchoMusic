<script setup lang="ts">
import AppLayout from './components/AppLayout.vue'
import DisclaimerModal from './components/DisclaimerModal.vue'
</script>

<template>
  <DisclaimerModal />
  <AppLayout>
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </AppLayout>
</template>
