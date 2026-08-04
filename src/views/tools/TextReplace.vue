<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('text-replace') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('text-replace-desc') }}</p>
    <div class="space-y-4">
      <textarea v-model="input" class="tool-input h-40 font-mono text-sm" :placeholder="t('text-replace-placeholder-src')"></textarea>
      <div class="grid md:grid-cols-2 gap-4">
        <input v-model="find" class="tool-input font-mono text-sm" :placeholder="t('text-replace-placeholder-find')">
        <input v-model="replace" class="tool-input font-mono text-sm" :placeholder="t('text-replace-placeholder-replace')">
      </div>
      <div class="flex gap-3 flex-wrap">
        <label class="flex items-center gap-2 text-sm"><input type="checkbox" v-model="regex" class="rounded"> {{ t('text-replace-regex') }}</label>
        <label class="flex items-center gap-2 text-sm"><input type="checkbox" v-model="ignoreCase" class="rounded"> {{ t('ignore-case') }}</label>
        <button @click="doReplace" class="btn-primary">{{ t('text-replace-btn') }}</button>
        <button @click="copy" class="btn-secondary">📋 {{ t('copy') }}</button>
        <span class="text-sm self-center" style="color:var(--text-secondary)">{{ t('text-replace-btn') }} {{ count }} {{ t('text-replace-occurrences') }}</span>
      </div>
      <textarea v-model="output" class="tool-input h-40 font-mono text-sm" readonly style="background:var(--card-bg)"></textarea>
    </div>
  </div>
</template>
<script setup>
import{ref}from'vue';import{t}from'../../i18n'
const input=ref('');const output=ref('');const find=ref('');const replace=ref('');const regex=ref(false);const ignoreCase=ref(false);const count=ref(0)
function doReplace(){
  let flags=ignoreCase.value?'gi':'g';let re
  try{re=regex.value?new RegExp(find.value,flags):new RegExp(find.value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),flags)}catch(e){output.value=e.message;return}
  output.value=input.value.replace(re,replace.value);count.value=(input.value.match(re)||[]).length;window.showToast?.('OK')
}
function copy(){navigator.clipboard.writeText(output.value);window.showToast?.(t('copied'))}
</script>
