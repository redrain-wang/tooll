<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">📗 {{ t('excel-merge') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('excel-merge-desc') }}</p>

    <div class="card p-6 text-center" @click="$refs.fileInput.click()" @dragover.prevent="dragging=true" @dragleave="dragging=false" @drop.prevent="onDrop" style="border:2px dashed var(--border);cursor:pointer" :class="dragging?'ring-2 ring-indigo-400':''">
      <div class="text-4xl mb-2">📗</div>
      <p>{{ t('drop-or-click') }}</p>
      <p class="text-sm mt-1" style="color:var(--text-secondary)">{{ t('excel-merge-hint') }}</p>
      <input ref="fileInput" type="file" accept=".xlsx,.xls,.csv" multiple class="hidden" @change="onSelect">
    </div>

    <div v-if="files.length" class="mt-4 space-y-3">
      <div class="flex flex-wrap gap-2">
        <span v-for="(f, i) in files" :key="i" class="card px-3 py-1 text-sm inline-flex items-center gap-2">
          {{ f.name }}
          <button @click="remove(i)" class="text-red-500 font-bold">×</button>
        </span>
      </div>
      <button @click="merge" class="btn-primary" :disabled="busy">📗 {{ t('merge-excel') }}</button>
      <div v-if="err" class="text-sm text-red-500">{{ err }}</div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { t } from '../../i18n'

const files = ref([])
const dragging = ref(false)
const busy = ref(false)
const err = ref('')

function onSelect(e) { files.value.push(...e.target.files) }
function onDrop(e) { dragging.value = false; files.value.push(...e.dataTransfer.files) }
function remove(i) { files.value.splice(i, 1) }

async function merge() {
  busy.value = true
  err.value = ''
  try {
    const XLSX = await import('xlsx')
    const out = XLSX.utils.book_new()
    for (const f of files.value) {
      const wb = XLSX.read(await f.arrayBuffer(), { type: 'array' })
      for (const name of wb.SheetNames) {
        const ws = wb.Sheets[name]
        if (out.Sheets[name]) {
          const base = name, uniq = `${base}_${Object.keys(out.Sheets).length + 1}`
          XLSX.utils.book_append_sheet(out, ws, uniq)
        } else {
          XLSX.utils.book_append_sheet(out, ws, name)
        }
      }
    }
    XLSX.writeFile(out, 'merged.xlsx')
  } catch { err.value = t('excel-merge-error') }
  busy.value = false
}
</script>