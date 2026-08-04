<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('case-converter') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('case-converter-desc') }}</p>
    <div class="space-y-4">
      <textarea v-model="input" class="tool-input h-32 font-mono text-sm" :placeholder="t('case-placeholder')"></textarea>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button v-for="c in cases" :key="c.fn" @click="convert(c.fn)" class="btn-secondary text-sm">{{ c.label }}</button>
      </div>
      <textarea v-model="output" class="tool-input h-32 font-mono text-sm" readonly style="background:var(--card-bg)"></textarea>
      <button @click="copy" class="btn-secondary">📋 {{ t('copy') }}</button>
    </div>
  </div>
</template>
<script setup>
import{ref}from'vue';import{t}from'../../i18n'
const input=ref('');const output=ref('')
const cases=[
  {label:'UPPER CASE',fn:'upper'},{label:'lower case',fn:'lower'},
  {label:'Title Case',fn:'title'},{label:'Sentence case',fn:'sentence'},
  {label:'camelCase',fn:'camel'},{label:'PascalCase',fn:'pascal'},
  {label:'snake_case',fn:'snake'},{label:'kebab-case',fn:'kebab'},
]
function convert(fn){
  const s=input.value
  if(fn==='upper')output.value=s.toUpperCase()
  else if(fn==='lower')output.value=s.toLowerCase()
  else if(fn==='title')output.value=s.replace(/\b\w/g,c=>c.toUpperCase())
  else if(fn==='sentence')output.value=s.replace(/(\.\s+|^)([a-z])/g,(m,p,c)=>p+c.toUpperCase())
  else if(fn==='camel')output.value=s.replace(/[^\w]+(.)/g,(m,c)=>c.toUpperCase()).replace(/^[A-Z]/,c=>c.toLowerCase())
  else if(fn==='pascal')output.value=s.replace(/(\w)[^\w]*/g,(m,c)=>c.toUpperCase())
  else if(fn==='snake')output.value=s.replace(/[A-Z]/g,c=>'_'+c.toLowerCase()).replace(/^_/,'').replace(/\s+/g,'_')
  else if(fn==='kebab')output.value=s.replace(/[A-Z]/g,c=>'-'+c.toLowerCase()).replace(/^-/,'').replace(/\s+/g,'-')
}
function copy(){navigator.clipboard.writeText(output.value);window.showToast?.(t('copied'))}
</script>
