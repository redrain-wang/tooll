<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('json-csv') }}</h1>
    <p class="mb-6" style="color: var(--text-secondary);">{{ t('json-csv-desc') }}</p>
    <div class="space-y-4">
      <textarea v-model="input" class="tool-input h-48 font-mono text-sm" placeholder='[{"name":"Alice","age":30},{"name":"Bob","age":25}]'></textarea>
      <div class="flex gap-3 flex-wrap">
        <button @click="convert" class="btn-primary">{{ t('convert') || 'Convert' }}</button>
        <button @click="download" class="btn-secondary" :disabled="!output">📥 {{ t('download') }}</button>
        <button @click="copy" class="btn-secondary">📋 {{ t('copy') }}</button>
      </div>
      <div v-if="error" class="p-3 rounded-lg text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">{{ error }}</div>
      <textarea v-model="output" class="tool-input h-48 font-mono text-sm" readonly style="background: var(--card-bg);" placeholder="CSV output..."></textarea>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { t } from '../../i18n'
const input = ref(''); const output = ref(''); const error = ref('')

function convert() {
  try {
    const data = JSON.parse(input.value)
    const arr = Array.isArray(data) ? data : [data]
    if (!arr.length) { error.value = 'Empty array'; return }
    const headers = [...new Set(arr.flatMap(Object.keys))]
    const csv = [headers.join(','), ...arr.map(row => headers.map(h => {
      const v = row[h] ?? ''
      return typeof v === 'string' && (v.includes(',') || v.includes('"') || v.includes('\n'))
        ? '"' + v.replace(/"/g, '""') + '"' : v
    }).join(','))].join('\n')
    output.value = csv; error.value = ''
    window.showToast?.('OK')
  } catch (e) { error.value = e.message }
}

function copy() { navigator.clipboard.writeText(output.value); window.showToast?.(t('copied')) }
function download() {
  const blob = new Blob([output.value], { type: 'text/csv' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'data.csv'; a.click()
}
</script>
