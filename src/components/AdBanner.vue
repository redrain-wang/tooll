<template>
  <div v-if="!closed" class="my-6 rounded-xl overflow-hidden border" style="border-color: var(--border); background: var(--card-bg);">
    <!-- Replace this div with real ad code (Google AdSense / Baidu Union) -->
    <div class="flex items-center justify-between px-4 py-2" style="background: var(--bg);">
      <span class="text-xs" style="color: var(--text-secondary);">Advertisement</span>
      <button @click="closed = true" class="text-xs px-2 py-0.5 rounded hover:opacity-70" style="color: var(--text-secondary);">✕</button>
    </div>
    <div class="flex items-center justify-center h-24 md:h-32">
      <p class="text-sm" style="color: var(--text-secondary);">Ad · 728×90</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const closed = ref(false)
</script>
