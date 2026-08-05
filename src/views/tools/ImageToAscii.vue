<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🖼️ {{ t('image-to-ascii') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('image-to-ascii-desc') }}</p>

    <div class="card p-6 text-center" @click="$refs.fileInput.click()" @dragover.prevent="dragging=true" @dragleave="dragging=false" @drop.prevent="onDrop" style="border:2px dashed var(--border);cursor:pointer" :class="dragging?'ring-2 ring-indigo-400':''">
      <div class="text-4xl mb-2">🖼️</div>
      <p>{{ t('drop-or-click') }}</p>
      <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onSelect">
    </div>

    <div v-if="img" class="mt-4 space-y-4">
      <div class="flex items-center gap-3 flex-wrap">
        <label class="text-sm" style="color:var(--text-secondary)">{{ t('width') }}</label>
        <input type="range" min="40" max="160" v-model.number="width" @input="convert" class="flex-1 max-w-48">
        <span class="text-sm">{{ width }}</span>
        <select v-model="charset" @change="convert" class="tool-input" style="width:auto">
          <option value="dense">⿊ ▓▒░</option>
          <option value="standard">@%#*+=-:. </option>
          <option value="light">@*#+=-:. </option>
        </select>
        <button @click="copy" class="btn-secondary">📋 {{ t('copy') }}</button>
        <button @click="downloadTxt" class="btn-secondary">⬇️ TXT</button>
      </div>
      <pre class="tool-input overflow-auto font-mono leading-[1.1] text-[6px] md:text-[8px]" style="white-space:pre-wrap;min-height:200px">{{ ascii }}</pre>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { t } from '../../i18n'

const img = ref(null)
const width = ref(80)
const charset = ref('dense')
const ascii = ref('')
const dragging = ref(false)

const sets = {
  dense: ' .`^\",:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',
  standard: ' .:-=+*#%@',
  light: ' .:-=+*#%@',
}

function onSelect(e) { const f = e.target.files[0]; f && load(f) }
function onDrop(e) { dragging.value = false; const f = e.dataTransfer.files[0]; f && load(f) }

function load(f) {
  const reader = new FileReader()
  reader.onload = () => {
    const im = new Image()
    im.onload = () => { img.value = im; convert() }
    im.src = reader.result
  }
  reader.readAsDataURL(f)
}

function convert() {
  if (!img.value) return
  const im = img.value
  const scale = width.value / im.naturalWidth
  const h = Math.round(im.naturalHeight * scale * 0.5)
  const canvas = document.createElement('canvas')
  canvas.width = width.value
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.drawImage(im, 0, 0, width.value, h)
  const data = ctx.getImageData(0, 0, width.value, h).data
  let s = ''
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < width.value; x++) {
      const i = (y * width.value + x) * 4
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
      const brightness = 255 - gray
      const chars = sets[charset.value]
      const idx = Math.floor((brightness / 255) * (chars.length - 1))
      s += chars[idx]
    }
    s += '\n'
  }
  ascii.value = s
}
function copy() { navigator.clipboard.writeText(ascii.value); window.showToast?.(t('copied')) }
function downloadTxt() {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([ascii.value], { type: 'text/plain' }))
  a.download = 'ascii-art.txt'
  a.click()
}
</script>