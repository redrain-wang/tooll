<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🎞️ {{ t('gif-splitter') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('gif-splitter-desc') }}</p>

    <div class="card p-6 text-center" @click="$refs.fileInput.click()" style="border:2px dashed var(--border);cursor:pointer">
      <div class="text-4xl mb-2">🎞️</div>
      <p>{{ t('drop-or-click') }}</p>
      <input ref="fileInput" type="file" accept="image/gif" class="hidden" @change="onSelect">
    </div>

    <div v-if="img" class="mt-4">
      <div class="mb-4 flex items-center gap-3">
        <button @click="split" class="btn-primary" :disabled="busy">{{ t('split-gif') }}</button>
        <button v-if="frames.length" @click="downloadAll" class="btn-secondary">⬇️ {{ t('download-all') }}</button>
        <span v-if="busy" class="text-sm" style="color:var(--text-secondary)">...</span>
      </div>
      <div v-if="frames.length" class="flex flex-wrap gap-3">
        <div v-for="(f, i) in frames" :key="i" class="card p-2 text-center">
          <img :src="f" class="w-28 h-28 object-contain bg-black/5 rounded">
          <button @click="downloadOne(f, i)" class="mt-1 text-xs underline" style="color:var(--primary)">{{ t('download') }} {{ i + 1 }}</button>
        </div>
      </div>
      <div v-if="err" class="mt-3 text-sm text-red-500">{{ err }}</div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { t } from '../../i18n'

const img = ref(null)
const frames = ref([])
const busy = ref(false)
const err = ref('')

function onSelect(e) {
  const f = e.target.files[0]
  if (!f) return
  const reader = new FileReader()
  reader.onload = () => {
    const im = new Image()
    im.onload = () => { img.value = { el: im, dataUrl: reader.result } }
    im.src = reader.result
  }
  reader.readAsDataURL(f)
}

function split() {
  err.value = ''
  busy.value = true
  frames.value = []
  const im = img.value.el
  const canvas = document.createElement('canvas')
  canvas.width = im.naturalWidth
  canvas.height = im.naturalHeight
  const ctx = canvas.getContext('2d')
  const seen = new Set()
  let count = 0
  const maxFrames = 120
  const timer = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(im, 0, 0)
    const dataUrl = canvas.toDataURL('image/png')
    if (!seen.has(dataUrl)) {
      seen.add(dataUrl)
      frames.value.push(dataUrl)
    }
    count++
    if (count > maxFrames * 2 || (frames.value.length > 1 && count > frames.value.length * 3 + 20)) {
      clearInterval(timer)
      busy.value = false
    }
  }, 100)
}

function download(dataUrl, name) {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = name
  a.click()
}
function downloadOne(f, i) { download(f, `frame-${i + 1}.png`) }
function downloadAll() {
  frames.value.forEach((f, i) => setTimeout(() => downloadOne(f, i), i * 150))
}
</script>