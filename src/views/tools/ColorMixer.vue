<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('color-mixer-title') }}</h1>
    <p class="mb-6" style="color: var(--text-secondary);">{{ t('color-mixer-desc') }}</p>
    <div class="grid md:grid-cols-2 gap-6">
      <div class="card space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs font-medium block mb-1" style="color: var(--text-secondary);">{{ t('color-mixer-color1') }}</label>
            <div class="flex items-center gap-2">
              <input type="color" v-model="color1" class="w-12 h-12 rounded-lg cursor-pointer border-0 shadow-sm">
              <input v-model="color1" class="tool-input font-mono text-sm flex-1" @input="syncColor1">
            </div>
          </div>
          <div>
            <label class="text-xs font-medium block mb-1" style="color: var(--text-secondary);">{{ t('color-mixer-color2') }}</label>
            <div class="flex items-center gap-2">
              <input type="color" v-model="color2" class="w-12 h-12 rounded-lg cursor-pointer border-0 shadow-sm">
              <input v-model="color2" class="tool-input font-mono text-sm flex-1" @input="syncColor2">
            </div>
          </div>
        </div>
        <div>
          <label class="text-xs font-medium block mb-1" style="color: var(--text-secondary);">{{ t('color-mixer-ratio') }}: {{ ratio }}%</label>
          <input type="range" v-model="ratio" min="0" max="100" class="w-full h-2 rounded-lg appearance-none cursor-pointer" style="background: var(--border);">
        </div>
        <div>
          <label class="text-xs font-medium block mb-2" style="color: var(--text-secondary);">{{ t('color-mixer-mode') }}</label>
          <div class="flex flex-wrap gap-2">
            <button v-for="mode in blendModes" :key="mode" @click="blendMode = mode"
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              :style="blendMode === mode ? 'background: var(--primary); color: white;' : 'background: var(--card-bg); color: var(--text); border: 1px solid var(--border);'">
              {{ mode }}
            </button>
          </div>
        </div>
        <div class="flex gap-2">
          <button @click="swapColors" class="btn-secondary text-sm flex-1">{{ t('color-mixer-swap') }}</button>
          <button @click="resetColors" class="btn-secondary text-sm flex-1">{{ t('reset') }}</button>
        </div>
      </div>
      <div class="card space-y-4">
        <h3 class="font-semibold" style="color: var(--text);">{{ t('result') }}</h3>
        <div class="h-32 rounded-lg shadow-inner" :style="{ backgroundColor: resultHex }"></div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs font-medium block mb-1" style="color: var(--text-secondary);">HEX</label>
            <div class="flex items-center gap-2">
              <input :value="resultHex" class="tool-input font-mono text-sm flex-1" readonly>
              <button @click="copyColor(resultHex)" class="btn-primary text-xs px-3 py-2">{{ t('copy') }}</button>
            </div>
          </div>
          <div>
            <label class="text-xs font-medium block mb-1" style="color: var(--text-secondary);">RGB</label>
            <div class="flex items-center gap-2">
              <input :value="resultRgb" class="tool-input font-mono text-sm flex-1" readonly>
              <button @click="copyColor(resultRgb)" class="btn-primary text-xs px-3 py-2">{{ t('copy') }}</button>
            </div>
          </div>
        </div>
        <div>
          <label class="text-xs font-medium block mb-1" style="color: var(--text-secondary);">{{ t('color-mixer-preview') }}</label>
          <div class="flex rounded-lg overflow-hidden h-16 shadow-inner">
            <div class="flex-1" :style="{ backgroundColor: color1 }"></div>
            <div class="flex-1" :style="{ backgroundColor: resultHex }"></div>
            <div class="flex-1" :style="{ backgroundColor: color2 }"></div>
          </div>
          <div class="flex justify-between mt-1 text-xs" style="color: var(--text-secondary);">
            <span>{{ t('color-mixer-color1') }}</span>
            <span>{{ t('result') }}</span>
            <span>{{ t('color-mixer-color2') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'

const color1 = ref('#FF6B6B')
const color2 = ref('#4ECDC4')
const ratio = ref(50)
const blendMode = ref('Normal')
const blendModes = ['Normal', 'Multiply', 'Screen', 'Overlay']

function syncColor1() {
  if (!/^#[0-9a-fA-F]{6}$/.test(color1.value)) color1.value = '#FF6B6B'
}

function syncColor2() {
  if (!/^#[0-9a-fA-F]{6}$/.test(color2.value)) color2.value = '#4ECDC4'
}

function swapColors() {
  const temp = color1.value
  color1.value = color2.value
  color2.value = temp
}

function resetColors() {
  color1.value = '#FF6B6B'
  color2.value = '#4ECDC4'
  ratio.value = 50
  blendMode.value = 'Normal'
}

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16)
  }
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => Math.min(255, Math.max(0, Math.round(x))).toString(16).padStart(2, '0')).join('')
}

