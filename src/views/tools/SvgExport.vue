<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">📐 {{ t('svg-export-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('svg-export-desc') }}</p>
    <div class="space-y-4">
      <div class="card">
        <p class="font-medium mb-2">{{ t('svg-export-input') }}</p>
        <div class="flex gap-3 mb-3">
          <button @click="mode='paste'" :class="mode==='paste'?'btn-primary':'btn-secondary'" class="text-sm">📝 {{ t('svg-export-paste') }}</button>
          <button @click="mode='file'" :class="mode==='file'?'btn-primary':'btn-secondary'" class="text-sm">📁 {{ t('svg-export-upload') }}</button>
        </div>
        <div v-if="mode==='paste'">
          <textarea v-model="svgCode" class="tool-input h-48 font-mono text-xs" :placeholder="t('svg-export-placeholder')" @input="onCodeInput"></textarea>
        </div>
        <div v-else class="text-center cursor-pointer p-8" style="border:2px dashed var(--border)" @click="$refs.fileInput.click()" @dragover.prevent="dragging=true" @dragleave="dragging=false" @drop.prevent="handleDrop" :class="{'ring-2 ring-indigo-400':dragging}">
          <input ref="fileInput" type="file" accept=".svg,image/svg+xml" class="hidden" @change="handleFile">
          <p class="text-4xl mb-2">📁</p>
          <p style="color:var(--text-secondary)">{{ t('svg-export-drop') }}</p>
        </div>
      </div>

      <div v-if="svgCode" class="grid lg:grid-cols-2 gap-4">
        <div class="card">
          <p class="font-medium mb-2">{{ t('svg-export-preview') }}</p>
          <div class="border rounded-lg overflow-auto flex items-center justify-center" style="border-color:var(--border);background:var(--bg);min-height:200px;max-height:400px">
            <div v-if="validSvg" class="max-w-full max-h-full p-4" v-html="svgCode"></div>
            <p v-else class="text-sm" style="color:var(--text-secondary)">{{ t('svg-export-invalid') }}</p>
          </div>
          <p v-if="parseError" class="text-sm mt-2" style="color:#ef4444">{{ parseError }}</p>
        </div>

        <div class="card">
          <p class="font-medium mb-3">{{ t('svg-export-settings') }}</p>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <label class="flex flex-col gap-1">
                <span class="text-sm" style="color:var(--text-secondary)">{{ t('svg-export-width') }}</span>
                <input type="number" v-model.number="outWidth" min="1" max="10000" class="tool-input" @input="keepRatio('w')">
              </label>
              <label class="flex flex-col gap-1">
                <span class="text-sm" style="color:var(--text-secondary)">{{ t('svg-export-height') }}</span>
                <input type="number" v-model.number="outHeight" min="1" max="10000" class="tool-input" @input="keepRatio('h')">
              </label>
            </div>
            <div class="flex items-center gap-2">
              <input type="checkbox" v-model="lockRatio" id="lockRatio">
              <label for="lockRatio" class="text-sm" style="color:var(--text-secondary)">🔒 {{ t('svg-export-lock-ratio') }}</label>
              <button @click="resetSize" class="btn-secondary text-xs ml-auto">{{ t('svg-export-reset-size') }}</button>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <label class="flex flex-col gap-1">
                <span class="text-sm" style="color:var(--text-secondary)">{{ t('svg-export-format') }}</span>
                <select v-model="format" class="tool-input">
                  <option value="png">PNG</option>
                  <option value="jpeg">JPG</option>
                  <option value="webp">WebP</option>
                </select>
              </label>
              <label class="flex flex-col gap-1">
                <span class="text-sm" style="color:var(--text-secondary)">{{ t('svg-export-quality') }}</span>
                <div class="flex items-center gap-2">
                  <input type="range" v-model.number="quality" min="10" max="100" step="5" class="flex-1">
                  <span class="text-xs font-mono w-10" style="color:var(--primary)">{{ quality }}%</span>
                </div>
              </label>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm" style="color:var(--text-secondary)">{{ t('svg-export-bg') }}</label>
              <div class="flex gap-2">
                <button v-for="c in bgOptions" :key="c" @click="bgColor=c" class="w-8 h-8 rounded border-2" :style="{background:c,borderColor:bgColor===c?'var(--primary)':'var(--border)'}"></button>
              </div>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-sm" style="color:var(--text-secondary)">{{ t('svg-export-scale') }}</span>
              <div class="flex gap-2">
                <button v-for="s in [1,2,3,4]" :key="s" @click="scale=s" :class="scale===s?'btn-primary':'btn-secondary'" class="text-sm">{{ s }}x</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="validSvg" class="flex gap-3">
        <button @click="exportImage" class="btn-primary flex-1">💾 {{ t('svg-export-download') }}</button>
        <button @click="copyToClipboard" class="btn-secondary flex-1">📋 {{ t('svg-export-copy') }}</button>
        <button @click="reset" class="btn-secondary">↺ {{ t('reset') }}</button>
      </div>

      <div v-if="exportUrl" class="card">
        <p class="font-medium mb-2">{{ t('svg-export-result') }}</p>
        <div class="border rounded-lg overflow-hidden text-center" style="border-color:var(--border);background:var(--bg)">
          <img :src="exportUrl" :style="{maxWidth:'100%',maxHeight:'300px',background:format==='jpeg'?bgColor:'transparent',imageRendering:scale>1?'pixelated':'auto'}">
        </div>
        <div class="mt-3 grid grid-cols-3 gap-2 text-xs" style="color:var(--text-secondary)">
          <span>{{ t('svg-export-size') }}: {{ outWidth * scale }}×{{ outHeight * scale }}</span>
          <span>{{ t('svg-export-format') }}: {{ format.toUpperCase() }}</span>
          <span>{{ t('svg-export-filesize') }}: {{ fileSize }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { t } from '../../i18n'

const mode = ref('paste')
const dragging = ref(false)
const fileInput = ref(null)
const svgCode = ref('')
const validSvg = ref(false)
const parseError = ref('')
const outWidth = ref(400)
const outHeight = ref(400)
const lockRatio = ref(true)
const format = ref('png')
const quality = ref(90)
const scale = ref(1)
const bgColor = ref('#ffffff')
const exportUrl = ref('')
const fileSize = ref('')
const nativeW = ref(0)
const nativeH = ref(0)
const svgObjectUrl = ref(null)

const bgOptions = ['#ffffff', '#000000', 'transparent', '#f3f4f6', '#fef3c7', '#dbeafe']

function onCodeInput() {
  validateAndParse()
}

function validateAndParse() {
  parseError.value = ''
  validSvg.value = false
  if (!svgCode.value.trim()) return
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(svgCode.value, 'image/svg+xml')
    if (doc.querySelector('parsererror')) {
      parseError.value = t('svg-export-parse-error')
      return
    }
    const svgEl = doc.querySelector('svg')
    if (!svgEl) {
      parseError.value = t('svg-export-no-svg')
      return
    }
    const vb = svgEl.getAttribute('viewBox')
    if (vb) {
      const parts = vb.split(/[\s,]+/).map(Number)
      if (parts.length === 4) {
        nativeW.value = parts[2]
        nativeH.value = parts[3]
      }
    } else {
      nativeW.value = parseInt(svgEl.getAttribute('width')) || 400
      nativeH.value = parseInt(svgEl.getAttribute('height')) || 400
    }
    if (!outWidth.value || !outHeight.value) {
      outWidth.value = nativeW.value || 400
      outHeight.value = nativeH.value || 400
    }
    validSvg.value = true
    exportUrl.value = ''
  } catch (e) {
    parseError.value = e.message
  }
}

