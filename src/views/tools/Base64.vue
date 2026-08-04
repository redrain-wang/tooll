<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('base64') }}</h1>
    <p class="mb-6" style="color: var(--text-secondary);">{{ t('base64-desc') }}</p>
    <div class="space-y-4">
      <textarea v-model="input" class="tool-input h-48 font-mono text-sm" :placeholder="t('base64-placeholder')"></textarea>
      <div class="flex gap-3 flex-wrap">
        <button @click="encode" class="btn-primary">{{ t('encode') }} →</button>
        <button @click="decode" class="btn-primary">← {{ t('decode') }}</button>
        <button @click="copy" class="btn-secondary">📋 {{ t('copy') }}</button>
      </div>
      <div v-if="message" :class="['p-3 rounded-lg text-sm', error ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400']">{{ message }}</div>
      <textarea v-model="output" class="tool-input h-48 font-mono text-sm" readonly style="background: var(--card-bg);" :placeholder="t('output')"></textarea>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { t } from '../../i18n'
const input = ref('')
const output = ref('')
const message = ref('')
const error = ref(false)

function encode() {
  try { output.value = btoa(unescape(encodeURIComponent(input.value))); message.value = '✅ OK'; error.value = false; window.showToast?.('OK') }
  catch (e) { message.value = '❌ ' + e.message; error.value = true }
}
function decode() {
  try { output.value = decodeURIComponent(escape(atob(input.value))); message.value = '✅ OK'; error.value = false; window.showToast?.('OK') }
  catch (e) { message.value = '❌ Invalid Base64'; error.value = true }
}
function copy() { navigator.clipboard.writeText(output.value); window.showToast?.(t('copied')) }
</script>
