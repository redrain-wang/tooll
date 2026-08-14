<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">📊 {{ t('excel-to-markdown') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('excel-to-markdown-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="card p-6 text-center" @click="$refs.fileInput.click()" @dragover.prevent="dragging=true" @dragleave="dragging=false" @drop.prevent="onDrop" style="border:2px dashed var(--border);cursor:pointer" :class="dragging?'ring-2 ring-indigo-400':''">
        <div class="text-4xl mb-2">📊</div>
        <p>{{ t('drop-or-click') }}</p>
        <input ref="fileInput" type="file" accept=".xlsx,.xls,.csv" class="hidden" @change="onSelect">
      </div>

      <div v-if="result" class="pt-3 border-t space-y-3" style="border-color:var(--border)">
        <div class="flex items-center gap-2">
          <button @click="copy" class="btn-secondary">📋 {{ t('copy') }}</button>
          <button @click="download" class="btn-secondary">⬇️ {{ t('download') }}</button>
          <span class="text-xs" style="color:var(--text-secondary)">{{ rows }} × {{ cols }}</span>
        </div>
        <textarea :value="result" rows="10" readonly class="tool-input w-full font-mono text-xs"></textarea>
      </div>
      <div v-if="err" class="text-sm text-red-500">{{ err }}</div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { t } from '../../i18n'

const result = ref('')
const rows = ref(0)
const cols = ref(0)
const dragging = ref(false)
const err = ref('')

function escapeCell(v) {
  return String(v ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ').trim()
}

async function onSelect(e) {
  const f = e.target.files[0]
  if (!f) return
  err.value = ''
  try {
    const XLSX = await import('xlsx')
    const wb = XLSX.read(await f.arrayBuffer(), { type: 'array' })
    const ws = wb.Sheets[wb.SheetNames[0]]
    const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })
    if (!data.length) return
    const lines = []
    const header = data[0].map(escapeCell)
    lines.push('| ' + header.join(' | ') + ' |')
    lines.push('| ' + header.map(() => '---').join(' | ') + ' |')
    for (let i = 1; i < data.length; i++) {
      lines.push('| ' + data[i].map(escapeCell).join(' | ') + ' |')
    }
    result.value = lines.join('\n')
    cols.value = header.length
    rows.value = data.length - 1
  } catch { err.value = t('excel-merge-error') }
}
function onDrop(e) { dragging.value = false; if (e.dataTransfer.files[0]) onSelect({ target: { files: e.dataTransfer.files } }) }
function copy() { navigator.clipboard.writeText(result.value); window.showToast?.(t('copied')) }
function download() {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([result.value], { type: 'text/markdown' }))
  a.download = 'table.md'
  a.click()
}
</script>