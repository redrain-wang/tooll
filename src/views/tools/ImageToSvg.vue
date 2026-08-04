<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🖼️ {{ t('image-to-svg-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('image-to-svg-desc') }}</p>
    <div class="space-y-4">
      <div class="card text-center cursor-pointer" @click="$refs.fileInput.click()" @dragover.prevent="dragging=true" @dragleave="dragging=false" @drop.prevent="handleDrop" :class="{'ring-2 ring-indigo-400':dragging}" style="border:2px dashed var(--border)">
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFile">
        <p class="text-4xl mb-2">📁</p>
        <p style="color:var(--text-secondary)">{{ t('image-to-svg-select') }}</p>
      </div>

      <div v-if="img" class="grid lg:grid-cols-2 gap-4">
        <div class="card">
          <p class="font-medium mb-2">{{ t('image-to-svg-original') }}</p>
          <div class="border rounded-lg overflow-hidden" style="border-color:var(--border)">
            <canvas ref="srcCanvas" class="max-w-full" style="max-height:400px"></canvas>
          </div>
          <div class="mt-3 grid grid-cols-2 gap-2 text-xs" style="color:var(--text-secondary)">
            <span>{{ t('image-to-svg-size') }}: {{ imgSize }}</span>
            <span>{{ t('image-to-svg-dimensions') }}: {{ imgDimensions }}</span>
          </div>
        </div>
        <div class="card">
          <p class="font-medium mb-2">{{ t('image-to-svg-result') }}</p>
          <div class="border rounded-lg overflow-auto" style="border-color:var(--border);background:var(--bg)">
            <div v-if="svg" class="p-2" v-html="svg"></div>
            <p v-else class="text-sm p-4" style="color:var(--text-secondary)">{{ t('image-to-svg-empty') }}</p>
          </div>
          <div class="mt-3 grid grid-cols-2 gap-2 text-xs" style="color:var(--text-secondary)">
            <span>{{ t('image-to-svg-svgsize') }}: {{ svgSize }}</span>
            <span>{{ t('image-to-svg-ratio') }}: {{ ratio }}</span>
          </div>
        </div>
      </div>

      <div v-if="img" class="card">
        <p class="font-medium mb-3">{{ t('image-to-svg-options') }}</p>
        <div class="grid md:grid-cols-3 gap-4">
          <label class="flex flex-col gap-1">
            <span class="text-sm" style="color:var(--text-secondary)">{{ t('image-to-svg-colors') }}</span>
            <input type="range" v-model.number="colors" min="2" max="64" class="w-full" @input="convert">
            <span class="text-xs font-mono" style="color:var(--primary)">{{ colors }}</span>
          </label>
          <label class="flex flex-col gap-1">
            <span class="text-sm" style="color:var(--text-secondary)">{{ t('image-to-svg-detail') }}</span>
            <input type="range" v-model.number="detail" min="1" max="8" class="w-full" @input="convert">
            <span class="text-xs font-mono" style="color:var(--primary)">{{ detail }}x</span>
          </label>
          <label class="flex flex-col gap-1">
            <span class="text-sm" style="color:var(--text-secondary)">{{ t('image-to-svg-smooth') }}</span>
            <input type="range" v-model.number="smooth" min="0" max="3" class="w-full" @input="convert">
            <span class="text-xs font-mono" style="color:var(--primary)">{{ smooth }}</span>
          </label>
        </div>
      </div>

      <div v-if="svg" class="flex gap-3">
        <button @click="download" class="btn-primary flex-1">💾 {{ t('image-to-svg-download') }}</button>
        <button @click="reset" class="btn-secondary flex-1">↺ {{ t('reset') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { t } from '../../i18n'

const dragging = ref(false)
const fileInput = ref(null)
const srcCanvas = ref(null)
const img = ref(null)
const svg = ref('')
const imgSize = ref('')
const imgDimensions = ref('')
const svgSize = ref('0 B')
const ratio = ref('-')
const colors = ref(8)
const detail = ref(2)
const smooth = ref(1)

function handleFile(e) {
  if (e.target.files[0]) loadImage(e.target.files[0])
}

function handleDrop(e) {
  dragging.value = false
  const f = e.dataTransfer.files[0]
  if (f?.type.startsWith('image/')) loadImage(f)
}

function formatSize(b) {
  return b > 1048576 ? (b / 1048576).toFixed(1) + 'MB' : b > 1024 ? (b / 1024).toFixed(1) + 'KB' : b + 'B'
}

function loadImage(file) {
  imgSize.value = formatSize(file.size)
  const url = URL.createObjectURL(file)
  const el = new Image()
  el.onload = () => {
    img.value = el
    const cv = srcCanvas.value
    const ctx = cv.getContext('2d')
    let w = el.width, h = el.height
    if (w > 800 || h > 600) {
      const r = Math.min(800 / w, 600 / h)
      w = Math.round(w * r)
      h = Math.round(h * r)
    }
    cv.width = w
    cv.height = h
    ctx.drawImage(el, 0, 0, w, h)
    imgDimensions.value = w + 'x' + h
    convert()
  }
  el.src = url
}

function quantize(r, g, b, n) {
  const step = 256 / Math.ceil(Math.sqrt(n))
  const q = v => Math.round(Math.round(v / step) * step)
  return [q(r), q(g), q(b)]
}

function getPixelData(canvas) {
  const ctx = canvas.getContext('2d')
  return ctx.getImageData(0, 0, canvas.width, canvas.height)
}

function convert() {
  if (!img.value) return
  const cv = srcCanvas.value
  const w = cv.width, h = cv.height
  const srcData = getPixelData(cv)
  const src = srcData.data
  const step = Math.max(1, Math.round(8 / detail.value))
  const gridW = Math.ceil(w / step)
  const gridH = Math.ceil(h / step)
  const colorMap = new Uint8Array(gridW * gridH * 3)

  for (let gy = 0; gy < gridH; gy++) {
    for (let gx = 0; gx < gridW; gx++) {
      const sx = gx * step
      const sy = gy * step
      const idx = (sy * w + sx) * 4
      const [qr, qg, qb] = quantize(src[idx], src[idx + 1], src[idx + 2], colors.value)
      const gidx = (gy * gridW + gx) * 3
      colorMap[gidx] = qr
      colorMap[gidx + 1] = qg
      colorMap[gidx + 2] = qb
    }
  }

  if (smooth.value > 0) {
    for (let s = 0; s < smooth.value; s++) {
      const tmp = new Uint8Array(colorMap)
      for (let gy = 1; gy < gridH - 1; gy++) {
        for (let gx = 1; gx < gridW - 1; gx++) {
          const i = (gy * gridW + gx) * 3
          const i1 = ((gy - 1) * gridW + gx) * 3
          const i2 = ((gy + 1) * gridW + gx) * 3
          const i3 = (gy * gridW + gx - 1) * 3
          const i4 = (gy * gridW + gx + 1) * 3
          for (let c = 0; c < 3; c++) {
            tmp[i + c] = Math.round((tmp[i + c] * 3 + tmp[i1 + c] + tmp[i2 + c] + tmp[i3 + c] + tmp[i4 + c]) / 7)
          }
        }
      }
      colorMap.set(tmp)
    }
  }

  const visited = new Uint8Array(gridW * gridH)
  const rects = []

  for (let gy = 0; gy < gridH; gy++) {
    for (let gx = 0; gx < gridW; gx++) {
      if (visited[gy * gridW + gx]) continue
      const idx = (gy * gridW + gx) * 3
      const r = colorMap[idx], g = colorMap[idx + 1], b = colorMap[idx + 2]
      let endX = gx + 1
      while (endX < gridW) {
        const ni = (gy * gridW + endX) * 3
        if (colorMap[ni] !== r || colorMap[ni + 1] !== g || colorMap[ni + 2] !== b) break
        endX++
      }
      let endY = gy + 1
      outer: while (endY < gridH) {
        for (let cx = gx; cx < endX; cx++) {
          const ni = (endY * gridW + cx) * 3
          if (colorMap[ni] !== r || colorMap[ni + 1] !== g || colorMap[ni + 2] !== b) break outer
        }
        endY++
      }
      for (let cy = gy; cy < endY; cy++) {
        for (let cx = gx; cx < endX; cx++) {
          visited[cy * gridW + cx] = 1
        }
      }
      rects.push({
        x: gx * step, y: gy * step,
        w: (endX - gx) * step, h: (endY - gy) * step,
        color: `rgb(${r},${g},${b})`
      })
    }
  }

  const svgW = w, svgH = h
  let paths = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgW} ${svgH}" width="${svgW}" height="${svgH}">`
  for (const rect of rects) {
    paths += `<rect x="${rect.x}" y="${rect.y}" width="${rect.w}" height="${rect.h}" fill="${rect.color}"/>`
  }
  paths += '</svg>'
  svg.value = paths
  svgSize.value = formatSize(new Blob([paths]).size)
  const origSize = new Blob([paths]).size
  ratio.value = img.value ? formatSize(img.value.width * img.value.height * 3) : '-'
}

function download() {
  if (!svg.value) return
  const blob = new Blob([svg.value], { type: 'image/svg+xml' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'converted.svg'
  a.click()
}

function reset() {
  img.value = null
  svg.value = ''
  imgSize.value = ''
  imgDimensions.value = ''
  svgSize.value = '0 B'
  ratio.value = '-'
  colors.value = 8
  detail.value = 2
  smooth.value = 1
}
</script>
