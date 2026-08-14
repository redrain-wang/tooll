<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🧮 {{ t('formula-to-value') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('formula-to-value-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="card p-6 text-center" @click="$refs.fileInput.click()" @dragover.prevent="dragging=true" @dragleave="dragging=false" @drop.prevent="onDrop" style="border:2px dashed var(--border);cursor:pointer" :class="dragging?'ring-2 ring-indigo-400':''">
        <div class="text-4xl mb-2">📗</div>
        <p>{{ t('drop-or-click') }}</p>
        <input ref="fileInput" type="file" accept=".xlsx,.xls" class="hidden" @change="onSelect">
      </div>

      <div v-if="formulaCount" class="pt-3 border-t space-y-3" style="border-color:var(--border)">
        <div class="text-sm" style="color:var(--text-secondary)">{{ t('formula-found') }}: <b>{{ formulaCount }}</b></div>
        <button @click="convert" class="btn-primary" :disabled="busy">🧮 {{ t('convert-formula') }}</button>
        <div v-if="err" class="text-sm text-red-500">{{ err }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { t } from '../../i18n'

const file = ref(null)
const formulaCount = ref(0)
const busy = ref(false)
const err = ref('')
const dragging = ref(false)

async function onSelect(e) {
  const f = e.target.files[0]
  if (!f) return
  file.value = f
  const XLSX = await import('xlsx')
  const wb = XLSX.read(await f.arrayBuffer(), { type: 'array' })
  let count = 0
  for (const ws of Object.values(wb.Sheets)) {
    for (const cell of Object.values(ws)) {
      if (cell && cell.f) count++
    }
  }
  formulaCount.value = count
}
function onDrop(e) { dragging.value = false; if (e.dataTransfer.files[0]) onSelect({ target: { files: e.dataTransfer.files } }) }

async function convert() {
  busy.value = true
  err.value = ''
  try {
    const XLSX = await import('xlsx')
    const wb = XLSX.read(await file.value.arrayBuffer(), { type: 'array', cellFormula: true, cellNF: true })
    wb.bookType = 'xlsx'
    for (const ws of Object.values(wb.Sheets)) {
      for (const addr of Object.keys(ws)) {
        const cell = ws[addr]
        if (cell && cell.f) delete cell.f
      }
    }
    XLSX.writeFile(wb, file.value.name.replace(/\.[^.]+$/, '') + '_values.xlsx')
  } catch { err.value = t('excel-merge-error') }
  busy.value = false
}
</script>