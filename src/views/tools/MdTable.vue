<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">📊 {{ t('md-table-title') }}</h1>
    <p class="mb-6" style="color: var(--text-secondary);">{{ t('md-table-desc') }}</p>

    <div class="space-y-4">
      <div class="flex gap-3 flex-wrap items-center">
        <div class="flex items-center gap-2">
          <label class="text-xs" style="color: var(--text-secondary);">{{ t('rows') }}</label>
          <input v-model.number="rowCount" type="number" min="1" max="50" class="tool-input w-20 text-sm text-center" @change="syncRows">
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs" style="color: var(--text-secondary);">{{ t('cols') }}</label>
          <input v-model.number="colCount" type="number" min="1" max="20" class="tool-input w-20 text-sm text-center" @change="syncCols">
        </div>
        <button @click="addCol" class="btn-secondary text-sm">+ {{ t('table-col') }}</button>
        <button @click="addRow" class="btn-secondary text-sm">+ {{ t('table-row') }}</button>
        <button @click="reset" class="btn-secondary text-sm">{{ t('reset') }}</button>
      </div>

      <div class="card p-4 overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th v-for="(_, j) in cols" :key="'h' + j" class="p-1">
                <input
                  v-model="cols[j]"
                  class="tool-input text-sm text-center font-bold"
                  :placeholder="t('table-col-name') + ' ' + (j + 1)"
                >
              </th>
              <th class="w-10"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in rows" :key="'r' + i">
              <td v-for="(_, j) in cols" :key="'c' + j" class="p-1">
                <input
                  v-model="rows[i][j]"
                  class="tool-input text-sm text-center"
                  placeholder="-"
                >
              </td>
              <td class="text-center">
                <button @click="removeRow(i)" class="text-sm" style="color: var(--text-secondary);">✕</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex gap-3">
        <button @click="generate" class="btn-primary">📊 {{ t('table-generate') }}</button>
        <button @click="copy" class="btn-secondary" :disabled="!output">📋 {{ t('copy') }}</button>
      </div>

      <div v-if="output" class="space-y-4">
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm font-medium mb-2" style="color: var(--text-secondary);">{{ t('edit') }}</p>
            <div class="relative">
              <pre class="card font-mono text-xs p-4 overflow-auto max-h-64 whitespace-pre-wrap" style="color: var(--text); background: var(--card-bg);">{{ output }}</pre>
              <button @click="copy" class="absolute top-2 right-2 btn-secondary text-xs">📋</button>
            </div>
          </div>
          <div>
            <p class="text-sm font-medium mb-2" style="color: var(--text-secondary);">{{ t('preview') }}</p>
            <div class="card p-4 overflow-auto max-h-64" v-html="previewHtml"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'

const colCount = ref(3)
const rowCount = ref(3)
const cols = ref(['Name', 'Age', 'City'])
const rows = ref([
  ['Alice', '25', 'Beijing'],
  ['Bob', '30', 'Shanghai'],
  ['Charlie', '35', 'Shenzhen']
])
const output = ref('')

function syncRows() {
  const n = Math.max(1, Math.min(50, rowCount.value))
  while (rows.value.length < n) {
    rows.value.push(cols.value.map(() => ''))
  }
  if (rows.value.length > n) {
    rows.value = rows.value.slice(0, n)
  }
}

function syncCols() {
  const n = Math.max(1, Math.min(20, colCount.value))
  while (cols.value.length < n) {
    cols.value.push('Col ' + (cols.value.length + 1))
  }
  if (cols.value.length > n) {
    cols.value = cols.value.slice(0, n)
    rows.value = rows.value.map(r => r.slice(0, n))
  }
}

function addCol() {
  cols.value.push('Col ' + (cols.value.length + 1))
  colCount.value = cols.value.length
  rows.value.forEach(r => r.push(''))
}

function addRow() {
  rows.value.push(cols.value.map(() => ''))
  rowCount.value = rows.value.length
}

function removeRow(i) {
  rows.value.splice(i, 1)
  rowCount.value = rows.value.length
}

function generate() {
  if (!cols.value.length) return
  const header = '| ' + cols.value.join(' | ') + ' |'
  const separator = '| ' + cols.value.map(() => '---').join(' | ') + ' |'
  const body = rows.value.map(r => '| ' + r.join(' | ') + ' |').join('\n')
  output.value = header + '\n' + separator + '\n' + body
  window.showToast?.('OK')
}

function copy() {
  navigator.clipboard.writeText(output.value)
  window.showToast?.(t('copied'))
}

function reset() {
  colCount.value = 3
  rowCount.value = 3
  cols.value = ['Name', 'Age', 'City']
  rows.value = [
    ['Alice', '25', 'Beijing'],
    ['Bob', '30', 'Shanghai'],
    ['Charlie', '35', 'Shenzhen']
  ]
  output.value = ''
}

const previewHtml = computed(() => {
  if (!output.value) return ''
  const lines = output.value.split('\n')
  if (lines.length < 2) return ''

  const parseRow = (line) => {
    return line
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map(c => c.trim())
  }

  const headers = parseRow(lines[0])
  const dataRows = lines.slice(2).map(parseRow)

  let html = '<table style="width:100%;border-collapse:collapse;font-size:0.875rem;">'
  html += '<thead><tr>'
  headers.forEach(h => {
    html += '<th style="padding:6px 12px;border:1px solid var(--border);text-align:left;font-weight:600;background:var(--bg);">' + h + '</th>'
  })
  html += '</tr></thead><tbody>'
  dataRows.forEach(row => {
    html += '<tr>'
    row.forEach(cell => {
      html += '<td style="padding:6px 12px;border:1px solid var(--border);">' + cell + '</td>'
    })
    html += '</tr>'
  })
  html += '</tbody></table>'
  return html
})
</script>
