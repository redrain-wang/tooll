<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">📋 {{ t('csv-to-markdown') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('csv-to-markdown-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <textarea v-model="csv" rows="8" class="tool-input w-full font-mono text-xs" :placeholder="t('csv-hint')"></textarea>
      <button @click="convert" class="btn-primary">📋 {{ t('convert') }}</button>

      <div v-if="result" class="pt-3 border-t space-y-3" style="border-color:var(--border)">
        <div class="flex items-center gap-2">
          <button @click="copy" class="btn-secondary">📋 {{ t('copy') }}</button>
          <button @click="download" class="btn-secondary">⬇️ {{ t('download') }}</button>
        </div>
        <textarea :value="result" rows="10" readonly class="tool-input w-full font-mono text-xs"></textarea>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { t } from '../../i18n'

const csv = ref('')
const result = ref('')

function escapeCell(v) {
  return String(v ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ').trim()
}
function parseCsv(text) {
  const rows = []
  let row = [], cur = '', inQ = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') { cur += '"'; i++ }
      else if (c === '"') inQ = false
      else cur += c
    } else if (c === '"') inQ = true
    else if (c === ',') { row.push(cur); cur = '' }
    else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = '' }
    else cur += c
  }
  if (cur || row.length) { row.push(cur); rows.push(row) }
  return rows.filter(r => r.some(c => c.trim() !== ''))
}

function convert() {
  if (!csv.value.trim()) { result.value = ''; return }
  const data = parseCsv(csv.value)
  if (!data.length) { result.value = ''; return }
  const lines = []
  const header = data[0].map(escapeCell)
  lines.push('| ' + header.join(' | ') + ' |')
  lines.push('| ' + header.map(() => '---').join(' | ') + ' |')
  for (let i = 1; i < data.length; i++) {
    lines.push('| ' + data[i].map(escapeCell).join(' | ') + ' |')
  }
  result.value = lines.join('\n')
}
function copy() { navigator.clipboard.writeText(result.value); window.showToast?.(t('copied')) }
function download() {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([result.value], { type: 'text/markdown' }))
  a.download = 'table.md'
  a.click()
}
</script>