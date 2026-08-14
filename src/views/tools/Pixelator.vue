<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🔲 {{ t('pixelator') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('pixelator-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="card p-6 text-center" @click="$refs.fileInput.click()" @dragover.prevent="dragging=true" @dragleave="dragging=false" @drop.prevent="onDrop" style="border:2px dashed var(--border);cursor:pointer" :class="dragging?'ring-2 ring-indigo-400':''">
        <div class="text-4xl mb-2">🖼️</div>
        <p>{{ t('drop-or-click') }}</p>
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onSelect">
      </div>

      <div v-if="img" class="pt-3 border-t space-y-4" style="border-color:var(--border)">
        <div class="flex items-center gap-3">
          <label class="text-sm font-medium w-32" style="color:var(--text-secondary)">{{ t('pixel-size') }}</label>
          <input v-model.number="block" type="range" min="4" max="64" class="flex-1" @input="pixelate">
          <span class="text-sm w-8 text-right font-mono">{{ block }}</span>
        </div>
        <div class="flex gap-4 items-start">
          <img :src="img.src" class="w-48 h-48 object-contain rounded" style="border:1px solid var(--border)">
          <canvas ref="canvas" class="w-48 h-48 object-contain rounded" style="border:1px solid var(--border)"></canvas>
        </div>
        <button @click="download" class="btn-primary">⬇️ {{ t('export-png') }}</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { t } from '../../i18n'

const img = ref(null)
const block = ref(16)
const canvas = ref(null)

function onSelect(e) {
  const f = e.target.files[0]
  if (!f) return
  const reader = new FileReader()
  reader.onload = () => {
    const im = new Image()
    im.onload = () => { img.value = im; pixelate() }
    im.src = reader.result
  }
  reader.readAsDataURL(f)
}
function onDrop(e) { dragging.value = false; if (e.dataTransfer.files[0]) onSelect({ target: { files: e.dataTransfer.files } }) }
const dragging = ref(false)

function pixelate() {
  if (!img.value) return
  const cv = canvas.value
  const n = block.value
  const sw = Math.max(1, Math.round(img.value.naturalWidth / n))
  const sh = Math.max(1, Math.round(img.value.naturalHeight / n))
  cv.width = img.value.naturalWidth
  cv.height = img.value.naturalHeight
  {
    const small = document.createElement('canvas')
    small.width = sw
    small.height = sh
    small.getContext('2d').drawImage(img.value, 0, 0, sw, sh)
    cv.getContext('2d').imageSmoothingEnabled = false
    cv.getContext('2d').drawImage(small, 0, 0, cv.width, cv.height)
  }
}
function download() {
  const a = document.createElement('a')
  a.href = canvas.value.toDataURL('image/png')
  a.download = 'pixelated.png'
  a.click()
}
</script>