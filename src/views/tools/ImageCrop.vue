<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">✂️ {{ t('image-crop-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('image-crop-desc') }}</p>
    <div class="space-y-4">
      <div v-if="!imgSrc" class="card text-center cursor-pointer" style="border:2px dashed var(--border)"
        @click="$refs.fileInput.click()"
        @dragover.prevent="dragging=true"
        @dragleave="dragging=false"
        @drop.prevent="handleDrop">
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFile">
        <p class="text-4xl mb-2">📷</p>
        <p style="color:var(--text-secondary)">{{ t('image-crop-drop') }}</p>
      </div>

      <div v-else class="space-y-4">
        <div class="card">
          <div class="flex items-center gap-4 mb-3">
            <p class="font-medium" style="color:var(--text)">{{ t('image-crop-source') }}</p>
            <button @click="resetAll" class="btn-secondary text-sm ml-auto">✕ {{ t('image-crop-change') }}</button>
          </div>
          <div ref="containerRef" class="relative select-none overflow-hidden rounded-lg" style="background:var(--bg);line-height:0"
            @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp" @mouseleave="onMouseUp"
            @touchstart.prevent="onTouchStart" @touchmove.prevent="onTouchMove" @touchend="onMouseUp">
            <img ref="imgRef" :src="imgSrc" draggable="false" class="w-full" style="display:block;pointer-events:none" @load="onImageLoad">
            <div v-if="loaded" class="absolute" :style="overlayStyle">
              <div :style="cropBoxStyle">
                <div class="absolute w-full h-full" style="border:2px solid var(--primary);box-shadow:0 0 0 9999px rgba(0,0,0,0.45)">
                  <div class="absolute w-3 h-3" style="background:var(--primary);top:-6px;left:-6px;cursor:nw-resize" @mousedown.stop="startResize('nw',$event)"></div>
                  <div class="absolute w-3 h-3" style="background:var(--primary);top:-6px;right:-6px;cursor:ne-resize" @mousedown.stop="startResize('ne',$event)"></div>
                  <div class="absolute w-3 h-3" style="background:var(--primary);bottom:-6px;left:-6px;cursor:sw-resize" @mousedown.stop="startResize('sw',$event)"></div>
                  <div class="absolute w-3 h-3" style="background:var(--primary);bottom:-6px;right:-6px;cursor:se-resize" @mousedown.stop="startResize('se',$event)"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <p class="font-medium mb-3" style="color:var(--text)">📐 {{ t('image-crop-dimensions') }}</p>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label class="block text-xs mb-1" style="color:var(--text-secondary)">X</label>
              <input type="number" v-model.number="crop.x" min="0" :max="maxX" class="tool-input w-full text-sm" @input="syncFromInputs">
            </div>
            <div>
              <label class="block text-xs mb-1" style="color:var(--text-secondary)">Y</label>
              <input type="number" v-model.number="crop.y" min="0" :max="maxY" class="tool-input w-full text-sm" @input="syncFromInputs">
            </div>
            <div>
              <label class="block text-xs mb-1" style="color:var(--text-secondary)">{{ t('image-crop-width') }}</label>
              <input type="number" v-model.number="crop.w" min="1" :max="maxW" class="tool-input w-full text-sm" @input="syncFromInputs">
            </div>
            <div>
              <label class="block text-xs mb-1" style="color:var(--text-secondary)">{{ t('image-crop-height') }}</label>
              <input type="number" v-model.number="crop.h" min="1" :max="maxH" class="tool-input w-full text-sm" @input="syncFromInputs">
            </div>
          </div>
          <div class="flex gap-2 flex-wrap mt-3">
            <button @click="setAspect(1,1)" class="btn-secondary text-xs">1:1</button>
            <button @click="setAspect(16,9)" class="btn-secondary text-xs">16:9</button>
            <button @click="setAspect(4,3)" class="btn-secondary text-xs">4:3</button>
            <button @click="setAspect(3,4)" class="btn-secondary text-xs">3:4</button>
            <button @click="selectFullImage" class="btn-secondary text-xs">{{ t('image-crop-full') }}</button>
          </div>
        </div>

        <div class="card">
          <p class="font-medium mb-3" style="color:var(--text)">👁️ {{ t('image-crop-preview') }}</p>
          <div class="flex justify-center" style="background:var(--bg);border-radius:8px;padding:12px">
            <canvas ref="previewCanvas" class="max-w-full" style="max-height:300px;border-radius:4px;box-shadow:var(--shadow)"></canvas>
          </div>
        </div>

        <div class="flex gap-3">
          <button @click="resetAll" class="btn-secondary flex-1">↺ {{ t('reset') }}</button>
          <button @click="download" class="btn-primary flex-1">💾 {{ t('download') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, nextTick } from 'vue'
import { t } from '../../i18n'

const imgSrc = ref('')
const imgRef = ref(null)
const containerRef = ref(null)
const previewCanvas = ref(null)
const loaded = ref(false)
const dragging = ref(false)

const naturalW = ref(0)
const naturalH = ref(0)
const displayW = ref(0)
const displayH = ref(0)
const imgOffsetX = ref(0)
const imgOffsetY = ref(0)

const crop = reactive({ x: 0, y: 0, w: 100, h: 100 })

const scaleX = computed(() => naturalW.value / displayW.value)
const scaleY = computed(() => naturalH.value / displayH.value)

const maxX = computed(() => Math.max(0, naturalW.value - crop.w))
const maxY = computed(() => Math.max(0, naturalH.value - crop.h))
const maxW = computed(() => naturalW.value - crop.x)
const maxH = computed(() => naturalH.value - crop.y)

let dragType = 'move'
let dragStartX = 0
let dragStartY = 0
let dragStartCrop = { x: 0, y: 0, w: 0, h: 0 }
let aspectRatio = null

const overlayStyle = computed(() => ({
  left: imgOffsetX.value + 'px',
  top: imgOffsetY.value + 'px',
  width: displayW.value + 'px',
  height: displayH.value + 'px',
  pointerEvents: 'none'
}))

const cropBoxStyle = computed(() => ({
  position: 'absolute',
  left: (crop.x / scaleX.value) + 'px',
  top: (crop.y / scaleY.value) + 'px',
  width: (crop.w / scaleX.value) + 'px',
  height: (crop.h / scaleY.value) + 'px',
  pointerEvents: 'auto',
  cursor: 'move'
}))

function handleFile(e) {
  const file = e.target.files?.[0]
  if (file) loadImage(file)
}

function handleDrop(e) {
  dragging.value = false
  const file = e.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) loadImage(file)
}

