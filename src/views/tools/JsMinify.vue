<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('js-minify-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('js-minify-desc') }}</p>
    <div class="space-y-4">
      <textarea v-model="input" class="tool-input h-48 font-mono text-sm" :placeholder="t('js-minify-placeholder')"></textarea>
      <div class="flex gap-3">
        <button @click="beautify" class="btn-primary">✨ {{ t('js-beautify') }}</button>
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
function beautify(){let s=input.value,sb='';let ind=0;s.split('').forEach(c=>{if(c==='{'||c==='['){sb+=c+'\n'+'  '.repeat(++ind)}else if(c==='}'||c===']'){sb+='\n'+'  '.repeat(--ind)+c}else if(c===';'){sb+=';\n'+'  '.repeat(ind)}else{sb+=c}});output.value=sb}
function minify(){output.value=input.value.replace(/\/\/.*$/gm,'').replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s+/g,' ').replace(/\s*([{};,:=+<>])\s*/g,'$1').trim()}
function copy(){navigator.clipboard.writeText(output.value);window.showToast?.(t('copied'))}
</script>
