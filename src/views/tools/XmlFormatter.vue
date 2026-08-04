<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('xml-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('xml-desc') }}</p>
    <div class="space-y-4">
      <textarea v-model="input" class="tool-input h-48 font-mono text-sm" :placeholder="t('xml-placeholder')"></textarea>
      <div class="flex gap-3">
        <button @click="format" class="btn-primary">✨ {{ t('xml-format') }}</button>
        <button @click="compress" class="btn-secondary">📦 {{ t('compress') }}</button>
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
  let xml=input.value;let formatted='';let indent=0
  xml.split(/(>.*?<)/g).forEach(node=>{
    if(node.match(/^\//)){indent--;formatted+='  '.repeat(indent)+node+'\n'}
    else if(node.match(/^<\?/)){formatted+='  '.repeat(indent)+node+'\n'}
    else if(node.replace(/<\/[\w:-]+>/,'').length>0){
      if(node.startsWith('</')){formatted+='  '.repeat(indent)+node+'\n'}
      else{formatted+='  '.repeat(indent)+node+'\n';indent++}
    }
  })
  output.value=formatted.trim()
}
function compress(){output.value=input.value.replace(/\s+/g,' ').replace(/\s*<\//g,'</').replace(/\s*>/g,'>').trim()}
function copy(){navigator.clipboard.writeText(output.value);window.showToast?.(t('copied'))}
</script>
