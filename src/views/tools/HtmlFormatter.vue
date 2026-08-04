<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('html-fmt-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('html-fmt-desc') }}</p>
    <div class="space-y-4">
      <textarea v-model="input" class="tool-input h-48 font-mono text-sm" :placeholder="t('html-fmt-placeholder')"></textarea>
      <div class="flex gap-3">
        <button @click="format" class="btn-primary">✨ {{ t('format') }}</button>
        <button @click="minify" class="btn-secondary">📦 {{ t('compress') }}</button>
        <button @click="copy" class="btn-secondary">📋 {{ t('copy') }}</button>
      </div>
      <textarea v-model="output" class="tool-input h-48 font-mono text-sm" readonly style="background:var(--card-bg)"></textarea>
    </div>
  </div>
</template>
<script setup>
import{ref}from'vue';import{t}from'../../i18n'
const input=ref('');const output=ref('')
function format(){
  let s=input.value,ind=0,out='';
  s.replace(/(>)(<)(\/*)/g,'$1\n$2$3').split(/\r?\n/).forEach(line=>{
    if(line.match(/^<\//))ind--;out+='  '.repeat(Math.max(0,ind))+line.trim()+'\n';
    if(!line.match(/^<\//)&&!line.match(/\/\>$|\/\/>/)&&line.match(/^</))ind++
  });output.value=out.trim()
}
function minify(){output.value=input.value.replace(/\s+/g,' ').replace(/\s*<\//g,'</').replace(/\s*>/g,'>').trim()}
function copy(){navigator.clipboard.writeText(output.value);window.showToast?.(t('copied'))}
</script>
