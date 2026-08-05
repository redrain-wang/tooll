<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">✂️ {{ t('pdf-split') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('pdf-split-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="card p-6 text-center" @click="$refs.fileInput.click()" @dragover.prevent="dragging=true" @dragleave="dragging=false" @drop.prevent="onDrop" style="border:2px dashed var(--border);cursor:pointer" :class="dragging?'ring-2 ring-indigo-400':''">
        <div class="text-4xl mb-2">✂️</div>
        <p>{{ t('drop-or-click') }}</p>
        <input ref="fileInput" type="file" accept="application/pdf" class="hidden" @change="onSelect">
      </div>

      <div v-if="pages > 0" class="pt-3 border-t" style="border-color:var(--border)">
        <div class="text-sm mb-2" style="color:var(--text-secondary)">{{ t('total-pages') }}: <b>{{ pages }}</b></div>
        <div class="flex items-center gap-3">
          <label class="text-sm font-medium w-28" style="color:var(--text-secondary)">{{ t('page-range') }}</label>
          <input v-model.trim="range" class="tool-input flex-1 font-mono" placeholder="1-5, 8, 10-12">
        </div>
        <div class="text-xs mt-1" style="color:var(--text-secondary)">{{ t('page-range-hint') }}</div>
        <button @click="split" class="btn-primary mt-3" :disabled="busy">✂️ {{ t('split-pdf') }}</button>
        <div v-if="err" class="text-sm text-red-500 mt-2">{{ err }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { PDFDocument } from 'pdf-lib'
import { t } from '../../i18n'

const pages = ref(0)
const range = ref('')
const dragging = ref(false)
const busy = ref(false)
const err = ref('')
let file = null

async function onSelect(e) {
  file = e.target.files[0]
  if (!file) return
  const pdf = await PDFDocument.load(await file.arrayBuffer())
  pages.value = pdf.getPageCount()
  err.value = ''
}
function onDrop(e) { dragging.value = false; if (e.dataTransfer.files[0]) { const t = { target: { files: e.dataTransfer.files } }; onSelect(t) } }

function parseRange(s) {
  const set = new Set()
  for (const part of s.split(',')) {
    const m = part.match(/^\s*(\d+)\s*-\s*(\d+)\s*$/)
    if (m) { for (let i = +m[1]; i <= +m[2]; i++) set.add(i) }
    else if (/^\s*\d+\s*$/.test(part)) set.add(+part.trim())
  }
  return [...set].filter(p => p >= 1 && p <= pages.value).sort((a, b) => a - b)
}

async function split() {
  busy.value = true
  err.value = ''
  try {
    const idx = parseRange(range.value)
    if (!idx.length) { err.value = t('page-range-invalid'); busy.value = false; return }
    const pdf = await PDFDocument.load(await file.arrayBuffer())
    const out = await PDFDocument.create()
    for (const i of idx) out.addPage(await out.copyPages(pdf, [i - 1]).then(ps => ps[0]))
    const bytes = await out.save()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }))
    a.download = 'split.pdf'
    a.click()
  } catch { err.value = t('pdf-split-error') }
  busy.value = false
}
</script>