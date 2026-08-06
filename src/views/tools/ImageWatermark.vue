<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">💧 {{ t('image-watermark') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('image-watermark-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="card p-6 text-center" @click="$refs.fileInput.click()" style="border:2px dashed var(--border);cursor:pointer">
        <div class="text-4xl mb-2">🖼️</div>
        <p>{{ t('drop-or-click') }}</p>
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onSelect">
      </div>

      <div v-if="img" class="pt-3 border-t space-y-4" style="border-color:var(--border)">
        <div class="flex items-center gap-3">
          <label class="text-sm font-medium w-28" style="color:var(--text-secondary)">{{ t('watermark-text') }}</label>
          <input v-model="text" class="tool-input flex-1" placeholder="© 2026">
        </div>
        <div class="flex items-center gap-3">
          <label class="text-sm font-medium w-28" style="color:var(--text-secondary)">{{ t('opacity') }}</label>
          <input v-model.number="opacity" type="range" min="0.05" max="1" step="0.05" class="flex-1">
          <span class="text-sm w-12 text-right">{{ Math.round(opacity * 100) }}%</span>
        </div>
        <div class="flex items-center gap-3">
          <label class="text-sm font-medium w-28" style="color:var(--text-secondary)">{{ t('position') }}</label>
          <select v-model="pos" class="tool-input flex-1">
            <option v-for="(p, k) in positions" :key="k" :value="k">{{ t('pos-' + k) }}</option>
          </select>
        </div>
        <button @click="exportImg" class="btn-primary">⬇️ {{ t('export-png') }}</button>
        <canvas ref="canvas" class="hidden"></canvas>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { t } from '../../i18n'

const img = ref(null)
const text = ref('© 2026')
const opacity = ref(0.4)
const pos = ref('br')
const canvas = ref(null)

const positions = { tl: '', tc: '', tr: '', ml: '', mc: '', mr: '', bl: '', bc: '', br: '' }

function onSelect(e) {
  const f = e.target.files[0]
  if (!f) return
  const reader = new FileReader()
  reader.onload = () => {
    const im = new Image()
    im.onload = () => { img.value = im }
    im.src = reader.result
  }
  reader.readAsDataURL(f)
}

function exportImg() {
  if (!img.value) return
  const cv = canvas.value
  cv.width = img.value.naturalWidth
  cv.height = img.value.naturalHeight
  const ctx = cv.getContext('2d')
  ctx.drawImage(img.value, 0, 0)
  ctx.font = `bold ${Math.max(20, cv.width / 18)}px sans-serif`
  ctx.fillStyle = `rgba(255,255,255,${opacity.value})`
  ctx.textAlign = 'center'
  const txt = text.value || 'watermark'
  const tw = ctx.measureText(txt).width
  const pad = cv.width * 0.02
  const col = { l: pad + tw / 2, m: cv.width / 2, r: cv.width - pad - tw / 2 }
  const row = { t: cv.height * 0.08, m: cv.height / 2, b: cv.height * 0.92 }
  ctx.fillText(txt, col[pos.value[0]], row[pos.value[1]])
  const a = document.createElement('a')
  a.href = cv.toDataURL('image/png')
  a.download = 'watermarked.png'
  a.click()
}
</script>