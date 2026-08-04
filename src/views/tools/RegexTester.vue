<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('regex') }}</h1>
    <p class="mb-6" style="color: var(--text-secondary);">{{ t('regex-desc') }}</p>
    <div class="space-y-4">
      <div class="flex gap-3">
        <div class="flex-1 flex items-center gap-2 px-3 rounded-lg border" style="border-color: var(--border); background: var(--card-bg);">
          <span style="color: var(--text-secondary);">/</span>
          <input v-model="pattern" class="flex-1 bg-transparent border-none outline-none font-mono text-sm" :placeholder="t('regex-placeholder')" style="color: var(--text);">
          <span style="color: var(--text-secondary);">/</span>
          <input v-model="flags" class="w-16 bg-transparent border-none outline-none font-mono text-sm" placeholder="gim" style="color: var(--text);">
        </div>
      </div>
      <textarea v-model="text" class="tool-input h-48 font-mono text-sm" :placeholder="t('test-text')"></textarea>
      <div v-if="matches.length" class="card">
        <p class="text-sm font-semibold mb-3">{{ t('match-count', { n: matches.length }) }}</p>
        <div class="space-y-2">
          <div v-for="(m, i) in matches" :key="i" class="flex items-center gap-3 p-2 rounded-lg font-mono text-sm" style="background: var(--bg);">
            <span class="text-xs font-medium px-2 py-0.5 rounded" style="background: var(--primary); color: white;">{{ i + 1 }}</span>
            <span class="flex-1 break-all" style="color: var(--text);">"{{ m }}"</span>
          </div>
        </div>
      </div>
      <div v-if="error" class="p-3 rounded-lg text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'
const pattern = ref(''); const flags = ref('g'); const text = ref(''); const error = ref('')
const matches = computed(() => {
  if (!pattern.value || !text.value) return []
  try { error.value = ''; return text.value.match(new RegExp(pattern.value, flags.value)) || [] }
  catch (e) { error.value = e.message; return [] }
})
</script>
