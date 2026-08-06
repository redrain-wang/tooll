<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">📑 {{ t('pdf-info') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('pdf-info-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="card p-6 text-center" @click="$refs.fileInput.click()" @dragover.prevent="dragging=true" @dragleave="dragging=false" @drop.prevent="onDrop" style="border:2px dashed var(--border);cursor:pointer" :class="dragging?'ring-2 ring-indigo-400':''">
        <div class="text-4xl mb-2">📑</div>
        <p>{{ t('drop-or-click') }}</p>
        <input ref="fileInput" type="file" accept="application/pdf" class="hidden" @change="onSelect">
      </div>

      <div v-if="info" class="pt-3 border-t grid grid-cols-3 gap-3" style="border-color:var(--border)">
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('total-pages') }}</div>
          <div class="text-lg font-bold text-indigo-600">{{ info.pages }}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('file-size') }}</div>
          <div class="text-lg font-bold" style="color:var(--text)">{{ info.size }}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('encrypted') }}</div>
          <div class="text-lg font-bold" style="color:var(--text)">{{ info.encrypted ? t('yes') : t('no') }}</div>
        </div>
        <div v-if="info.title || info.author" class="card p-3 col-span-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('metadata') }}</div>
          <div class="font-medium text-sm" style="color:var(--text)">
            {{ info.title || '—' }}<span v-if="info.author"> · {{ info.author }}</span>
          </div>
        </div>
      </div>
      <div v-if="err" class="text-sm text-red-500">{{ err }}</div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { PDFDocument } from 'pdf-lib'
import { t } from '../../i18n'

const info = ref(null)
const dragging = ref(false)
const err = ref('')

async function onSelect(e) {
  const f = e.target.files[0]
  if (!f) return
  err.value = ''
  try {
    const pdf = await PDFDocument.load(await f.arrayBuffer())
    const kb = f.size / 1024
    info.value = {
      pages: pdf.getPageCount(),
      size: kb >= 1024 ? (kb / 1024).toFixed(2) + ' MB' : kb.toFixed(1) + ' KB',
      encrypted: pdf.isEncrypted,
      title: pdf.getTitle() || '',
      author: pdf.getAuthor() || '',
    }
  } catch { err.value = t('pdf-split-error') }
}
function onDrop(e) { dragging.value = false; if (e.dataTransfer.files[0]) onSelect({ target: { files: e.dataTransfer.files } }) }
</script>