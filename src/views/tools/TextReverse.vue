<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('text-reverse') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('text-reverse-desc') }}</p>
    <div class="space-y-4">
      <textarea v-model="input" class="tool-input h-48 font-mono text-sm" :placeholder="t('text-reverse-placeholder')"></textarea>
      <div class="flex gap-3 flex-wrap">
        <button @click="reverseText" class="btn-primary">{{ t('text-reverse-chars') }}</button>
        <button @click="reverseLines" class="btn-secondary">{{ t('text-reverse-lines') }}</button>
        <button @click="copy" class="btn-secondary">📋 {{ t('copy') }}</button>
      </div>
      <textarea v-model="output" class="tool-input h-48 font-mono text-sm" readonly style="background:var(--card-bg)"></textarea>
    </div>
  </div>
</template>
<script setup>
import{ref}from'vue';import{t}from'../../i18n'
const input=ref('');const output=ref('')
function reverseText(){output.value=input.value.split('').reverse().join('')}
function reverseLines(){output.value=input.value.split(/\r?\n/).reverse().join('\n')}
function copy(){navigator.clipboard.writeText(output.value);window.showToast?.(t('copied'))}
</script>
