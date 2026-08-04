<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">📊 {{ t('json-excel-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('json-excel-desc') }}</p>
    <div class="space-y-4">
      <!-- JSON to Excel -->
      <div class="card">
        <h3 class="font-semibold mb-3" style="color:var(--primary)">📥 JSON → Excel</h3>
        <textarea v-model="jsonInput" class="tool-input h-40 font-mono text-sm" placeholder='[{"name":"Alice","age":25},{"name":"Bob","age":30}]'></textarea>
        <div class="flex gap-3 mt-3 flex-wrap">
          <input v-model="sheetName" class="tool-input w-40" :placeholder="t('json-excel-sheet-hint')">
          <button @click="jsonToExcel" class="btn-primary">📥 {{ t('json-excel-download') }}</button>
        </div>
      </div>
      <!-- Excel to JSON -->
      <div class="card">
        <h3 class="font-semibold mb-3" style="color:var(--primary)">📤 Excel → JSON</h3>
        <input type="file" ref="fileInput" accept=".xlsx,.xls" class="hidden" @change="handleFile">
        <button @click="$refs.fileInput.click()" class="btn-secondary w-full mb-3">📁 {{ t('json-excel-select-file') }}</button>
        <div v-if="preview.length" class="space-y-2">
          <p class="text-sm" style="color:var(--text-secondary)">{{ t('json-excel-preview') }}</p>
          <pre class="font-mono text-xs max-h-48 overflow-auto p-3 rounded" style="background:var(--bg);color:var(--text)">{{ preview }}</pre>
          <div class="flex gap-3">
            <input v-model="excelSheetName" class="tool-input w-40" :placeholder="t('json-excel-sheet-name')">
            <button @click="excelToJson" class="btn-primary">📋 {{ t('json-excel-to-json') }}</button>
            <button @click="downloadJson" class="btn-secondary">💾 {{ t('json-excel-download-json') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'; import { t } from '../../i18n'
const jsonInput = ref(''); const sheetName = ref('Sheet1')
const preview = ref(''); const excelSheetName = ref(''); const workbook = ref(null)
async function jsonToExcel() {
  try {
    const data = JSON.parse(jsonInput.value)
    if (!Array.isArray(data)) throw new Error(t('json-excel-must-array'))
    const XLSX = await import('xlsx')
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, sheetName.value || 'Sheet1')
    XLSX.writeFile(wb, 'data.xlsx')
    window.showToast?.('OK')
  } catch (e) { window.showToast?.(t('json-excel-error') + ': ' + e.message) }
}
function handleFile(e) {
  const file = e.target.files[0]; if (!file) return
  const reader = new FileReader()
  reader.onload = async (ev) => {
    const XLSX = await import('xlsx')
    workbook.value = XLSX.read(new Uint8Array(ev.target.result), { type: 'array' })
    const sheet = excelSheetName.value || workbook.value.SheetNames[0]
    const ws = workbook.value.Sheets[sheet]
    const json = XLSX.utils.sheet_to_json(ws, { header: 1 })
    preview.value = JSON.stringify(json.slice(0, 5), null, 2)
    window.showToast?.(t('json-excel-loaded') + ': ' + workbook.value.SheetNames.join(', '))
  }
  reader.readAsArrayBuffer(file)
}
async function excelToJson() {
  if (!workbook.value) return
  try {
    const XLSX = await import('xlsx')
    const sheet = excelSheetName.value || workbook.value.SheetNames[0]
    const ws = workbook.value.Sheets[sheet]
    const json = XLSX.utils.sheet_to_json(ws)
    navigator.clipboard.writeText(JSON.stringify(json, null, 2))
    window.showToast?.(t('copied') + ' ' + json.length + ' ' + t('json-excel-rows'))
  } catch (e) { window.showToast?.(t('json-excel-error') + ': ' + e.message) }
}
async function downloadJson() {
  if (!workbook.value) return
  try {
    const XLSX = await import('xlsx')
    const sheet = excelSheetName.value || workbook.value.SheetNames[0]
    const ws = workbook.value.Sheets[sheet]
    const json = XLSX.utils.sheet_to_json(ws)
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'data.json'; a.click()
  } catch (e) { window.showToast?.(t('json-excel-error') + ': ' + e.message) }
}
</script>
