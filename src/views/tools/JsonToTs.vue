<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('json-to-ts') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('json-to-ts-desc') }}</p>
    <div class="space-y-4">
      <textarea v-model="input" class="tool-input h-64 font-mono text-sm" placeholder='{"name":"John","age":30}'></textarea>
      <div class="flex gap-3 flex-wrap">
        <button @click="convert" class="btn-primary">✨ {{ t('generate') }}</button>
        <button @click="copy" class="btn-secondary">📋 {{ t('copy') }}</button>
      </div>
      <textarea v-model="output" class="tool-input h-64 font-mono text-sm" readonly style="background:var(--card-bg)" :placeholder="t('output')"></textarea>
    </div>
  </div>
</template>
<script setup>
import{ref}from'vue';import{t}from'../../i18n'
const input=ref('');const output=ref('')
function inferType(val,prefix='Root'){
  if(val===null)return'any'
  if(Array.isArray(val)){
    if(!val.length)return'any[]'
    return inferType(val[0],prefix)+'[]'
  }
  if(typeof val==='object'){
    const lines=Object.entries(val).map(([k,v])=>{
      const safe=k.match(/^[a-zA-Z_$][\w$]*$/)?k:`"${k}"`
      return `  ${safe}: ${inferType(v,k)};`
    })
    return`{\n${lines.join('\n')}\n}`
  }
  if(typeof val==='string')return'string'
  if(typeof val==='number')return Number.isInteger(val)?'number':'number'
  if(typeof val==='boolean')return'boolean'
  return'any'
}
function convert(){
  try{
    const obj=JSON.parse(input.value)
    output.value=`interface Root ${inferType(obj)}`
  }catch(e){output.value='// '+e.message}
}
function copy(){navigator.clipboard.writeText(output.value);window.showToast?.(t('copied'))}
</script>
