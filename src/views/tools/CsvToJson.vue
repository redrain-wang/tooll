<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('csv-to-json') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('csv-to-json-desc') }}</p>
    <div class="space-y-4">
      <textarea v-model="input" class="tool-input h-64 font-mono text-sm" placeholder="name,age,city&#10;John,30,NYC&#10;Jane,25,London"></textarea>
      <div class="flex gap-2 items-center flex-wrap">
        <label class="flex items-center gap-1 text-sm" style="color:var(--text-secondary)">
          <input type="checkbox" v-model="pretty"> Pretty Print
        </label>
      </div>
      <div class="flex gap-3 flex-wrap">
        <button @click="convert" class="btn-primary">✨ {{ t('convert') }}</button>
        <button @click="copy" class="btn-secondary">📋 {{ t('copy') }}</button>
      </div>
      <textarea v-model="output" class="tool-input h-64 font-mono text-sm" readonly style="background:var(--card-bg)" :placeholder="t('output')"></textarea>
    </div>
  </div>
</template>
<script setup>
import{ref}from'vue';import{t}from'../../i18n'
const input=ref('');const output=ref('');const pretty=ref(true)
function parseCsvLine(line){
  const result=[];let current='';let inQuote=false
  for(let i=0;i<line.length;i++){
    const c=line[i]
    if(inQuote){
      if(c==='"'){if(line[i+1]==='"'){current+='"';i++}else{inQuote=false}}
      else current+=c
    }else{
      if(c==='"')inQuote=true
      else if(c===','){result.push(current);current=''}
      else current+=c
    }
  }
  result.push(current);return result
}
function convert(){
  const lines=input.value.trim().split('\n').filter(l=>l.trim())
  if(lines.length<2){output.value='Need at least header + 1 row';return}
  const headers=parseCsvLine(lines[0])
  const arr=lines.slice(1).map(line=>{
    const vals=parseCsvLine(line)
    const obj={}
    headers.forEach((h,i)=>{obj[h.trim()]=vals[i]??''})
    return obj
  })
  output.value=JSON.stringify(arr,null,pretty.value?2:0)
}
function copy(){navigator.clipboard.writeText(output.value);window.showToast?.(t('copied'))}
</script>
