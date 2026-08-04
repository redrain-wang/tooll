<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('drawing-board') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('drawing-board-desc') }}</p>

    <div class="flex flex-wrap items-center gap-3 mb-4">
      <div class="flex gap-1.5">
        <button v-for="c in colors" :key="c" class="w-7 h-7 rounded-full border-2"
          :style="{ background: c, borderColor: current === c ? 'var(--primary)' : 'transparent' }"
          @click="current = c"></button>
      </div>
      <input type="range" min="1" max="40" v-model.number="size" class="flex-1 max-w-40">
      <span class="text-sm" style="color:var(--text-secondary)">{{ size }}px</span>
      <select v-model="tool" class="tool-input" style="width:auto">
        <option value="pen">✏️ {{ t('pen') }}</option>
        <option value="line">📏 Line / 直线</option>
        <option value="rect">⬜ Rect / 矩形</option>
        <option value="ellipse">⭕ Ellipse / 椭圆</option>
        <option value="eraser">🧽 {{ t('eraser') }}</option>
      </select>
      <input type="color" v-model="current" class="w-8 h-8 rounded cursor-pointer">
      <button @click="undo" class="btn-secondary">↩️ {{ t('undo') }}</button>
      <button @click="clear" class="btn-secondary">🗑️ {{ t('clear') }}</button>
      <button @click="download" class="btn-primary">⬇️ PNG</button>
    </div>

    <div class="rounded-xl border overflow-hidden" style="border-color:var(--border)">
      <canvas ref="canvasEl" class="w-full bg-white touch-none"
        @mousedown="onDown" @mousemove="onMove" @mouseup="onUp" @mouseleave="onUp"
        @touchstart.prevent="onTouchDown" @touchmove.prevent="onTouchMove" @touchend.prevent="onUp"></canvas>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { t } from '../../i18n'

const colors = ['#111827', '#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#ffffff']
const current = ref('#111827')
const size = ref(6)
const tool = ref('pen')
const canvasEl = ref(null)
let ctx = null
let drawing = false
let start = null
const history = []
let W = 0, H = 0

function resize() {
  const canvas = canvasEl.value
  if (!canvas) return
  const parent = canvas.parentElement
  W = parent.clientWidth
  H = Math.max(360, window.innerHeight * 0.5)
  const data = save()
  canvas.width = W
  canvas.height = H
  ctx = canvas.getContext('2d')
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  restore(data)
}
function save() { return canvasEl.value?.toDataURL() || null }
function restore(data) {
  if (!data) { ctx.clearRect(0, 0, W, H); return }
  const img = new Image()
  img.onload = () => { ctx.clearRect(0, 0, W, H); ctx.drawImage(img, 0, 0, W, H) }
  img.src = data
}

function pos(e) {
  const rect = canvasEl.value.getBoundingClientRect()
  return { x: (e.clientX - rect.left) * (W / rect.width), y: (e.clientY - rect.top) * (H / rect.height) }
}
function onDown(e) { drawing = true; start = pos(e); ctx.beginPath(); ctx.moveTo(start.x, start.y); if (tool.value === 'pen' || tool.value === 'eraser') strokeTo(start) }
function onMove(e) { if (!drawing) return; const p = pos(e); if (tool.value === 'pen' || tool.value === 'eraser') strokeTo(p); else drawShape(start, p, true) }
function onUp(e) {
  if (!drawing) return
  drawing = false
  const p = pos(e)
  if (tool.value !== 'pen' && tool.value !== 'eraser') { drawShape(start, p, false); history.push(save()) }
  else { history.push(save()) }
  if (history.length > 30) history.shift()
}
function onTouchDown(e) { const tch = e.touches[0]; onDown({ clientX: tch.clientX, clientY: tch.clientY }) }
function onTouchMove(e) { const tch = e.touches[0]; onMove({ clientX: tch.clientX, clientY: tch.clientY }) }

function strokeTo(p) {
  ctx.strokeStyle = tool.value === 'eraser' ? '#ffffff' : current.value
  ctx.lineWidth = tool.value === 'eraser' ? size.value * 3 : size.value
  ctx.lineTo(p.x, p.y)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(p.x, p.y)
}
function drawShape(a, b, preview) {
  const snapshot = history[history.length - 1]
  ctx.save()
  ctx.clearRect(0, 0, W, H)
  if (snapshot) { const img = new Image(); img.onload = () => { ctx.drawImage(img, 0, 0, W, H); paint(a, b, preview) }; img.src = snapshot }
  else paint(a, b, preview)
  ctx.restore()
}
function paint(a, b, preview) {
  ctx.strokeStyle = current.value
  ctx.lineWidth = size.value
  ctx.globalAlpha = preview ? 0.6 : 1
  ctx.beginPath()
  if (tool.value === 'line') { ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y) }
  else if (tool.value === 'rect') { ctx.rect(a.x, a.y, b.x - a.x, b.y - a.y) }
  else if (tool.value === 'ellipse') { ctx.ellipse((a.x + b.x) / 2, (a.y + b.y) / 2, Math.abs(b.x - a.x) / 2, Math.abs(b.y - a.y) / 2, 0, 0, Math.PI * 2) }
  ctx.stroke()
  ctx.globalAlpha = 1
}
function undo() {
  history.pop()
  const data = history[history.length - 1]
  if (data) { const img = new Image(); img.onload = () => { ctx.clearRect(0, 0, W, H); ctx.drawImage(img, 0, 0, W, H) }; img.src = data }
  else ctx.clearRect(0, 0, W, H)
}
function clear() { ctx.clearRect(0, 0, W, H); history.length = 0 }
function download() {
  const a = document.createElement('a')
  a.href = canvasEl.value.toDataURL('image/png')
  a.download = 'drawing.png'
  a.click()
}

onMounted(() => { resize(); window.addEventListener('resize', resize) })
onBeforeUnmount(() => window.removeEventListener('resize', resize))
</script>