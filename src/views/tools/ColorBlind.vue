<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">👁️ {{ t('color-blind-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('color-blind-desc') }}</p>
    <div class="card space-y-4">
      <div class="flex flex-wrap gap-3">
        <button v-for="item in types" :key="item.key" @click="selected=item.key" :class="['px-4 py-2 rounded-lg text-sm']" :style="{background:selected===item.key?'var(--primary)':'var(--bg)',color:selected===item.key?'white':'var(--text)'}">{{ item.label }}</button>
      </div>
      <div class="grid grid-cols-5 gap-2">
        <div v-for="c in colors" :key="c" class="aspect-square rounded-lg" :style="{backgroundColor:c,filter:getFilter()}"></div>
      </div>
      <p class="text-xs" style="color:var(--text-secondary)">{{ t('color-blind-hint') }}</p>
    </div>
  </div>
</template>
<script setup>
import{ref,computed}from'vue';import{t}from'../../i18n'
const selected=ref('normal')
const types=computed(()=>[
  {key:'normal',label:t('color-blind-normal')},{key:'protanopia',label:t('color-blind-protanopia')},
  {key:'deuteranopia',label:t('color-blind-deuteranopia')},{key:'tritanopia',label:t('color-blind-tritanopia')},
  {key:'achromatopsia',label:t('color-blind-achromatopsia')},
])
const colors=['#FF0000','#FF4500','#FFA500','#FFD700','#FFFF00','#7CFC00','#00FF00','#00FA9A','#00CED1','#1E90FF','#0000FF','#8A2BE2','#9400D3','#FF1493','#FF69B4']
function getFilter(){
  const f={normal:'',protanopia:'saturate(0.5) hue-rotate(30deg)',deuteranopia:'saturate(0.5) hue-rotate(-30deg)',tritanopia:'saturate(0.5) hue-rotate(90deg)',achromatopsia:'grayscale(100%)'}
  return f[selected.value]||''
}
</script>
