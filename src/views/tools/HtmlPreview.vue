<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('html-preview-title') }}</h1>
    <p class="mb-6" style="color: var(--text-secondary);">{{ t('html-preview-desc') }}</p>
    <div class="space-y-4">
      <div class="grid md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <label class="text-sm" style="color: var(--text-secondary);">{{ t('html-preview-input') }}</label>
            <div class="flex gap-2">
              <button @click="copy" class="btn-secondary text-xs">📋 {{ t('copy') }}</button>
              <button @click="clear" class="btn-secondary text-xs">🗑️ {{ t('reset') }}</button>
            </div>
          </div>
          <textarea
            v-model="htmlCode"
            class="tool-input h-80 font-mono text-sm"
            :placeholder="t('html-preview-placeholder')"
            spellcheck="false"
          ></textarea>
        </div>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <label class="text-sm" style="color: var(--text-secondary);">{{ t('preview') }}</label>
            <div class="flex gap-2">
              <button
                @click="viewport = 'desktop'"
                :class="['text-xs px-3 py-1 rounded-lg border transition-colors', viewport === 'desktop' ? 'border-primary' : '']"
                :style="{ borderColor: viewport === 'desktop' ? 'var(--primary)' : 'var(--border)', color: viewport === 'desktop' ? 'var(--primary)' : 'var(--text-secondary)' }"
              >🖥️ Desktop</button>
              <button
                @click="viewport = 'mobile'"
                :class="['text-xs px-3 py-1 rounded-lg border transition-colors', viewport === 'mobile' ? 'border-primary' : '']"
                :style="{ borderColor: viewport === 'mobile' ? 'var(--primary)' : 'var(--border)', color: viewport === 'mobile' ? 'var(--primary)' : 'var(--text-secondary)' }"
              >📱 Mobile</button>
            </div>
          </div>
          <div
            class="rounded-xl border overflow-hidden flex justify-center"
            style="background: var(--bg); border-color: var(--border); min-height: 320px;"
          >
            <iframe
              :srcdoc="previewContent"
              :style="{ width: viewport === 'mobile' ? '375px' : '100%', height: '100%', minHeight: '320px', border: 'none', background: '#fff' }"
              sandbox="allow-scripts"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { t } from '../../i18n'

const htmlCode = ref(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 2rem; margin: 0; }
    h1 { color: #333; }
    .card { background: #f5f5f5; padding: 1rem; border-radius: 8px; margin-top: 1rem; }
  </style>
</head>
<body>
  <h1>Hello World!</h1>
  <div class="card">
    <p>Edit the HTML on the left to see changes here.</p>
  </div>
</body>
</html>`)

const previewContent = ref(htmlCode.value)
const viewport = ref('desktop')
let debounceTimer = null

watch(htmlCode, () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    previewContent.value = htmlCode.value
  }, 300)
})

onUnmounted(() => {
  clearTimeout(debounceTimer)
})

function copy() {
  navigator.clipboard.writeText(htmlCode.value)
  window.showToast?.(t('copied'))
}

function clear() {
  htmlCode.value = ''
}
</script>
