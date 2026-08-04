<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('css-minify-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('css-minify-desc') }}</p>
    <div class="space-y-4">
      <textarea v-model="input" class="tool-input h-48 font-mono text-sm" :placeholder="t('css-minify-placeholder')"></textarea>
      <div class="flex gap-3">
        <button @click="beautify" class="btn-primary">✨ {{ t('css-beautify') }}</button>
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
function beautify(){output.value=input.value.replace(/\{/g,' {\n  ').replace(/\}/g,'\n}').replace(/;\s*\n/g,';\n  ').replace(/;\n  \n/g,';\n')}
function minify(){output.value=input.value.replace(/\s*\{\s*/g,'{').replace(/\s*\}\s*/g,'}').replace(/\s*:\s*/g,':').replace(/\s*;\s*/g,';').replace(/\s*,\s*/g,',').trim()}
function copy(){navigator.clipboard.writeText(output.value);window.showToast?.(t('copied'))}
</script>
