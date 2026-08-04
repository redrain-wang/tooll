<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('slug-gen') }}</h1>
    <p class="mb-6" style="color: var(--text-secondary);">{{ t('slug-gen-desc') }}</p>
    <div class="space-y-4">
      <textarea v-model="input" class="tool-input h-32 font-mono text-sm" :placeholder="t('text-to-slug-placeholder')+'\n'+t('text-to-slug-example')"></textarea>
      <div class="flex gap-3 flex-wrap">
        <button @click="generate" class="btn-primary">{{ t('generate') }}</button>
        <button @click="copy" class="btn-secondary">📋 {{ t('copy') }}</button>
      </div>
      <div v-if="result" class="card">
        <div class="flex items-center gap-3">
          <code class="flex-1 p-3 rounded-lg font-mono" style="background: var(--bg); color: var(--primary);">{{ result }}</code>
          <button @click="copyUrl" class="btn-secondary text-sm">{{ t('copy-url') }}</button>
        </div>
        <div class="mt-4 space-y-2">
          <p class="text-sm font-medium" style="color: var(--text-secondary);">{{ t('text-to-slug-preview') }}</p>
          <p class="text-sm font-mono p-2 rounded" style="background: var(--bg); color: var(--text);">https://example.com/{{ result }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { t } from '../../i18n'
const input = ref(''); const result = ref('')

function generate() {
  result.value = input.value
    .toLowerCase()
    .trim()
    .replace(/[\u4e00-\u9fa5]/g, m => m)
    .replace(/[^\w\s\u4e00-\u9fa5-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function copy() { navigator.clipboard.writeText(result.value); window.showToast?.(t('copied')) }
function copyUrl() { navigator.clipboard.writeText('https://example.com/' + result.value); window.showToast?.(t('copied')) }
</script>