function loadImage(file) {
  const reader = new FileReader()
  reader.onload = (e) => {
    imgSrc.value = e.target.result
  }
  reader.readAsDataURL(file)
}

function onImageLoad() {
  const el = imgRef.value
  if (!el) return
  naturalW.value = el.naturalWidth
  naturalH.value = el.naturalHeight
  displayW.value = el.clientWidth
  displayH.value = el.clientHeight

  const container = containerRef.value
  imgOffsetX.value = el.offsetLeft
  imgOffsetY.value = el.offsetTop

  const size = Math.min(naturalW.value, naturalH.value, 400)
  crop.x = Math.round((naturalW.value - size) / 2)
  crop.y = Math.round((naturalH.value - size) / 2)
  crop.w = size
  crop.h = size
  aspectRatio = null
  loaded.value = true
  nextTick(renderPreview)
}

function toNatural(clientX, clientY) {
  const el = imgRef.value
  const rect = el.getBoundingClientRect()
  const cx = (clientX - rect.left)
  const cy = (clientY - rect.top)
  return {
    x: Math.round(cx * scaleX.value),
    y: Math.round(cy * scaleY.value)
  }
}

function clampCrop() {
  crop.x = Math.max(0, Math.min(crop.x, naturalW.value - crop.w))
  crop.y = Math.max(0, Math.min(crop.y, naturalH.value - crop.h))
  crop.w = Math.max(1, Math.min(crop.w, naturalW.value - crop.x))
  crop.h = Math.max(1, Math.min(crop.h, naturalH.value - crop.y))
}

