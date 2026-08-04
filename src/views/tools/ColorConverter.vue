<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('color') }}</h1>
    <p class="mb-6" style="color: var(--text-secondary);">{{ t('color-desc') }}</p>
    <div class="space-y-6">
      <div class="flex items-center gap-4">
        <input type="color" v-model="hex" class="w-16 h-16 rounded-lg cursor-pointer border-0 shadow-sm">
        <div class="flex-1">
          <input v-model="hex" class="tool-input font-mono" placeholder="#4F46E5" @input="fromHex">
        </div>
      </div>
      <div class="grid md:grid-cols-3 gap-4">
        <div class="card">
          <label class="text-sm font-medium block mb-2" style="color: var(--text-secondary);">HEX</label>
          <input v-model="hex" class="tool-input font-mono text-sm" @input="fromHex">
          <button @click="copyVal(hex)" class="btn-secondary text-xs w-full mt-2">{{ t('copy') }}</button>
        </div>
        <div class="card">
          <label class="text-sm font-medium block mb-2" style="color: var(--text-secondary);">RGB</label>
          <input v-model="rgb" class="tool-input font-mono text-sm" @input="fromRgb">
          <button @click="copyVal(rgb)" class="btn-secondary text-xs w-full mt-2">{{ t('copy') }}</button>
        </div>
        <div class="card">
          <label class="text-sm font-medium block mb-2" style="color: var(--text-secondary);">HSL</label>
          <input v-model="hsl" class="tool-input font-mono text-sm" @input="fromHsl">
          <button @click="copyVal(hsl)" class="btn-secondary text-xs w-full mt-2">{{ t('copy') }}</button>
        </div>
      </div>
      <!-- Color preview with hex display -->
      <div class="rounded-xl h-28 border flex items-center justify-center transition-colors" :style="{ backgroundColor: hex, borderColor: 'var(--border)' }">
        <span class="font-mono text-sm px-3 py-1 rounded" :style="{ color: textColor, backgroundColor: 'rgba(255,255,255,0.8)' }">{{ hex }}</span>
      </div>
      <!-- Quick colors -->
      <div class="card">
        <p class="text-sm font-medium mb-3" style="color: var(--text-secondary);">{{ t('common-colors') }}</p>
        <div class="flex flex-wrap gap-2">
          <button v-for="c in presetColors" :key="c" @click="setColor(c)" class="w-8 h-8 rounded-lg border-2 hover:scale-110 transition-transform cursor-pointer" :style="{ backgroundColor: c, borderColor: hex === c ? 'var(--primary)' : 'var(--border)' }" :title="c"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { t } from '../../i18n'

const hex = ref('#4F46E5')
const rgb = ref('rgb(79, 70, 229)')
const hsl = ref('hsl(245, 75%, 59%)')

watch(hex, fromHex, { immediate: true })

const presetColors = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899', '#F43F5E', '#14B8A6', '#6366F1', '#000000', '#FFFFFF']

// Watch hex input from color picker - auto convert
function fromHex() {
  let h = hex.value
  if (!h.startsWith('#')) h = '#' + h
  if (h.length < 7) return
  const r = parseInt(h.slice(1,3), 16)
  const g = parseInt(h.slice(3,5), 16)
  const b = parseInt(h.slice(5,7), 16)
  if (isNaN(r) || isNaN(g) || isNaN(b)) return
  rgb.value = `rgb(${r}, ${g}, ${b})`
  const [hue,sat,lit] = rgbToHsl(r,g,b)
  hsl.value = `hsl(${hue}, ${sat}%, ${lit}%)`
}

function fromRgb() {
  const m = rgb.value.match(/\d+/g)
  if (!m || m.length < 3) return
  const [r,g,b] = m.map(Number)
  hex.value = '#' + [r,g,b].map(x => Math.min(255,Math.max(0,x)).toString(16).padStart(2,'0')).join('')
  const [hue,sat,lit] = rgbToHsl(r,g,b)
  hsl.value = `hsl(${hue}, ${sat}%, ${lit}%)`
}

function fromHsl() {
  const m = hsl.value.match(/\d+/g)
  if (!m || m.length < 3) return
  const [hue,sat,lit] = m.map(Number)
  const [r,g,b] = hslToRgb(hue,sat,lit)
  hex.value = '#' + [r,g,b].map(x => x.toString(16).padStart(2,'0')).join('')
  rgb.value = `rgb(${r}, ${g}, ${b})`
}

function setColor(c) {
  hex.value = c
  fromHex()
}

// Calculate contrasting text color for preview
const textColor = computed(() => {
  const h = hex.value.replace('#', '')
  const r = parseInt(h.slice(0,2), 16)
  const g = parseInt(h.slice(2,4), 16)
  const b = parseInt(h.slice(4,6), 16)
  return (r * 0.299 + g * 0.587 + b * 0.114) > 128 ? '#000000' : '#FFFFFF'
})

function rgbToHsl(r,g,b) {
  r/=255; g/=255; b/=255
  const max=Math.max(r,g,b), min=Math.min(r,g,b)
  let h,s,l=(max+min)/2
  if(max===min){h=s=0}else{
    const d=max-min;s=l>0.5?d/(2-max-min):d/(max+min)
    switch(max){case r:h=((g-b)/d+(g<b?6:0))/6;break;case g:h=((b-r)/d+2)/6;break;case b:h=((r-g)/d+4)/6;break}
  }
  return [Math.round(h*360),Math.round(s*100),Math.round(l*100)]
}

function hslToRgb(h,s,l) {
  s/=100;l/=100
  const a=s*Math.min(l,1-l)
  const f=n=>{const k=(n+h/30)%12;return l-a*Math.max(Math.min(k-3,9-k,1),-1)}
  return [Math.round(f(0)*255),Math.round(f(8)*255),Math.round(f(4)*255)]
}

function copyVal(v) { navigator.clipboard.writeText(v); window.showToast?.(t('copied')) }
</script>
