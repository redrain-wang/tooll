<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('color-picker-title') }}</h1>
    <p class="mb-6" style="color: var(--text-secondary);">{{ t('color-picker-desc') }}</p>
    <div class="grid md:grid-cols-2 gap-6">
      <div class="card space-y-4">
        <div class="flex items-center gap-4">
          <input type="color" v-model="hex" class="w-20 h-20 rounded-lg cursor-pointer border-0 shadow-sm">
          <div class="flex-1 space-y-2">
            <div>
              <label class="text-xs font-medium block mb-1" style="color: var(--text-secondary);">HEX</label>
              <input v-model="hex" class="tool-input font-mono text-sm" @input="fromHex">
            </div>
            <div>
              <label class="text-xs font-medium block mb-1" style="color: var(--text-secondary);">RGB</label>
              <input v-model="rgb" class="tool-input font-mono text-sm" @input="fromRgb">
            </div>
            <div>
              <label class="text-xs font-medium block mb-1" style="color: var(--text-secondary);">HSL</label>
              <input v-model="hsl" class="tool-input font-mono text-sm" @input="fromHsl">
            </div>
          </div>
        </div>
        <div class="flex gap-2">
          <button @click="copyColor(hex)" class="btn-secondary text-xs flex-1">{{ t('copy') }} HEX</button>
          <button @click="copyColor(rgb)" class="btn-secondary text-xs flex-1">{{ t('copy') }} RGB</button>
          <button @click="copyColor(hsl)" class="btn-secondary text-xs flex-1">{{ t('copy') }} HSL</button>
        </div>
        <div>
          <p class="text-sm font-medium mb-2" style="color: var(--text-secondary);">{{ t('common-colors') }}</p>
          <div class="flex flex-wrap gap-2">
            <button v-for="c in presetColors" :key="c" @click="setColor(c)" class="w-8 h-8 rounded-lg border-2 hover:scale-110 transition-transform cursor-pointer" :style="{ backgroundColor: c, borderColor: hex === c ? 'var(--primary)' : 'var(--border)' }" :title="c"></button>
          </div>
        </div>
      </div>
      <div class="card space-y-4">
        <h3 class="font-semibold" style="color: var(--text);">{{ t('color-contrast-ratio') }}</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs font-medium block mb-1" style="color: var(--text-secondary);">{{ t('color-contrast-fg') }}</label>
            <div class="flex items-center gap-2">
              <input type="color" v-model="fgColor" class="w-10 h-10 rounded cursor-pointer border-0">
              <input v-model="fgColor" class="tool-input font-mono text-xs flex-1">
            </div>
          </div>
          <div>
            <label class="text-xs font-medium block mb-1" style="color: var(--text-secondary);">{{ t('color-contrast-bg') }}</label>
            <div class="flex items-center gap-2">
              <input type="color" v-model="bgColor" class="w-10 h-10 rounded cursor-pointer border-0">
              <input v-model="bgColor" class="tool-input font-mono text-xs flex-1">
            </div>
          </div>
        </div>
        <div class="p-4 rounded-lg text-center" :style="{ backgroundColor: bgColor, color: fgColor, border: '1px solid var(--border)' }">
          <p class="text-2xl font-bold">Aa</p>
          <p class="text-sm">{{ t('color-contrast-sample') }}</p>
        </div>
        <div class="text-center">
          <p class="text-3xl font-bold" style="color: var(--primary);">{{ contrastRatio }}</p>
          <p class="text-sm" style="color: var(--text-secondary);">{{ t('color-contrast-ratio') }}</p>
        </div>
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div class="p-2 rounded text-center" :style="{ background: wcagResults.aaNormal ? '#dcfce7' : '#fee2e2', color: wcagResults.aaNormal ? '#16a34a' : '#dc2626' }">
            AA Normal: {{ wcagResults.aaNormal ? '✓' : '✗' }}
          </div>
          <div class="p-2 rounded text-center" :style="{ background: wcagResults.aaLarge ? '#dcfce7' : '#fee2e2', color: wcagResults.aaLarge ? '#16a34a' : '#dc2626' }">
            AA Large: {{ wcagResults.aaLarge ? '✓' : '✗' }}
          </div>
          <div class="p-2 rounded text-center" :style="{ background: wcagResults.aaaNormal ? '#dcfce7' : '#fee2e2', color: wcagResults.aaaNormal ? '#16a34a' : '#dc2626' }">
            AAA Normal: {{ wcagResults.aaaNormal ? '✓' : '✗' }}
          </div>
          <div class="p-2 rounded text-center" :style="{ background: wcagResults.aaaLarge ? '#dcfce7' : '#fee2e2', color: wcagResults.aaaLarge ? '#16a34a' : '#dc2626' }">
            AAA Large: {{ wcagResults.aaaLarge ? '✓' : '✗' }}
          </div>
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
const fgColor = ref('#000000')
const bgColor = ref('#FFFFFF')

const presetColors = ['#EF4444','#F97316','#EAB308','#22C55E','#3B82F6','#8B5CF6','#EC4899','#F43F5E','#14B8A6','#6366F1','#000000','#FFFFFF']

watch(hex, fromHex, { immediate: true })

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

function setColor(c) { hex.value = c; fromHex() }

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

function copyColor(v) { navigator.clipboard.writeText(v); window.showToast?.(t('copied')) }

// Contrast ratio
function parseColor(c) {
  if (c.startsWith('#')) {
    const h = c.slice(1)
    return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)]
  }
  const m = c.match(/\d+/g)
  return m ? m.slice(0,3).map(Number) : [0,0,0]
}

function luminance(r,g,b) {
  const [rs,gs,bs] = [r,g,b].map(c => { c /= 255; return c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4) })
  return 0.2126*rs + 0.7152*gs + 0.0722*bs
}

const contrastRatio = computed(() => {
  const [r1,g1,b1] = parseColor(fgColor.value)
  const [r2,g2,b2] = parseColor(bgColor.value)
  const l1 = luminance(r1,g1,b1)
  const l2 = luminance(r2,g2,b2)
  const lighter = Math.max(l1,l2)
  const darker = Math.min(l1,l2)
  return ((lighter + 0.05)/(darker + 0.05)).toFixed(2)
})

const wcagResults = computed(() => {
  const ratio = parseFloat(contrastRatio.value)
  return {
    aaNormal: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaaNormal: ratio >= 7,
    aaaLarge: ratio >= 4.5
  }
})
</script>
