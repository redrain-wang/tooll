<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('text-handwriting-title') }}</h1>
    <p class="mb-6" style="color: var(--text-secondary);">{{ t('text-handwriting-desc') }}</p>
    <div class="space-y-4">
      <textarea v-model="text" class="tool-input h-32 font-mono text-sm" :placeholder="t('text-handwriting-placeholder')" @input="render"></textarea>

      <div class="card space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--text-secondary);">{{ t('text-handwriting-font') }}</label>
            <select v-model="fontFamily" class="tool-input text-sm" @change="loadFontAndRender">
              <option v-for="f in fonts" :key="f.name" :value="f.name">{{ f.label }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--text-secondary);">{{ t('text-handwriting-font-size') }}: {{ fontSize }}px</label>
            <input type="range" v-model.number="fontSize" min="12" max="72" step="1" class="w-full accent-[var(--primary)]" @input="render">
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--text-secondary);">{{ t('text-handwriting-color') }}</label>
            <div class="flex items-center gap-2">
              <input type="color" v-model="textColor" class="w-10 h-8 rounded cursor-pointer border-0" @input="render">
              <input v-model="textColor" class="tool-input text-sm flex-1" @input="render">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--text-secondary);">{{ t('text-handwriting-bg') }}</label>
            <div class="flex items-center gap-2">
              <input type="color" v-model="bgColor" class="w-10 h-8 rounded cursor-pointer border-0" @input="render">
              <input v-model="bgColor" class="tool-input text-sm flex-1" @input="render">
            </div>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" style="color: var(--text-secondary);">{{ t('text-handwriting-line-height') }}: {{ lineHeight }}</label>
          <input type="range" v-model.number="lineHeight" min="1" max="3" step="0.1" class="w-full accent-[var(--primary)]" @input="render">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" style="color: var(--text-secondary);">{{ t('text-handwriting-padding') }}: {{ padding }}px</label>
          <input type="range" v-model.number="padding" min="0" max="80" step="4" class="w-full accent-[var(--primary)]" @input="render">
        </div>
      </div>

      <div v-if="!text" class="card text-center" style="color: var(--text-secondary);">
        <p class="text-sm">{{ t('text-handwriting-hint') }}</p>
      </div>

      <div v-if="imageDataUrl" class="card flex flex-col items-center gap-4">
        <canvas ref="canvasRef" class="max-w-full rounded-lg border" :style="{ borderColor: 'var(--border)' }" style="display:none"></canvas>
        <img :src="imageDataUrl" alt="Handwriting" class="max-w-full rounded-lg border" :style="{ borderColor: 'var(--border)' }" />
        <div class="flex gap-3">
          <button @click="download" class="btn-primary px-6 py-2 text-sm">📥 {{ t('download') }}</button>
          <button @click="copyImage" class="btn-secondary px-6 py-2 text-sm">📋 {{ t('copy') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { t } from '../../i18n'

const text = ref('')
const fontFamily = ref('Caveat')
const fontSize = ref(28)
const textColor = ref('#1a1a1a')
const bgColor = ref('#ffffff')
const lineHeight = ref(1.6)
const padding = ref(32)
const imageDataUrl = ref('')
const canvasRef = ref(null)

const fonts = [
  { name: 'Caveat', label: 'Caveat (Casual)' },
  { name: 'Dancing Script', label: 'Dancing Script (Elegant)' },
  { name: 'Indie Flower', label: 'Indie Flower (Playful)' },
  { name: 'Kalam', label: 'Kalam (Natural)' },
  { name: 'Patrick Hand', label: 'Patrick Hand (Simple)' },
  { name: 'Satisfy', label: 'Satisfy (Cursive)' },
  { name: 'Great Vibes', label: 'Great Vibes (Formal)' },
  { name: 'Pacifico', label: 'Pacifico (Retro)' },
  { name: 'Architects Daughter', label: 'Architects Daughter (Sketch)' },
  { name: 'Shadows Into Light', label: 'Shadows Into Light (Light)' },
  { name: 'Amatic SC', label: 'Amatic SC (Condensed)' },
  { name: 'Permanent Marker', label: 'Permanent Marker (Bold)' }
]

const loadedFonts = new Set()

function loadFont(fontName) {
  if (loadedFonts.has(fontName)) return Promise.resolve()
  const link = document.createElement('link')
  link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}&display=swap`
  link.rel = 'stylesheet'
  document.head.appendChild(link)
  loadedFonts.add(fontName)
  return new Promise(resolve => {
    link.onload = resolve
    link.onerror = resolve
  })
}

function loadFontAndRender() {
  loadFont(fontFamily.value).then(() => render())
}

function render() {
  const canvas = canvasRef.value
  if (!canvas || !text.value) { imageDataUrl.value = ''; return }

  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1

  const font = `${fontSize.value}px "${fontFamily.value}", cursive`
  const lineH = fontSize.value * lineHeight.value

  ctx.font = font
  const lines = text.value.split('\n')
  let maxWidth = 0
  lines.forEach(line => {
    const m = ctx.measureText(line || ' ')
    if (m.width > maxWidth) maxWidth = m.width
  })

  const w = Math.max(200, Math.ceil(maxWidth + padding.value * 2))
  const h = Math.max(80, Math.ceil(lines.length * lineH + padding.value * 2 - (lineH - fontSize.value)))

  canvas.width = w * dpr
  canvas.height = h * dpr
  canvas.style.width = w + 'px'
  canvas.style.height = h + 'px'
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  ctx.fillStyle = bgColor.value
  ctx.fillRect(0, 0, w, h)

  ctx.font = font
  ctx.fillStyle = textColor.value
  ctx.textBaseline = 'top'

  lines.forEach((line, i) => {
    ctx.fillText(line, padding.value, padding.value + i * lineH)
  })

  imageDataUrl.value = canvas.toDataURL('image/png')
}

function download() {
  if (!imageDataUrl.value) return
  const a = document.createElement('a')
  a.href = imageDataUrl.value
  a.download = 'handwriting.png'
  a.click()
}

function copyImage() {
  if (!imageDataUrl.value) return
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.toBlob(blob => {
    if (blob) {
      navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      window.showToast?.(t('copied'))
    }
  })
}

onMounted(() => {
  loadFont(fontFamily.value).then(() => render())
})
</script>
