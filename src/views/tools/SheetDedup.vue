<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🧹 {{ t('sheet-dedup') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('sheet-dedup-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="card p-6 text-center" @click="$refs.fileInput.click()" @dragover.prevent="dragging=true" @dragleave="dragging=false" @drop.prevent="onDrop" style="border:2px dashed var(--border);cursor:pointer" :class="dragging?'ring-2 ring-indigo-400':''">
        <div class="text-4xl mb-2">📗</div>
        <p>{{ t('drop-or-click') }}</p>
        <input ref="fileInput" type="file" accept=".xlsx,.xls,.csv" class="hidden" @change="onSelect">
      </div>

      <div v-if="columns.length" class="pt-3 border-t space-y-4" style="border-color:var(--border)">
        <div class="flex items-center gap-3">
          <label class="text-sm font-medium w-28" style="color:var(--text-secondary)">{{ t('dedup-column') }}</label>
          <select v-model="column" class="tool-input flex-1">
            <option v-for="(c, i) in columns" :key="i" :value="i">{{ c }}</option>
          </select>
        </div>
        <div class="text-sm" style="color:var(--text-secondary)">
          {{ t('total-rows') }}: <b>{{ rows.length }}</b> → {{ t('after-dedup') }}: <b>{{ deduped.length }}</b>
          ({{ t('removed-rows') }}: {{ rows.length - deduped.length }})
        </div>
        <button @click="download" class="btn-primary" :disabled="busy">⬇️ {{ t('download-result') }}</button>
        <div v-if="err" class="text-sm text-red-500">{{ err }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'

const rows = ref([])
const columns = ref([])
const column = ref(0)
const dragging = ref(false)
const busy = ref(false)
const err = ref('')
const fileName = ref('')

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
    columns.value = data[0]
    rows.value = data.slice(1).filter(r => r.some(c => c !== ''))
    column.value = 0
    fileName.value = f.name
  } catch { err.value = t('excel-merge-error') }
}
function onDrop(e) { dragging.value = false; if (e.dataTransfer.files[0]) { const t = { target: { files: e.dataTransfer.files } }; onSelect(t) } }

const deduped = computed(() => {
  const seen = new Set()
  return rows.value.filter(r => {
    const k = String(r[column.value]).trim()
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
})

async function download() {
  busy.value = true
  try {
    const XLSX = await import('xlsx')
    const ws = XLSX.utils.aoa_to_sheet([columns.value, ...deduped.value])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'deduped')
    XLSX.writeFile(wb, fileName.value.replace(/\.[^.]+$/, '') + '_dedup.xlsx')
  } catch { err.value = t('excel-merge-error') }
  busy.value = false
}
</script>