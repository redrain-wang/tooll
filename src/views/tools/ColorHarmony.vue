<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('color-harmony-title') }}</h1>
    <p class="mb-6" style="color: var(--text-secondary);">{{ t('color-harmony-desc') }}</p>
    <div class="card space-y-4">
      <div class="flex gap-4 items-end flex-wrap">
        <div>
          <label class="text-sm font-medium block mb-1" style="color: var(--text-secondary);">{{ t('color-harmony-base') }}</label>
          <div class="flex items-center gap-2">
            <input type="color" v-model="baseColor" class="w-12 h-10 rounded cursor-pointer border-0">
            <input v-model="baseColor" class="tool-input font-mono text-sm w-28">
          </div>
        </div>
        <div>
          <label class="text-sm font-medium block mb-1" style="color: var(--text-secondary);">{{ t('color-harmony-type') }}</label>
          <select v-model="harmonyType" class="tool-input w-48">
            <option value="complementary">{{ t('color-harmony-complementary') }}</option>
            <option value="analogous">{{ t('color-harmony-analogous') }}</option>
            <option value="triadic">{{ t('color-harmony-triadic') }}</option>
            <option value="split">{{ t('color-harmony-split') }}</option>
            <option value="tetradic">{{ t('color-harmony-tetradic') }}</option>
          </select>
        </div>
        <button @click="generate" class="btn-primary">🎨 {{ t('generate') }}</button>
        <button @click="copyAll" class="btn-secondary">📋 {{ t('copy-all') }}</button>
      </div>

      <div class="flex rounded-xl overflow-hidden h-28 shadow-sm">
        <div
          v-for="(c, i) in scheme"
          :key="i"
          class="flex-1 flex items-center justify-center cursor-pointer hover:flex-[1.5] transition-all relative group"
          :style="{ backgroundColor: c }"
          @click="copyColor(c)"
        >
          <span
            class="text-xs font-mono font-medium px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            :style="{ color: getContrast(c), backgroundColor: 'rgba(255,255,255,0.3)' }"
          >{{ c }}</span>
        </div>
      </div>

      <div class="flex gap-2 flex-wrap">
        <div v-for="(c, i) in scheme" :key="i" class="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-mono" style="background: var(--bg);">
          <div class="w-4 h-4 rounded" :style="{ backgroundColor: c }"></div>
          <span style="color: var(--text);">{{ c }}</span>
          <button @click="copyColor(c)" class="opacity-50 hover:opacity-100" style="color: var(--primary);">📋</button>
        </div>
      </div>

      <div class="p-3 rounded-lg text-sm" style="background: var(--bg); color: var(--text-secondary);">
        <span class="font-medium" style="color: var(--text);">{{ t('color-harmony-scheme') }}:</span>
        {{ harmonyDescription }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { t, locale } from '../../i18n'

const baseColor = ref('#4F46E5')
const harmonyType = ref('complementary')
const scheme = ref([])

const harmonyDescriptions = {
  complementary: { en: 'Base + opposite on color wheel (180°)', zh: '基础色 + 色轮对侧 (180°)' },
  analogous: { en: 'Base + adjacent colors (±30°)', zh: '基础色 + 相邻色 (±30°)' },
  triadic: { en: 'Three equally spaced colors (120°)', zh: '三等分色轮 (120°)' },
  split: { en: 'Base + two colors adjacent to complement', zh: '基础色 + 互补色两侧邻近色' },
  tetradic: { en: 'Four colors forming a rectangle on the wheel', zh: '四色矩形分布' }
}

const harmonyDescription = computed(() => {
  const d = harmonyDescriptions[harmonyType.value]
  return d?.[locale.value] || d?.en || ''
})

function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2
  let h = 0, s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = n => {
    const k = (n + h / 30) % 12
    return Math.round((l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)) * 255)
  }
  return '#' + [f(0), f(8), f(4)].map(x => x.toString(16).padStart(2, '0')).join('')
}

function generate() {
  const [h, s, l] = hexToHsl(baseColor.value)
  let angles = []
  switch (harmonyType.value) {
    case 'complementary':
      angles = [0, 180]
      break
    case 'analogous':
      angles = [-30, -15, 0, 15, 30]
      break
    case 'triadic':
      angles = [0, 120, 240]
      break
    case 'split':
      angles = [0, 150, 210]
      break
    case 'tetradic':
      angles = [0, 90, 180, 270]
      break
  }
  scheme.value = angles.map(a => hslToHex((h + a + 360) % 360, s, l))
}

function getContrast(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 0.299 + g * 0.587 + b * 0.114) > 128 ? '#000' : '#fff'
}

function copyColor(c) {
  navigator.clipboard.writeText(c)
  window.showToast?.(t('copied'))
}

function copyAll() {
  navigator.clipboard.writeText(scheme.value.join('\n'))
  window.showToast?.(t('copied'))
}

generate()
</script>
