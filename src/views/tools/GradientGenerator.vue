<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('gradient-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('gradient-desc') }}</p>
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div><label class="text-sm block mb-1" style="color:var(--text-secondary)">{{ t('gradient-color1') }}</label><input type="color" v-model="c1" class="w-full h-10 rounded cursor-pointer border-0"></div>
        <div><label class="text-sm block mb-1" style="color:var(--text-secondary)">{{ t('gradient-color2') }}</label><input type="color" v-model="c2" class="w-full h-10 rounded cursor-pointer border-0"></div>
      </div>
      <div><label class="text-sm block mb-1" style="color:var(--text-secondary)">{{ t('gradient-type') }}</label>
        <select v-model="type" class="tool-input"><option value="linear">{{ t('gradient-linear') }}</option><option value="radial">{{ t('gradient-radial') }}</option></select>
      </div>
      <div v-if="type==='linear'"><label class="text-sm block mb-1" style="color:var(--text-secondary)">{{ t('gradient-angle') }}: {{ angle }}°</label><input v-model.number="angle" type="range" min="0" max="360" class="w-full"></div>
      <div class="h-32 rounded-xl" :style="{background:gradient}"></div>
      <div class="relative">
        <code class="block p-3 rounded-lg font-mono text-xs break-all" style="background:var(--bg);color:var(--primary)">{{ gradient }}</code>
        <button @click="copy" class="absolute top-2 right-2 btn-secondary text-xs">📋</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import{ref,computed}from'vue';import{t}from'../../i18n'
const c1=ref('#4F46E5');const c2=ref('#EC4899');const type=ref('linear');const angle=ref(135)
const gradient=computed(()=>type.value==='linear'?`linear-gradient(${angle.value}deg, ${c1.value}, ${c2.value})`:`radial-gradient(circle, ${c1.value}, ${c2.value})`)
function copy(){navigator.clipboard.writeText(gradient.value);window.showToast?.(t('copied'))}
</script>
