<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">♿ {{ t('color-contrast-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('color-contrast-desc') }}</p>
    <div class="space-y-4">
      <div class="grid md:grid-cols-2 gap-4">
        <div class="card">
          <p class="font-medium mb-3">{{ t('color-contrast-fg') }}</p>
          <div class="flex items-center gap-4">
            <input type="color" v-model="fg" class="w-16 h-16 rounded-lg cursor-pointer border-0">
            <input v-model="fg" class="tool-input font-mono text-lg" @input="syncFg">
          </div>
        </div>
        <div class="card">
          <p class="font-medium mb-3">{{ t('color-contrast-bg') }}</p>
          <div class="flex items-center gap-4">
            <input type="color" v-model="bg" class="w-16 h-16 rounded-lg cursor-pointer border-0">
            <input v-model="bg" class="tool-input font-mono text-lg" @input="syncBg">
          </div>
        </div>
      </div>
      <div class="card">
        <div class="h-32 flex items-center justify-center font-mono text-2xl font-bold" :style="{background:bg,color:fg}">{{ t('color-contrast-sample') }} Sample Text</div>
      </div>
      <div class="grid md:grid-cols-3 gap-4">
        <div class="card text-center p-4" :style="{borderColor:ratio>=7?'#22c55e':ratio>=4.5?'#eab308':'#ef4444'}">
          <p class="text-3xl font-bold" style="color:var(--primary)">{{ ratio.toFixed(2) }}:1</p>
          <p class="text-sm" style="color:var(--text-secondary)">{{ t('color-contrast-ratio') }}</p>
        </div>
        <div class="card text-center p-4">
          <p class="font-medium mb-2" style="color:var(--text-secondary)">WCAG AA</p>
          <p class="text-2xl font-bold" :style="{color:aaNormal?'#22c55e':'#ef4444'}">{{ aaNormal?t('color-contrast-pass'):t('color-contrast-fail') }}</p>
          <p class="text-xs mt-1" style="color:var(--text-secondary)">{{ t('color-contrast-normal') }} ≥4.5</p>
          <p class="text-xs" :style="{color:aaLarge?'#22c55e':'#ef4444'}">{{ t('color-contrast-large') }} ≥3.0: {{ aaLarge?t('color-contrast-pass'):t('color-contrast-fail') }}</p>
        </div>
        <div class="card text-center p-4">
          <p class="font-medium mb-2" style="color:var(--text-secondary)">WCAG AAA</p>
          <p class="text-2xl font-bold" :style="{color:aaaNormal?'#22c55e':'#ef4444'}">{{ aaaNormal?t('color-contrast-pass'):t('color-contrast-fail') }}</p>
          <p class="text-xs mt-1" style="color:var(--text-secondary)">{{ t('color-contrast-normal') }} ≥7.0</p>
          <p class="text-xs" :style="{color:aaaLarge?'#22c55e':'#ef4444'}">{{ t('color-contrast-large') }} ≥4.5: {{ aaaLarge?t('color-contrast-pass'):t('color-contrast-fail') }}</p>
        </div>
      </div>
      <div class="card">
        <p class="font-medium mb-3">{{ t('color-contrast-suggest') }}</p>
        <div class="grid grid-cols-5 gap-2">
          <div v-for="c in suggestions" :key="c" class="aspect-square rounded-lg cursor-pointer hover:scale-105 transition" :style="{background:c}" @click="fg=c"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import{t}from'../../i18n'
const fg = ref('#1e293b'); const bg = ref('#ffffff')
const syncFg = () => { if(!/^#[0-9a-fA-F]{6}$/.test(fg.value)) fg.value = '#1e293b' }
const syncBg = () => { if(!/^#[0-9a-fA-F]{6}$/.test(bg.value)) bg.value = '#ffffff' }
function luminance(hex) { const r = parseInt(hex.slice(1,3),16)/255; const g = parseInt(hex.slice(3,5),16)/255; const b = parseInt(hex.slice(5,7),16)/255; const c = [r,g,b].map(v=>v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)); return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2] }
const ratio = computed(() => { const L1 = luminance(fg.value); const L2 = luminance(bg.value); return (Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05) })
const aaNormal = computed(() => ratio.value >= 4.5); const aaLarge = computed(() => ratio.value >= 3)
const aaaNormal = computed(() => ratio.value >= 7); const aaaLarge = computed(() => ratio.value >= 4.5)
const suggestions = computed(() => { const base = luminance(bg.value) > 0.5 ? '#000000' : '#ffffff'; const steps = [0,0.15,0.3,0.5,0.7,1].map(t=>{const L=base==='#000000'?t:1-t; const c=Math.round(L*255); return '#'+c.toString(16).padStart(2,'0').repeat(3)}); return steps })
</script>
