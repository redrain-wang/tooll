<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('html-escape') }}</h1>
    <p class="mb-6" style="color: var(--text-secondary);">{{ t('html-escape-desc') }}</p>
    <div class="space-y-4">
      <textarea v-model="input" class="tool-input h-48 font-mono text-sm" :placeholder="t('html-placeholder')"></textarea>
      <div class="flex gap-3 flex-wrap">
        <button @click="escapeHtml" class="btn-primary">{{ t('escape') }}</button>
        <button @click="unescapeHtml" class="btn-primary">{{ t('unescape') }}</button>
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
const input = ref(''); const output = ref(''); const message = ref(''); const error = ref(false)
const map = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','/':'&#x2F;'}
const rev = {'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'",'&#x2F;':'/'}
function escapeHtml() { output.value = input.value.replace(/[&<>"'/]/g, c => map[c]); message.value='✅ OK'; error.value=false; window.showToast?.('OK') }
function unescapeHtml() { output.value = input.value.replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;/g, c => rev[c]); message.value='✅ OK'; error.value=false }
function copy() { navigator.clipboard.writeText(output.value); window.showToast?.(t('copied')) }
</script>
