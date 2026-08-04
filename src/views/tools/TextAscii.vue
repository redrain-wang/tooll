<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('text-ascii') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('text-ascii-desc') }}</p>
    <div class="space-y-4">
      <textarea v-model="input" class="tool-input h-32 font-mono text-sm" :placeholder="t('text-ascii-placeholder')"></textarea>
      <div class="flex gap-3">
        <button @click="toAscii" class="btn-primary">{{ t('text-ascii-to') }}</button>
        <button @click="fromAscii" class="btn-primary">{{ t('text-ascii-from') }}</button>
        <button @click="copy" class="btn-secondary">📋 {{ t('copy') }}</button>
      </div>
      <textarea v-model="output" class="tool-input h-32 font-mono text-sm" readonly style="background:var(--card-bg)"></textarea>
    </div>
  </div>
</template>
<script setup>
import{ref}from'vue';import{t}from'../../i18n'
const input=ref('');const output=ref('')
function toAscii(){output.value=input.value.split('').map(c=>c.charCodeAt(0)).join(' ')}
function fromAscii(){output.value=input.value.split(' ').map(n=>String.fromCharCode(parseInt(n))).join('')}
function copy(){navigator.clipboard.writeText(output.value);window.showToast?.(t('copied'))}
</script>
