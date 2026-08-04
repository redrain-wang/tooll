<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('url-encode') }}</h1>
    <p class="mb-6" style="color: var(--text-secondary);">{{ t('url-encode-desc') }}</p>
    <div class="space-y-4">
      <textarea v-model="input" class="tool-input h-40 font-mono text-sm" :placeholder="t('url-encode-placeholder')"></textarea>
      <div class="flex gap-3 flex-wrap">
        <button @click="encode" class="btn-primary">{{ t('encodeURI') }}</button>
        <button @click="decode" class="btn-primary">{{ t('decodeURI') }}</button>
        <button @click="encodeComponent" class="btn-secondary">{{ t('encodeComp') }}</button>
        <button @click="copy" class="btn-secondary">📋 {{ t('copy') }}</button>
      </div>
      <div v-if="message" :class="['p-3 rounded-lg text-sm', error ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400']">{{ message }}</div>
      <textarea v-model="output" class="tool-input h-40 font-mono text-sm" readonly style="background: var(--card-bg);" :placeholder="t('output')"></textarea>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { t } from '../../i18n'
const input = ref(''); const output = ref(''); const message = ref(''); const error = ref(false)
function encode() { output.value = encodeURI(input.value); message.value = '✅ OK'; error.value = false; window.showToast?.('OK') }
function decode() { try { output.value = decodeURI(input.value); message.value = '✅ OK'; error.value = false } catch(e) { message.value = '❌ Error'; error.value = true } }
function encodeComponent() { output.value = encodeURIComponent(input.value); message.value = '✅ OK'; error.value = false }
function copy() { navigator.clipboard.writeText(output.value); window.showToast?.(t('copied')) }
</script>
