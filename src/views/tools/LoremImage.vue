<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('lorem-image-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('lorem-image-desc') }}</p>
    <div class="grid md:grid-cols-2 gap-6">
      <div class="card space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm block mb-1" style="color:var(--text-secondary)">{{ t('width') }}</label>
            <input v-model.number="width" type="number" min="1" max="4096" class="tool-input">
          </div>
          <div>
            <label class="text-sm block mb-1" style="color:var(--text-secondary)">{{ t('height') }}</label>
            <input v-model.number="height" type="number" min="1" max="4096" class="tool-input">
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm block mb-1" style="color:var(--text-secondary)">{{ t('lorem-image-bg-color') }}</label>
            <div class="flex items-center gap-2">
              <input type="color" v-model="bgColor" class="w-10 h-10 rounded cursor-pointer border-0">
              <input v-model="bgColor" class="tool-input font-mono text-xs flex-1">
            </div>
          </div>
          <div>
            <label class="text-sm block mb-1" style="color:var(--text-secondary)">{{ t('lorem-image-text-color') }}</label>
            <div class="flex items-center gap-2">
              <input type="color" v-model="textColor" class="w-10 h-10 rounded cursor-pointer border-0">
              <input v-model="textColor" class="tool-input font-mono text-xs flex-1">
            </div>
          </div>
        </div>
        <div>
          <label class="text-sm block mb-1" style="color:var(--text-secondary)">{{ t('lorem-image-custom-text') }}</label>
          <input v-model="customText" class="tool-input" :placeholder="`${width}x${height}`">
        </div>
        <div class="flex gap-3">
          <button @click="applyPreset(320, 240)" class="btn-secondary text-xs flex-1">320×240</button>
          <button @click="applyPreset(640, 480)" class="btn-secondary text-xs flex-1">640×480</button>
          <button @click="applyPreset(1280, 720)" class="btn-secondary text-xs flex-1">1280×720</button>
          <button @click="applyPreset(1920, 1080)" class="btn-secondary text-xs flex-1">1920×1080</button>
        </div>
      </div>
      <div class="card space-y-4">
        <div v-if="svgData" class="rounded-lg overflow-hidden" style="border:1px solid var(--border)">
          <div class="p-4 text-center" style="background:var(--bg)" v-html="svgData"></div>
        </div>
        <div v-if="svgData" class="flex gap-3">
          <button @click="downloadSvg" class="btn-primary flex-1">📥 SVG</button>
          <button @click="downloadPng" class="btn-primary flex-1">📥 PNG</button>
          <button @click="copySvg" class="btn-secondary flex-1">📋 {{ t('copy') }}</button>
        </div>
        <div v-if="svgData" class="relative">
          <code class="block p-3 rounded-lg font-mono text-xs break-all overflow-auto max-h-40" style="background:var(--bg);color:var(--primary)">{{ svgData }}</code>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'

const width = ref(400)
const height = ref(300)
const bgColor = ref('#CCCCCC')
const textColor = ref('#333333')
const customText = ref('')

const displayText = computed(() => {
  return customText.value.trim() || `${width.value}x${height.value}`
})

const svgData = computed(() => {
  const w = width.value
  const h = height.value
  if (!w || !h) return ''
  const fontSize = Math.max(12, Math.min(w, h) / 10)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="${bgColor.value}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="${fontSize}" fill="${textColor.value}">${escapeXml(displayText.value)}</text></svg>`
})

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

function applyPreset(w, h) {
  width.value = w
  height.value = h
}

function downloadSvg() {
  const blob = new Blob([svgData.value], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `lorem-${width.value}x${height.value}.svg`
  a.click()
  URL.revokeObjectURL(url)
}

function downloadPng() {
  const img = new Image()
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData.value)
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = width.value
    canvas.height = height.value
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `lorem-${width.value}x${height.value}.png`
      a.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }
}

function copySvg() {
  navigator.clipboard.writeText(svgData.value)
  window.showToast?.(t('copied'))
}
</script>
