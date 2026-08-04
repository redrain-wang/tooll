<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🔄 {{ t('image-format-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('image-format-desc') }}</p>
    <div class="space-y-4">
      <div class="card text-center" style="border:2px dashed var(--border)" @dragover.prevent="dragging=true" @dragleave="dragging=false" @drop.prevent="handleDrop" @click="$refs.fileInput.click()">
        <input ref="fileInput" type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/bmp" class="hidden" @change="handleFile">
        <p class="text-4xl mb-2">📁</p>
        <p style="color:var(--text-secondary)">{{ t('image-format-drop') }}</p>
      </div>

      <div v-if="original" class="card">
        <div class="flex items-center gap-4 mb-4">
          <img :src="original" class="max-h-40 rounded-lg mx-auto" style="max-width:100%">
        </div>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm mb-1" style="color:var(--text-secondary)">{{ t('image-format-output') }}</label>
            <select v-model="format" class="tool-input w-full">
              <option value="image/png">PNG</option>
              <option value="image/jpeg">JPG</option>
              <option value="image/webp">WebP</option>
            </select>
          </div>
          <div v-if="format !== 'image/png'">
            <label class="block text-sm mb-1" style="color:var(--text-secondary)">{{ t('image-format-quality') }}</label>
            <div class="flex items-center gap-2">
              <input type="range" v-model.number="quality" min="10" max="100" step="5" class="flex-1">
              <span class="text-sm font-mono w-10" style="color:var(--primary)">{{ quality }}%</span>
            </div>
          </div>
        </div>
        <button @click="convert" class="btn-primary w-full mb-3">🔄 {{ t('convert') }}</button>

        <div v-if="converted" class="space-y-3">
          <div class="grid grid-cols-2 gap-3 text-center">
            <div class="p-3 rounded-lg" style="background:var(--bg)">
              <p class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('image-format-original') }}</p>
              <p class="font-mono" style="color:var(--text)">{{ originalSize }}</p>
            </div>
            <div class="p-3 rounded-lg" style="background:var(--bg)">
              <p class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('image-format-converted') }}</p>
              <p class="font-mono" style="color:var(--primary)">{{ convertedSize }}</p>
            </div>
          </div>
          <div class="text-center">
            <span class="px-2 py-1 rounded text-xs font-medium" :style="{background: savings >= 0 ? '#dcfce7' : '#fee2e2', color: savings >= 0 ? '#16a34a' : '#dc2626'}">
              {{ savings >= 0 ? '-' : '+' }}{{ Math.abs(savings) }}%
            </span>
          </div>
          <img :src="converted" class="max-h-40 rounded-lg mx-auto" style="max-width:100%">
          <button @click="download" class="btn-secondary w-full">💾 {{ t('download') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { t } from '../../i18n'

const dragging = ref(false)
const original = ref('')
const converted = ref('')
const format = ref('image/png')
const quality = ref(80)
const originalSize = ref('')
const convertedSize = ref('')
const savings = ref(0)
const fileName = ref('')
let originalBytes = 0
let convertedBlob = null

function formatSize(b) {
  return b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : (b / 1024).toFixed(1) + ' KB'
}

function handleFile(e) {
  if (e.target.files[0]) processFile(e.target.files[0])
}

function handleDrop(e) {
  dragging.value = false
  const f = e.dataTransfer.files[0]
  if (f && f.type.startsWith('image/')) processFile(f)
}

function processFile(file) {
  fileName.value = file.name
  originalBytes = file.size
  originalSize.value = formatSize(file.size)
  converted.value = ''
  convertedSize.value = ''
  savings.value = 0
  convertedBlob = null
  const reader = new FileReader()
  reader.onload = (e) => { original.value = e.target.result }
  reader.readAsDataURL(file)
}

function convert() {
  if (!original.value) return
  const img = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')
    if (format.value === 'image/jpeg') {
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    ctx.drawImage(img, 0, 0)
    canvas.toBlob((blob) => {
      convertedBlob = blob
      convertedSize.value = formatSize(blob.size)
      savings.value = Math.round((1 - blob.size / originalBytes) * 100)
      converted.value = URL.createObjectURL(blob)
    }, format.value, quality.value / 100)
  }
  img.src = original.value
}

function download() {
  if (!convertedBlob) return
  const ext = format.value === 'image/png' ? '.png' : format.value === 'image/jpeg' ? '.jpg' : '.webp'
  const baseName = fileName.value.replace(/\.[^.]+$/, '')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(convertedBlob)
  a.download = baseName + ext
  a.click()
}
</script>
