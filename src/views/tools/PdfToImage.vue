<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🖨️ {{ t('pdf-to-image') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('pdf-to-image-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="card p-6 text-center" @click="$refs.fileInput.click()" @dragover.prevent="dragging=true" @dragleave="dragging=false" @drop.prevent="onDrop" style="border:2px dashed var(--border);cursor:pointer" :class="dragging?'ring-2 ring-indigo-400':''">
        <div class="text-4xl mb-2">🖨️</div>
        <p>{{ t('drop-or-click') }}</p>
        <input ref="fileInput" type="file" accept="application/pdf" class="hidden" @change="onSelect">
      </div>

      <div v-if="totalPages" class="pt-3 border-t space-y-4" style="border-color:var(--border)">
        <div class="text-sm" style="color:var(--text-secondary)">{{ t('total-pages') }}: <b>{{ totalPages }}</b></div>
        <div class="flex gap-2 flex-wrap">
          <div v-for="p in pageUrls" :key="p.page" class="card p-2 text-center w-36">
            <img :src="p.url" class="w-full rounded mb-1" style="border:1px solid var(--border)">
            <a :href="p.url" :download="'page-' + p.page + '.png'" class="btn-primary btn-sm">{{ t('download') }} {{ p.page }}</a>
          </div>
        </div>
        <button @click="downloadAll" class="btn-secondary">{{ t('download-all') }}</button>
        <div v-if="err" class="text-sm text-red-500">{{ err }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { t } from '../../i18n'

GlobalWorkerOptions.workerSrc = workerUrl
const file = ref(null)
const totalPages = ref(0)
const pageUrls = ref([])
const err = ref('')
const dragging = ref(false)

async function onSelect(e) {
  const f = e.target.files[0]
  if (!f) return
  file.value = f
  err.value = ''
  try {
    const pdf = await getDocument({ data: await f.arrayBuffer() }).promise
    totalPages.value = pdf.numPages
    const urls = []
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const viewport = page.getViewport({ scale: 2 })
      const canvas = document.createElement('canvas')
      canvas.width = viewport.width
      canvas.height = viewport.height
      const ctx = canvas.getContext('2d')
      await page.render({ canvasContext: ctx, viewport }).promise
      urls.push({ page: i, url: canvas.toDataURL('image/png') })
    }
    pageUrls.value = urls
  } catch { err.value = t('pdf-to-image-error') }
}
function onDrop(e) { dragging.value = false; if (e.dataTransfer.files[0]) onSelect({ target: { files: e.dataTransfer.files } }) }
function downloadAll() { pageUrls.value.forEach(p => { const a = document.createElement('a'); a.href = p.url; a.download = 'page-' + p.page + '.png'; a.click() }) }
</script>