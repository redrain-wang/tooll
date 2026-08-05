<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🪪 {{ t('id-photo') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('id-photo-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="card p-6 text-center" @click="$refs.fileInput.click()" style="border:2px dashed var(--border);cursor:pointer">
        <div class="text-4xl mb-2">🖼️</div>
        <p>{{ t('drop-or-click') }}</p>
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onSelect">
      </div>

      <div v-if="img" class="pt-3 border-t space-y-4" style="border-color:var(--border)">
        <div class="flex items-center gap-3">
          <label class="text-sm font-medium w-28" style="color:var(--text-secondary)">{{ t('photo-spec') }}</label>
          <select v-model="spec" class="tool-input flex-1">
            <option value="1inch">1寸 25×35mm</option>
            <option value="2inch">2寸 35×49mm</option>
            <option value="small1">小1寸 22×32mm</option>
            <option value="small2">小2寸 35×45mm</option>
          </select>
        </div>
        <div class="flex items-center gap-3">
          <label class="text-sm font-medium w-28" style="color:var(--text-secondary)">{{ t('photo-bg') }}</label>
          <div class="flex gap-2">
            <button v-for="bg in bgs" :key="bg.key" @click="bgKey = bg.key" class="w-8 h-8 rounded-full border-2" :style="{ background: bg.color, borderColor: bgKey === bg.key ? 'var(--primary)' : 'var(--border)' }"></button>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <label class="text-sm font-medium w-28" style="color:var(--text-secondary)">{{ t('photo-count') }}</label>
          <input v-model.number="count" type="number" min="1" max="8" class="tool-input w-20 font-mono">
        </div>
        <button @click="exportPhoto" class="btn-primary">⬇️ {{ t('export-photo') }}</button>
        <canvas ref="canvas" class="hidden"></canvas>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { t } from '../../i18n'

const img = ref(null)
const spec = ref('1inch')
const bgKey = ref('blue')
const count = ref(4)
const canvas = ref(null)
const bgs = [
  { key: 'white', color: '#ffffff' },
  { key: 'blue', color: '#438edb' },
  { key: 'red', color: '#d7000f' },
]

const specs = {
  '1inch': { w: 25, h: 35 },
  '2inch': { w: 35, h: 49 },
  'small1': { w: 22, h: 32 },
  'small2': { w: 35, h: 45 },
}

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

function exportPhoto() {
  if (!img.value) return
  const bg = bgs.find(b => b.key === bgKey.value).color
  const { w, h } = specs[spec.value]
  const dpi = 300
  const cw = Math.round(w / 25.4 * dpi)
  const ch = Math.round(h / 25.4 * dpi)
  const cv = canvas.value
  cv.width = cw
  cv.height = ch
  const ctx = cv.getContext('2d')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, cw, ch)
  const s = Math.min(cw / img.value.naturalWidth, ch / img.value.naturalHeight) * 0.9
  const dw = img.value.naturalWidth * s, dh = img.value.naturalHeight * s
  ctx.drawImage(img.value, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
  const a = document.createElement('a')
  a.href = cv.toDataURL('image/png')
  a.download = `id-photo-${spec.value}.png`
  a.click()
}
</script>