function handleFile(e) {
  const file = e.target.files[0]
  if (file) readFile(file)
}

function handleDrop(e) {
  dragging.value = false
  const file = e.dataTransfer.files[0]
  if (file && (file.type === 'image/svg+xml' || file.name.endsWith('.svg'))) {
    readFile(file)
  }
}

function readFile(file) {
  const reader = new FileReader()
  reader.onload = (e) => {
    svgCode.value = e.target.result
    nextTick(validateAndParse)
  }
  reader.readAsText(file)
}

function keepRatio(from) {
  if (!lockRatio.value || !nativeW.value || !nativeH.value) return
  const ratio = nativeW.value / nativeH.value
  if (from === 'w') {
    outHeight.value = Math.round(outWidth.value / ratio)
  } else {
    outWidth.value = Math.round(outHeight.value * ratio)
  }
}

function resetSize() {
  outWidth.value = nativeW.value || 400
  outHeight.value = nativeH.value || 400
}

async function exportImage() {
  if (!validSvg.value) return
  const w = outWidth.value * scale.value
  const h = outHeight.value * scale.value

  if (svgObjectUrl.value) URL.revokeObjectURL(svgObjectUrl.value)
  const blob = new Blob([svgCode.value], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  svgObjectUrl.value = url

  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')

    if (format.value !== 'png' || bgColor.value !== 'transparent') {
      ctx.fillStyle = bgColor.value === 'transparent' ? 'rgba(0,0,0,0)' : bgColor.value
      ctx.fillRect(0, 0, w, h)
    }

    ctx.drawImage(img, 0, 0, w, h)

    const mimeType = format.value === 'jpeg' ? 'image/jpeg' : format.value === 'webp' ? 'image/webp' : 'image/png'
    canvas.toBlob((blob) => {
      if (!blob) return
      if (exportUrl.value) URL.revokeObjectURL(exportUrl.value)
      exportUrl.value = URL.createObjectURL(blob)
      fileSize.value = formatSize(blob.size)
    }, mimeType, quality.value / 100)
  }
  img.src = url
}

function formatSize(bytes) {
  if (bytes > 1048576) return (bytes / 1048576).toFixed(1) + ' MB'
  if (bytes > 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return bytes + ' B'
}

function copyToClipboard() {
  if (!validSvg.value) return
  navigator.clipboard.writeText(svgCode.value)
  window.showToast?.(t('copied'))
}

function reset() {
  svgCode.value = ''
  validSvg.value = false
  parseError.value = ''
  outWidth.value = 400
  outHeight.value = 400
  lockRatio.value = true
  format.value = 'png'
  quality.value = 90
  scale.value = 1
  bgColor.value = '#ffffff'
  if (exportUrl.value) URL.revokeObjectURL(exportUrl.value)
  exportUrl.value = ''
  fileSize.value = ''
}
</script>
