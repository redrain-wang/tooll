<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('barcode-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('barcode-desc') }}</p>
    <div class="space-y-4">
      <input v-model="text" class="tool-input" :placeholder="t('barcode-placeholder')" @input="generate">
      <div v-if="bars.length" class="card flex flex-col items-center gap-4">
        <div class="flex" style="height:120px">
          <div v-for="(b,i) in bars" :key="i" :style="{width:'2px',backgroundColor:b?'black':'white',marginRight:'1px'}"></div>
        </div>
        <p class="font-mono text-sm" style="color:var(--text)">{{ text }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import{ref}from'vue'
import{t}from'../../i18n'
const text=ref('');const bars=ref([])
function generate(){
  if(!text.value){bars.value=[];return}
  const str=text.value;const b=[]
  for(let i=0;i<str.length;i++){
    const code=str.charCodeAt(i)
    for(let j=7;j>=0;j--)b.push((code>>j)&1)
  }
  bars.value=b
}
</script>
