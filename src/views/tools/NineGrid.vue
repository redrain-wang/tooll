<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🔳 {{ t('nine-grid') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('nine-grid-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="card p-6 text-center" @click="$refs.fileInput.click()" style="border:2px dashed var(--border);cursor:pointer">
        <div class="text-4xl mb-2">🖼️</div>
        <p>{{ t('drop-or-click') }}</p>
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onSelect">
      </div>

      <div v-if="img" class="pt-3 border-t space-y-4" style="border-color:var(--border)">
        <div class="flex items-center gap-3">
          <label class="text-sm font-medium w-32" style="color:var(--text-secondary)">{{ t('grid-size') }}</label>
          <input v-model.number="grid" type="range" min="2" max="5" class="flex-1">
          <span class="text-sm w-8 text-right">{{ grid }}×{{ grid }}</span>
        </div>
        <button @click="split" class="btn-primary" :disabled="busy">🔳 {{ t('split-image') }}</button>
        <div v-if="err" class="text-sm text-red-500">{{ err }}</div>
        <div v-if="tiles.length" class="flex flex-wrap gap-2">
          <div v-for="(t, i) in tiles" :key="i" class="card p-1 text-center">
            <img :src="t" class="w-20 h-20 object-contain bg-black/5 rounded">
            <button @click="downloadTile(t, i)" class="mt-1 text-xs underline" style="color:var(--primary)">{{ t('download') }} {{ i + 1 }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { t } from '../../i18n'

const img = ref(null)
const grid = ref(3)
const tiles = ref([])
const busy = ref(false)
const err = ref('')

function onSelect(e) {
  const f = e.target.files[0]
  if (!f) return
  const reader = new FileReader()
  reader.onload = () => {
    const im = new Image()
    im.onload = () => { img.value = im; tiles.value = [] }
    im.src = reader.result
  }
  reader.readAsDataURL(f)
}

function split() {
  busy.value = true
  err.value = ''
  tiles.value = []
  try {
    const im = img.value
    const n = grid.value
    const side = Math.max(im.naturalWidth, im.naturalHeight)
    const canvas = document.createElement('canvas')
    canvas.width = side
    canvas.height = side
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, side, side)
    ctx.drawImage(im, (side - im.naturalWidth) / 2, (side - im.naturalHeight) / 2)
    const tile = Math.floor(side / n)
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const tc = document.createElement('canvas')
        tc.width = tile
        tc.height = tile
        tc.getContext('2d').drawImage(canvas, c * tile, r * tile, tile, tile, 0, 0, tile, tile)
        tiles.value.push(tc.toDataURL('image/png'))
      }
    }
  } catch { err.value = t('image-load-error') }
  busy.value = false
}

function downloadTile(url, i) {
  const a = document.createElement('a')
  a.href = url
  a.download = `grid-${i + 1}.png`
  a.click()
}
</script>