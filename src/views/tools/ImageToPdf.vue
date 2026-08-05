<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">📄 {{ t('image-to-pdf') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('image-to-pdf-desc') }}</p>

    <div class="card p-6 text-center" @click="$refs.fileInput.click()" @dragover.prevent="dragging=true" @dragleave="dragging=false" @drop.prevent="onDrop" :class="dragging ? 'ring-2 ring-indigo-400' : ''" style="border:2px dashed var(--border);cursor:pointer">
      <div class="text-4xl mb-2">📤</div>
      <p>{{ t('drop-or-click') }}</p>
      <p class="text-sm mt-1" style="color:var(--text-secondary)">{{ t('image-to-pdf-hint') }}</p>
      <input ref="fileInput" type="file" accept="image/*" multiple class="hidden" @change="onSelect">
    </div>

    <div v-if="images.length" class="mt-4 space-y-3">
      <div class="flex gap-2">
        <button @click="mode = 'single'" class="px-4 py-2 rounded-lg text-sm font-medium" :style="mode === 'single' ? 'background:var(--primary);color:#fff' : 'background:var(--bg);color:var(--text-secondary)'">{{ t('mode-single-pdf') }}</button>
        <button @click="mode = 'multi'" class="px-4 py-2 rounded-lg text-sm font-medium" :style="mode === 'multi' ? 'background:var(--primary);color:#fff' : 'background:var(--bg);color:var(--text-secondary)'">{{ t('mode-multi-pdf') }}</button>
      </div>
      <div class="flex flex-wrap gap-3">
        <div v-for="(img, i) in images" :key="i" class="relative card p-2 w-28">
          <img :src="img.dataUrl" class="w-full h-24 object-contain rounded">
          <button @click="removeImage(i)" class="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs">×</button>
        </div>
      </div>
      <button @click="generatePdf" class="btn-primary" :disabled="busy">📄 {{ mode === 'single' ? t('generate-pdf') : t('generate-pdfs') }}</button>
      <div v-if="err" class="text-sm text-red-500">{{ err }}</div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { jsPDF } from 'jspdf'
import { t } from '../../i18n'

const images = ref([])
const dragging = ref(false)
const busy = ref(false)
const err = ref('')
const mode = ref('single')

async function load(file) {
  const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.onload = () => {
      const img = new Image()
      img.onload = () => resolve({ dataUrl: reader.result, w: img.naturalWidth, h: img.naturalHeight, name: file.name.replace(/\.[^.]+$/, '') })
      img.onerror = reject
      img.src = reader.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function addImageToPdf(pdf, img, first) {
  if (!first) pdf.addPage()
  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()
  const ratio = Math.min(pageW / img.w, pageH / img.h)
  const w = img.w * ratio, h = img.h * ratio
  const x = (pageW - w) / 2, y = (pageH - h) / 2
  pdf.addImage(img.dataUrl, 'PNG', x, y, w, h)
}

async function addFiles(fileList) {
  err.value = ''
  for (const f of fileList) {
    if (!f.type.startsWith('image/')) continue
    try { images.value.push(await load(f)) } catch { err.value = t('image-load-error') }
  }
}
function onSelect(e) { addFiles(e.target.files) }
function onDrop(e) { dragging.value = false; addFiles(e.dataTransfer.files) }
function removeImage(i) { images.value.splice(i, 1) }

async function generatePdf() {
  busy.value = true
  err.value = ''
  try {
    if (mode.value === 'single') {
      const pdf = new jsPDF('p', 'pt', 'a4')
      images.value.forEach((img, i) => addImageToPdf(pdf, img, i === 0))
      pdf.save('images.pdf')
    } else {
      for (const img of images.value) {
        const pdf = new jsPDF('p', 'pt', 'a4')
        addImageToPdf(pdf, img, true)
        pdf.save(`${img.name}.pdf`)
      }
    }
  } catch { err.value = t('pdf-error') }
  busy.value = false
}
</script>