function onMouseDown(e) {
  if (!loaded.value) return
  const n = toNatural(e.clientX, e.clientY)
  dragStartX = n.x
  dragStartY = n.y
  dragStartCrop = { x: crop.x, y: crop.y, w: crop.w, h: crop.h }
  dragType = 'move'
}

function onMouseMove(e) {
  if (dragStartX === null) return
  const n = toNatural(e.clientX, e.clientY)
  const dx = n.x - dragStartX
  const dy = n.y - dragStartY
  applyDrag(dx, dy)
}

function onMouseUp() {
  dragStartX = null
}

function onTouchStart(e) {
  const touch = e.touches[0]
  onMouseDown({ clientX: touch.clientX, clientY: touch.clientY })
}

function onTouchMove(e) {
  const touch = e.touches[0]
  onMouseMove({ clientX: touch.clientX, clientY: touch.clientY })
}

function applyDrag(dx, dy) {
  if (dragType === 'move') {
    crop.x = Math.round(dragStartCrop.x + dx)
    crop.y = Math.round(dragStartCrop.y + dy)
  } else {
    applyResize(dx, dy)
  }
  clampCrop()
  nextTick(renderPreview)
}

function startResize(dir, e) {
  if (!loaded.value) return
  const n = toNatural(e.clientX, e.clientY)
  dragStartX = n.x
  dragStartY = n.y
  dragStartCrop = { x: crop.x, y: crop.y, w: crop.w, h: crop.h }
  dragType = dir
}

function applyResize(dx, dy) {
  let { x, y, w, h } = dragStartCrop
  const dir = dragType
  if (dir.includes('e') || dir === 'ne' || dir === 'se') {
    w = Math.max(10, w + dx)
  }
  if (dir.includes('w') || dir === 'nw' || dir === 'sw') {
    const newX = x + dx
    w = Math.max(10, w - dx)
    x = newX
  }
  if (dir.includes('s') || dir === 'se' || dir === 'sw') {
    h = Math.max(10, h + dy)
  }
  if (dir.includes('n') || dir === 'ne' || dir === 'nw') {
    const newY = y + dy
    h = Math.max(10, h - dy)
    y = newY
  }
  if (aspectRatio) {
    if (dir.includes('e') || dir.includes('w')) {
      h = Math.round(w / aspectRatio)
    } else {
      w = Math.round(h * aspectRatio)
    }
  }
  crop.x = Math.round(x)
  crop.y = Math.round(y)
  crop.w = Math.round(w)
  crop.h = Math.round(h)
}

function setAspect(w, h) {
  aspectRatio = w / h
  const centerX = crop.x + crop.w / 2
  const centerY = crop.y + crop.h / 2
  let newW = Math.min(crop.w, crop.h * aspectRatio)
  let newH = newW / aspectRatio
  if (newW > naturalW.value) {
    newW = naturalW.value
    newH = newW / aspectRatio
  }
  if (newH > naturalH.value) {
    newH = naturalH.value
    newW = newH * aspectRatio
  }
  crop.w = Math.round(newW)
  crop.h = Math.round(newH)
  crop.x = Math.round(Math.max(0, Math.min(centerX - crop.w / 2, naturalW.value - crop.w)))
  crop.y = Math.round(Math.max(0, Math.min(centerY - crop.h / 2, naturalH.value - crop.h)))
  nextTick(renderPreview)
}

function selectFullImage() {
  aspectRatio = null
  crop.x = 0
  crop.y = 0
  crop.w = naturalW.value
  crop.h = naturalH.value
  nextTick(renderPreview)
}

function syncFromInputs() {
  clampCrop()
  nextTick(renderPreview)
}

function renderPreview() {
  const canvas = previewCanvas.value
  if (!canvas || !imgRef.value) return
  const img = imgRef.value
  canvas.width = crop.w
  canvas.height = crop.h
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h)
}

function resetAll() {
  imgSrc.value = ''
  loaded.value = false
  dragStartX = null
  aspectRatio = null
  crop.x = 0; crop.y = 0; crop.w = 100; crop.h = 100
}

function download() {
  const canvas = previewCanvas.value
  if (!canvas) return
  const a = document.createElement('a')
  a.href = canvas.toDataURL('image/png')
  a.download = 'cropped.png'
  a.click()
}
</script>
