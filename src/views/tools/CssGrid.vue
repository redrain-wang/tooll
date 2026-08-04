<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('css-grid-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('css-grid-desc') }}</p>

    <div class="space-y-6">
      <div class="grid md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="card p-4">
            <h3 class="text-sm font-semibold mb-3" style="color:var(--text)">{{ t('css-grid-container') }}</h3>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs block mb-1" style="color:var(--text-secondary)">{{ t('css-grid-rows') }}</label>
                <div class="flex gap-2">
                  <input v-model.number="gridRows" type="number" min="1" max="20" class="tool-input flex-1">
                  <select v-model="gridRowUnit" class="tool-input w-20">
                    <option value="fr">fr</option>
                    <option value="px">px</option>
                    <option value="%">%</option>
                    <option value="auto">auto</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="text-xs block mb-1" style="color:var(--text-secondary)">{{ t('css-grid-cols') }}</label>
                <div class="flex gap-2">
                  <input v-model.number="gridCols" type="number" min="1" max="20" class="tool-input flex-1">
                  <select v-model="gridColUnit" class="tool-input w-20">
                    <option value="fr">fr</option>
                    <option value="px">px</option>
                    <option value="%">%</option>
                    <option value="auto">auto</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label class="text-xs block mb-1" style="color:var(--text-secondary)">{{ t('css-grid-row-gap') }}</label>
                <input v-model="rowGap" type="text" class="tool-input" placeholder="10px">
              </div>
              <div>
                <label class="text-xs block mb-1" style="color:var(--text-secondary)">{{ t('css-grid-col-gap') }}</label>
                <input v-model="colGap" type="text" class="tool-input" placeholder="10px">
              </div>
            </div>
          </div>

          <div class="card p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-semibold" style="color:var(--text)">{{ t('css-grid-items') }}</h3>
              <button @click="addItem" class="btn-secondary text-xs">+ {{ t('css-grid-add-item') }}</button>
            </div>
            <div class="space-y-2 max-h-48 overflow-y-auto">
              <div v-for="(item, i) in items" :key="i" class="flex items-center gap-2 p-2 rounded" style="background:var(--bg)">
                <span class="text-xs font-mono w-6" style="color:var(--primary)">{{ item.label }}</span>
                <div class="flex gap-1 flex-1">
                  <div class="flex items-center gap-1">
                    <span class="text-xs" style="color:var(--text-secondary)">col</span>
                    <input v-model.number="item.colStart" type="number" min="1" :max="gridCols + 1" class="tool-input w-12 text-xs text-center">
                    <span class="text-xs" style="color:var(--text-secondary)">-</span>
                    <input v-model.number="item.colEnd" type="number" min="1" :max="gridCols + 1" class="tool-input w-12 text-xs text-center">
                  </div>
                  <div class="flex items-center gap-1">
                    <span class="text-xs" style="color:var(--text-secondary)">row</span>
                    <input v-model.number="item.rowStart" type="number" min="1" :max="gridRows + 1" class="tool-input w-12 text-xs text-center">
                    <span class="text-xs" style="color:var(--text-secondary)">-</span>
                    <input v-model.number="item.rowEnd" type="number" min="1" :max="gridRows + 1" class="tool-input w-12 text-xs text-center">
                  </div>
                </div>
                <button @click="removeItem(i)" class="text-sm" style="color:var(--text-secondary)">✕</button>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div class="card p-4">
            <h3 class="text-sm font-semibold mb-3" style="color:var(--text)">{{ t('preview') }}</h3>
            <div class="grid-preview rounded-lg overflow-hidden" :style="previewContainerStyle">
              <div
                v-for="(item, i) in items"
                :key="i"
                class="grid-item rounded flex items-center justify-center text-xs font-bold"
                :style="getItemStyle(item)"
              >
                {{ item.label }}
              </div>
            </div>
          </div>

          <div class="card p-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-semibold" style="color:var(--text)">CSS</h3>
              <button @click="copy" class="btn-secondary text-xs">📋 {{ t('copy') }}</button>
            </div>
            <pre class="font-mono text-xs overflow-auto max-h-64 whitespace-pre-wrap p-3 rounded-lg" style="background:var(--bg);color:var(--primary)">{{ generatedCSS }}</pre>
          </div>

          <div class="flex gap-2">
            <button @click="reset" class="btn-secondary text-sm">{{ t('reset') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'

const gridRows = ref(3)
const gridCols = ref(3)
const gridRowUnit = ref('fr')
const gridColUnit = ref('fr')
const rowGap = ref('10px')
const colGap = ref('10px')

const colors = [
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#f97316', '#eab308',
  '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6'
]

const items = ref([
  { label: 'A', colStart: 1, colEnd: 2, rowStart: 1, rowEnd: 2 },
  { label: 'B', colStart: 2, colEnd: 4, rowStart: 1, rowEnd: 2 },
  { label: 'C', colStart: 1, colEnd: 2, rowStart: 2, rowEnd: 4 },
  { label: 'D', colStart: 2, colEnd: 3, rowStart: 2, rowEnd: 3 },
  { label: 'E', colStart: 3, colEnd: 4, rowStart: 2, rowEnd: 4 },
  { label: 'F', colStart: 2, colEnd: 3, rowStart: 3, rowEnd: 4 }
])

let nextLabel = 7

function addItem() {
  const label = String.fromCharCode(64 + nextLabel++)
  if (nextLabel > 36) nextLabel = 1
  items.value.push({
    label,
    colStart: 1,
    colEnd: Math.min(2, gridCols.value + 1),
    rowStart: 1,
    rowEnd: Math.min(2, gridRows.value + 1)
  })
}

function removeItem(i) {
  items.value.splice(i, 1)
}

const previewContainerStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${gridCols.value}, ${gridColUnit.value})`,
  gridTemplateRows: `repeat(${gridRows.value}, ${gridRowUnit.value})`,
  gap: `${rowGap.value} ${colGap.value}`,
  background: 'var(--border)',
  padding: '2px',
  minHeight: '200px'
}))

function getItemStyle(item) {
  const idx = items.value.indexOf(item)
  return {
    gridColumn: `${item.colStart} / ${item.colEnd}`,
    gridRow: `${item.rowStart} / ${item.rowEnd}`,
    background: colors[idx % colors.length],
    color: '#fff',
    minHeight: '40px'
  }
}

const generatedCSS = computed(() => {
  const trackRows = `repeat(${gridRows.value}, ${gridRowUnit.value})`
  const trackCols = `repeat(${gridCols.value}, ${gridColUnit.value})`

  let css = `.container {\n`
  css += `  display: grid;\n`
  css += `  grid-template-columns: ${trackCols};\n`
  css += `  grid-template-rows: ${trackRows};\n`
  if (rowGap.value === colGap.value) {
    css += `  gap: ${rowGap.value};\n`
  } else {
    css += `  row-gap: ${rowGap.value};\n`
    css += `  column-gap: ${colGap.value};\n`
  }
  css += `}\n`

  items.value.forEach((item) => {
    css += `\n.${item.label.toLowerCase()} {\n`
    css += `  grid-column: ${item.colStart} / ${item.colEnd};\n`
    css += `  grid-row: ${item.rowStart} / ${item.rowEnd};\n`
    css += `}`
  })

  return css
})

function copy() {
  navigator.clipboard.writeText(generatedCSS.value)
  window.showToast?.(t('copied'))
}

function reset() {
  gridRows.value = 3
  gridCols.value = 3
  gridRowUnit.value = 'fr'
  gridColUnit.value = 'fr'
  rowGap.value = '10px'
  colGap.value = '10px'
  items.value = [
    { label: 'A', colStart: 1, colEnd: 2, rowStart: 1, rowEnd: 2 },
    { label: 'B', colStart: 2, colEnd: 4, rowStart: 1, rowEnd: 2 },
    { label: 'C', colStart: 1, colEnd: 2, rowStart: 2, rowEnd: 4 },
    { label: 'D', colStart: 2, colEnd: 3, rowStart: 2, rowEnd: 3 },
    { label: 'E', colStart: 3, colEnd: 4, rowStart: 2, rowEnd: 4 },
    { label: 'F', colStart: 2, colEnd: 3, rowStart: 3, rowEnd: 4 }
  ]
  nextLabel = 7
}
</script>

<style scoped>
.tool-container {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
}

.card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.tool-input {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text);
  padding: 6px 10px;
  font-size: 0.875rem;
  outline: none;
}

.tool-input:focus {
  border-color: var(--primary);
}

.btn-primary,
.btn-secondary {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: var(--primary);
  color: #fff;
}

.btn-secondary {
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--text);
}

.btn-secondary:hover {
  opacity: 0.8;
}

.grid-preview {
  display: grid;
}

.grid-item {
  transition: all 0.15s ease;
}

.grid-item:hover {
  opacity: 0.85;
  transform: scale(1.02);
}
</style>