function clamp(val) {
  return Math.min(255, Math.max(0, Math.round(val)))
}

function blendNormal(c1, c2, t) {
  return {
    r: c1.r + (c2.r - c1.r) * t,
    g: c1.g + (c2.g - c1.g) * t,
    b: c1.b + (c2.b - c1.b) * t
  }
}

function blendMultiply(c1, c2, t) {
  const mult = {
    r: (c1.r * c2.r) / 255,
    g: (c1.g * c2.g) / 255,
    b: (c1.b * c2.b) / 255
  }
  return blendNormal(c1, mult, t)
}

function blendScreen(c1, c2, t) {
  const scr = {
    r: 255 - ((255 - c1.r) * (255 - c2.r)) / 255,
    g: 255 - ((255 - c1.g) * (255 - c2.g)) / 255,
    b: 255 - ((255 - c1.b) * (255 - c2.b)) / 255
  }
  return blendNormal(c1, scr, t)
}

function blendOverlay(c1, c2, t) {
  const ov = {
    r: c1.r < 128 ? (2 * c1.r * c2.r) / 255 : 255 - (2 * (255 - c1.r) * (255 - c2.r)) / 255,
    g: c1.g < 128 ? (2 * c1.g * c2.g) / 255 : 255 - (2 * (255 - c1.g) * (255 - c2.g)) / 255,
    b: c1.b < 128 ? (2 * c1.b * c2.b) / 255 : 255 - (2 * (255 - c1.b) * (255 - c2.b)) / 255
  }
  return blendNormal(c1, ov, t)
}

const resultRgb = computed(() => {
  const c1 = hexToRgb(color1.value)
  const c2 = hexToRgb(color2.value)
  const t = ratio.value / 100
  let result
  switch (blendMode.value) {
    case 'Multiply': result = blendMultiply(c1, c2, t); break
    case 'Screen': result = blendScreen(c1, c2, t); break
    case 'Overlay': result = blendOverlay(c1, c2, t); break
    default: result = blendNormal(c1, c2, t)
  }
  return `rgb(${clamp(result.r)}, ${clamp(result.g)}, ${clamp(result.b)})`
})

const resultHex = computed(() => {
  const c1 = hexToRgb(color1.value)
  const c2 = hexToRgb(color2.value)
  const t = ratio.value / 100
  let result
  switch (blendMode.value) {
    case 'Multiply': result = blendMultiply(c1, c2, t); break
    case 'Screen': result = blendScreen(c1, c2, t); break
    case 'Overlay': result = blendOverlay(c1, c2, t); break
    default: result = blendNormal(c1, c2, t)
  }
  return rgbToHex(result.r, result.g, result.b)
})

function copyColor(value) {
  navigator.clipboard.writeText(value)
  window.showToast?.(t('copied'))
}
</script>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--primary);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--primary);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
</style>
