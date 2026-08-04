<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('word-count') }}</h1>
    <p class="mb-6" style="color: var(--text-secondary);">{{ t('word-count-desc') }}</p>
    <div class="space-y-4">
      <textarea v-model="text" class="tool-input h-64 font-mono text-sm" :placeholder="t('word-count-placeholder')"></textarea>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="card text-center">
          <p class="text-2xl font-bold" style="color: var(--primary);">{{ stats[0].value }}</p>
          <p class="text-sm mt-1" style="color: var(--text-secondary);">{{ t('total-chars') }}</p>
        </div>
        <div class="card text-center">
          <p class="text-2xl font-bold" style="color: var(--primary);">{{ stats[1].value }}</p>
          <p class="text-sm mt-1" style="color: var(--text-secondary);">{{ t('no-spaces') }}</p>
        </div>
        <div class="card text-center">
          <p class="text-2xl font-bold" style="color: var(--primary);">{{ stats[2].value }}</p>
          <p class="text-sm mt-1" style="color: var(--text-secondary);">{{ t('chinese-chars') }}</p>
        </div>
        <div class="card text-center">
          <p class="text-2xl font-bold" style="color: var(--primary);">{{ stats[3].value }}</p>
          <p class="text-sm mt-1" style="color: var(--text-secondary);">{{ t('lines') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'
const text = ref('')
const stats = computed(() => {
  const txt = text.value
  return [
    { value: txt.length },
    { value: txt.replace(/\s/g, '').length },
    { value: (txt.match(/[\u4e00-\u9fa5]/g) || []).length },
    { value: txt ? txt.split(/\r?\n/).length : 0 },
  ]
})
</script>
