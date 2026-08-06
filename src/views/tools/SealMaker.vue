<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🔴 {{ t('seal-maker') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('seal-maker-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('seal-text') }}</label>
        <input v-model="text" class="tool-input flex-1" placeholder="某某科技有限公司" maxlength="12">
      </div>
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('center-text') }}</label>
        <input v-model="center" class="tool-input flex-1" placeholder="合同专用章" maxlength="5">
      </div>
      <div class="flex items-center gap-3">
        <button @click="draw" class="btn-primary">🔴 {{ t('generate-seal') }}</button>
        <button @click="download" class="btn-secondary" :disabled="!rendered">⬇️ {{ t('export-png') }}</button>
      </div>
      <canvas ref="canvas" width="400" height="400" class="w-full max-w-96 mx-auto rounded-full" style="background:#fff;border:1px solid var(--border)"></canvas>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { t } from '../../i18n'

const text = ref('某某科技有限公司')
const center = ref('合同专用章')
const canvas = ref(null)
const rendered = ref(false)

function draw() {
  const cv = canvas.value
  const ctx = cv.getContext('2d')
  const cx = 200, cy = 200, r = 175
  ctx.clearRect(0, 0, 400, 400)
  ctx.strokeStyle = '#c7000b'
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(cx, cy, r - 22, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = '#c7000b'
  ctx.font = 'bold 34px serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const chars = text.value.split('')
  const n = chars.length
  const step = Math.PI * 2 / n
  ctx.save()
  ctx.translate(cx, cy)
  for (let i = 0; i < n; i++) {
    ctx.save()
    ctx.rotate(-Math.PI / 2 + step * i)
    ctx.translate(0, -(r - 45))
    ctx.rotate(Math.PI / 2 + step * i - (-Math.PI / 2 + step * i))
    ctx.fillText(chars[i], 0, 0)
    ctx.restore()
  }
  ctx.restore()
  const cc = center.value.slice(0, 5)
  if (cc.length <= 2) {
    ctx.font = 'bold 48px serif'
    ctx.fillText(cc, cx, cy)
  } else {
    const h = cc.length * 30
    ctx.font = 'bold 30px serif'
    cc.split('').forEach((c, i) => {
      ctx.fillText(c, cx, cy - h / 2 + 30 * i + 15)
    })
  }
  ctx.strokeStyle = '#c7000b'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(cx - 50, cy + 55)
  ctx.lineTo(cx - 15, cy + 55)
  ctx.moveTo(cx + 50, cy + 55)
  ctx.lineTo(cx + 15, cy + 55)
  ctx.stroke()
  rendered.value = true
}
function download() {
  const a = document.createElement('a')
  a.href = canvas.value.toDataURL('image/png')
  a.download = 'seal.png'
  a.click()
}
onMounted(draw)
</script>