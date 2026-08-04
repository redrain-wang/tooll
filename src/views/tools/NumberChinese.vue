<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('number-chinese-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('number-chinese-desc') }}</p>
    <div class="card space-y-4">
      <input v-model="input" type="number" class="tool-input text-lg" :placeholder="t('number-chinese-placeholder')">
      <button @click="convert" class="btn-primary w-full">{{ t('number-chinese-convert') }}</button>
      <div v-if="result" class="space-y-3">
        <div class="p-3 rounded-lg" style="background:var(--bg)">
          <p class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('number-chinese-lower') }}</p>
          <p class="text-lg font-bold" style="color:var(--primary)">{{ result.lower }}</p>
        </div>
        <div class="p-3 rounded-lg" style="background:var(--bg)">
          <p class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('number-chinese-upper') }}</p>
          <p class="text-lg font-bold" style="color:var(--primary)">{{ result.upper }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import{ref}from'vue'
import{t}from'../../i18n'
const input=ref('');const result=ref(null)
const lower='零一二三四五六七八九';const upper='零壹贰叁肆伍陆柒捌玖'
function convert(){
  const n=parseInt(input.value);if(isNaN(n)){return}
  const str=String(Math.abs(n));const sign=n<0?t('number-chinese-negative'):''
  let l='',u=''
  for(const c of str){l+=lower[parseInt(c)];u+=upper[parseInt(c)]}
  result.value={lower:sign+l,upper:sign+u}
}
</script>
