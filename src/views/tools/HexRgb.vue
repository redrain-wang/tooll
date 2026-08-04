<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('hex-rgb-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('hex-rgb-desc') }}</p>
    <div class="card space-y-4">
      <div class="flex gap-4 items-center">
        <input type="color" v-model="color" class="w-16 h-16 rounded-lg cursor-pointer border-0">
        <div class="flex-1"><p class="text-sm" style="color:var(--text-secondary)">{{ t('hex-rgb-current') }}</p><p class="font-mono text-lg font-bold" style="color:var(--text)">{{ color }}</p></div>
      </div>
      <div>
        <p class="text-sm mb-2" style="color:var(--text-secondary)">{{ t('hex-rgb-variations') }}</p>
        <div class="flex rounded-xl overflow-hidden h-16">
          <div v-for="(c,i) in shades" :key="i" class="flex-1 flex items-center justify-center text-xs font-mono" :style="{background:c,color:i>4?'white':'black'}" @click="copy(c)">{{ c }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import{ref,computed}from'vue';import{t}from'../../i18n'
const color=ref('#4F46E5')
const shades=computed(()=>{
  const hex=color.value.replace('#','')
  const r=parseInt(hex.slice(0,2),16),g=parseInt(hex.slice(2,4),16),b=parseInt(hex.slice(4,6),16)
  return[10,20,30,40,50,60,70,80,90].map(l=>{
    const f=(v)=>Math.round(v*l/100+(l<50?0:255*(1-l/100)))
    return '#'+[f(r),f(g),f(b)].map(v=>Math.min(255,Math.max(0,v)).toString(16).padStart(2,'0')).join('')
  })
})
function copy(c){navigator.clipboard.writeText(c);window.showToast?.(t('copied'))}
</script>
