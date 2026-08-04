<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('palette') }}</h1>
    <p class="mb-6" style="color: var(--text-secondary);">{{ t('palette-desc') }}</p>
    <div class="card space-y-4">
      <div class="flex gap-4 items-end flex-wrap">
        <div>
          <label class="text-sm font-medium block mb-1" style="color: var(--text-secondary);">{{ t('palette-base') }}</label>
          <input type="color" v-model="baseColor" class="w-12 h-10 rounded cursor-pointer border-0">
        </div>
        <div>
          <label class="text-sm font-medium block mb-1" style="color: var(--text-secondary);">{{ t('palette-count') }}</label>
          <input v-model.number="count" type="number" min="3" max="10" class="tool-input w-20">
        </div>
        <div>
          <label class="text-sm font-medium block mb-1" style="color: var(--text-secondary);">{{ t('palette-harmony') }}</label>
          <select v-model="harmony" class="tool-input w-36">
            <option value="analogous">{{ t('palette-analogous') }}</option>
            <option value="complementary">{{ t('palette-complementary') }}</option>
            <option value="triadic">{{ t('palette-triadic') }}</option>
            <option value="monochromatic">{{ t('palette-monochromatic') }}</option>
          </select>
        </div>
        <button @click="generate" class="btn-primary">🎲 {{ t('generate') }}</button>
        <button @click="copyAll" class="btn-secondary">📋 {{ t('copy-all') }}</button>
      </div>
      <div class="flex rounded-xl overflow-hidden h-24 shadow-sm">
        <div v-for="(c, i) in palette" :key="i" class="flex-1 flex items-center justify-center cursor-pointer hover:flex-[1.5] transition-all" :style="{ backgroundColor: c }" @click="copyColor(c)">
          <span class="text-xs font-mono font-medium px-1.5 py-0.5 rounded opacity-0 hover:opacity-100 transition-opacity" :style="{ color: getContrast(c), backgroundColor: 'rgba(255,255,255,0.3)' }">{{ c }}</span>
        </div>
      </div>
      <div class="flex gap-2 flex-wrap">
        <div v-for="(c, i) in palette" :key="i" class="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-mono" style="background: var(--bg);">
          <div class="w-4 h-4 rounded" :style="{ backgroundColor: c }"></div>
          <span style="color: var(--text);">{{ c }}</span>
          <button @click="copyColor(c)" class="opacity-50 hover:opacity-100" style="color: var(--primary);">📋</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { t } from '../../i18n'

const baseColor = ref('#4F46E5'); const count = ref(5); const harmony = ref('analogous'); const palette = ref([])

function hexToHsl(hex) {
  const r = parseInt(hex.slice(1,3),16)/255, g = parseInt(hex.slice(3,5),16)/255, b = parseInt(hex.slice(5,7),16)/255
  const max=Math.max(r,g,b), min=Math.min(r,g,b), l=(max+min)/2
  let h=0, s=0
  if(max!==min){const d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);switch(max){case r:h=((g-b)/d+(g<b?6:0))/6;break;case g:h=((b-r)/d+2)/6;break;case b:h=((r-g)/d+4)/6;break}}
  return [Math.round(h*360),Math.round(s*100),Math.round(l*100)]
}

function hslToHex(h,s,l) {
  s/=100;l/=100;const a=s*Math.min(l,1-l)
  const f=n=>{const k=(n+h/30)%12;return Math.round((l-a*Math.max(Math.min(k-3,9-k,1),-1))*255)}
  return '#'+[f(0),f(8),f(4)].map(x=>x.toString(16).padStart(2,'0')).join('')
}

function getContrast(hex) {
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16)
  return (r*0.299+g*0.587+b*0.114)>128?'#000':'#fff'
}

function generate() {
  const [h,s,l] = hexToHsl(baseColor.value)
  const paletteArr = []
  for (let i = 0; i < count.value; i++) {
    let nh, ns, nl
    switch(harmony.value) {
      case 'analogous': nh=(h+i*30)%360; ns=s; nl=l; break
      case 'complementary': nh=(h+i*180/count.value)%360; ns=s; nl=l; break
      case 'triadic': nh=(h+i*120)%360; ns=s; nl=l; break
      case 'monochromatic': nh=h; ns=s; nl=Math.max(10,Math.min(90,l-30+i*(60/(count.value-1||1)))); break
    }
    paletteArr.push(hslToHex(nh,ns,nl))
  }
  palette.value = paletteArr
}

function copyColor(c) { navigator.clipboard.writeText(c); window.showToast?.(t('copied')) }
function copyAll() { navigator.clipboard.writeText(palette.value.join('\n')); window.showToast?.(t('copied')) }
generate()
</script>
