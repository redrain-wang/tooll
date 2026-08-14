<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">📖 {{ t('reading-time') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('reading-time-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <textarea v-model="text" rows="8" class="tool-input w-full" :placeholder="t('reading-time-hint')"></textarea>
      <div class="flex items-center gap-3">
        <label class="text-sm font-medium w-40" style="color:var(--text-secondary)">{{ t('reading-speed') }} ({{ t('wpm') }})</label>
        <input v-model.number="wpm" type="number" min="100" max="500" class="tool-input w-24 font-mono">
      </div>

      <div v-if="stats" class="pt-3 border-t grid grid-cols-3 gap-3" style="border-color:var(--border)">
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('word-counter') }}</div>
          <div class="text-lg font-bold text-indigo-600">{{ stats.words }}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('char-count') }}</div>
          <div class="text-lg font-bold" style="color:var(--text)">{{ stats.chars }}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('reading-time') }}</div>
          <div class="text-lg font-bold" style="color:var(--text)">{{ stats.time }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'

const text = ref('')
const wpm = ref(200)

const stats = computed(() => {
  const txt = text.value.trim()
  if (!txt) return null
  const cjk = (txt.match(/[\u4e00-\u9fff\u3040-\u30ff]/g) || []).length
  const words = (txt.replace(/[\u4e00-\u9fff\u3040-\u30ff]/g, ' ').trim().match(/\S+/g) || []).length + cjk
  const chars = txt.replace(/\s/g, '').length
  const cjkTime = cjk / 300
  const enTime = words / wpm.value
  const total = cjkTime + enTime
  const m = Math.floor(total)
  const s = Math.round((total - m) * 60)
  return { words, chars, time: m + 'm ' + s + 's' }
})
</script>