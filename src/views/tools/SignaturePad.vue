<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">✍️ {{ t('signature-pad') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('signature-pad-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <canvas ref="canvas" class="w-full h-64 rounded-lg touch-none" style="background:#fff;border:1px solid var(--border);cursor:crosshair"></canvas>
      <div class="flex flex-wrap items-center gap-3">
        <label class="text-sm font-medium" style="color:var(--text-secondary)">{{ t('sign-color') }}</label>
        <input v-model="color" type="color" class="w-10 h-8">
        <label class="text-sm font-medium ml-3" style="color:var(--text-secondary)">{{ t('sign-width') }}</label>
        <input v-model.number="size" type="range" min="1" max="12" class="w-24">
        <button @click="clear" class="btn-secondary ml-auto">🗑️ {{ t('clear') }}</button>
        <button @click="save" class="btn-primary">⬇️ {{ t('export-png') }}</button>
      </div>
      <div class="text-xs" style="color:var(--text-secondary)">{{ t('signature-pad-note') }}</div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { t } from '../../i18n'

const canvas = ref(null)
const color = ref('#000000')
const size = ref(3)
let ctx, drawing = false

onMounted(() => {
  ctx = canvas.value.getContext('2d')
  const resize = () => {
    const rect = canvas.value.getBoundingClientRect()
    canvas.value.width = rect.width * 2
    canvas.value.height = rect.height * 2
    ctx.scale(2, 2)
  }
  resize()
  window.addEventListener('resize', resize)
  const pos = e => {
    const r = canvas.value.getBoundingClientRect()
    const p = e.touches ? e.touches[0] : e
    return { x: p.clientX - r.left, y: p.clientY - r.top }
  }
  const start = e => { drawing = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); e.preventDefault && e.preventDefault() }
  const move = e => {
    if (!drawing) return
    const p = pos(e)
    ctx.lineTo(p.x, p.y)
    ctx.strokeStyle = color.value
    ctx.lineWidth = size.value
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
  }
  const stop = () => { drawing = false }
  const c = canvas.value
  c.addEventListener('mousedown', start)
  c.addEventListener('mousemove', move)
  window.addEventListener('mouseup', stop)
  c.addEventListener('touchstart', start, { passive: false })
  c.addEventListener('touchmove', move, { passive: false })
  c.addEventListener('touchend', stop)
})

function clear() {
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
}
function save() {
  const a = document.createElement('a')
  a.href = canvas.value.toDataURL('image/png')
  a.download = 'signature.png'
  a.click()
}
</script>