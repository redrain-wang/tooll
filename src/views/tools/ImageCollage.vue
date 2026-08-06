<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🧩 {{ t('image-collage') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('image-collage-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="card p-6 text-center" @click="$refs.fileInput.click()" @dragover.prevent="dragging=true" @dragleave="dragging=false" @drop.prevent="onDrop" style="border:2px dashed var(--border);cursor:pointer" :class="dragging?'ring-2 ring-indigo-400':''">
        <div class="text-4xl mb-2">🖼️</div>
        <p>{{ t('drop-or-click') }}</p>
        <p class="text-sm mt-1" style="color:var(--text-secondary)">{{ t('collage-hint') }}</p>
        <input ref="fileInput" type="file" accept="image/*" multiple class="hidden" @change="onSelect">
      </div>

      <div v-if="images.length" class="pt-3 border-t space-y-4" style="border-color:var(--border)">
        <div class="flex items-center gap-3">
          <label class="text-sm font-medium w-32" style="color:var(--text-secondary)">{{ t('direction') }}</label>
          <select v-model="dir" class="tool-input flex-1">
            <option value="v">{{ t('vertical') }}</option>
            <option value="h">{{ t('horizontal') }}</option>
          </select>
        </div>
        <button @click="stitch" class="btn-primary" :disabled="busy">🧩 {{ t('stitch') }}</button>
        <div v-if="err" class="text-sm text-red-500">{{ err }}</div>
        <div v-if="result" class="flex justify-center">
          <img :src="result" class="max-w-full max-h-96 rounded" style="border:1px solid var(--border)">
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { t } from '../../i18n'

const images = ref([])
const dir = ref('v')
const dragging = ref(false)
const busy = ref(false)
const err = ref('')
const result = ref('')

async function onSelect(e) {
  err.value = ''
  for (const f of e.target.files) {
    if (!f.type.startsWith('image/')) continue
    images.value.push(await load(f))
  }
}
function onDrop(e) { dragging.value = false; if (e.dataTransfer.files.length) onSelect({ target: { files: e.dataTransfer.files } }) }

function load(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => {
      const im = new Image()
      im.onload = () => resolve(im)
      im.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

async function stitch() {
  if (!images.value.length) return
  busy.value = true
  err.value = ''
  result.value = ''
  try {
    const ims = images.value
    const maxW = Math.max(...ims.map(i => i.naturalWidth))
    const totalH = ims.reduce((a, i) => a + i.naturalHeight * (maxW / i.naturalWidth), 0)
    const canvas = document.createElement('canvas')
    if (dir.value === 'v') {
      canvas.width = maxW
      canvas.height = totalH
      const ctx = canvas.getContext('2d')
      let y = 0
      for (const im of ims) {
        const h = im.naturalHeight * (maxW / im.naturalWidth)
        ctx.drawImage(im, 0, y, maxW, h)
        y += h
      }
    } else {
      const maxH = Math.max(...ims.map(i => i.naturalHeight))
      const totalW = ims.reduce((a, i) => a + i.naturalWidth * (maxH / i.naturalHeight), 0)
      canvas.width = totalW
      canvas.height = maxH
      const ctx = canvas.getContext('2d')
      let x = 0
      for (const im of ims) {
        const w = im.naturalWidth * (maxH / im.naturalHeight)
        ctx.drawImage(im, x, 0, w, maxH)
        x += w
      }
    }
    result.value = canvas.toDataURL('image/png')
  } catch { err.value = t('image-load-error') }
  busy.value = false
}
</script>