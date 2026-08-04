<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('json-formatter') }}</h1>
    <p class="mb-6" style="color: var(--text-secondary);">{{ t('json-formatter-desc') }}</p>
    <div class="space-y-4">
      <textarea v-model="input" class="tool-input h-64 font-mono text-sm" :placeholder="t('json-formatter-placeholder')"></textarea>
      <div class="flex gap-3 flex-wrap">
        <button @click="format" class="btn-primary">✨ {{ t('format') }}</button>
        <button @click="compress" class="btn-secondary">📦 {{ t('compress') }}</button>
        <button @click="validate" class="btn-secondary">✅ {{ t('validate') }}</button>
        <button @click="copy" class="btn-secondary">📋 {{ t('copy') }}</button>
      </div>
      <div v-if="message" :class="['p-3 rounded-lg text-sm', error ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400']">{{ message }}</div>
      <textarea v-model="output" class="tool-input h-64 font-mono text-sm" readonly style="background: var(--card-bg);" :placeholder="t('output')"></textarea>
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

function format() {
  try { output.value = JSON.stringify(JSON.parse(input.value), null, 2); message.value = '✨ ' + t('format') + ' OK'; error.value = false; window.showToast?.(t('format') + ' OK') }
  catch (e) { message.value = '❌ ' + e.message; error.value = true }
}
function compress() {
  try { output.value = JSON.stringify(JSON.parse(input.value)); message.value = '📦 OK'; error.value = false; window.showToast?.('OK') }
  catch (e) { message.value = '❌ ' + e.message; error.value = true }
}
function validate() {
  try { JSON.parse(input.value); message.value = '✅ Valid JSON'; error.value = false }
  catch (e) { message.value = '❌ ' + e.message; error.value = true }
}
function copy() { navigator.clipboard.writeText(output.value); window.showToast?.(t('copied')) }
</script>
