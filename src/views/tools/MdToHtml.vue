<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('md-html') }}</h1>
    <p class="mb-6" style="color: var(--text-secondary);">{{ t('md-html-desc') }}</p>
    <div class="space-y-4">
      <textarea v-model="input" class="tool-input h-48 font-mono text-sm" placeholder="# Hello&#10;&#10;This is **bold** and *italic*."></textarea>
      <div class="flex gap-3 flex-wrap">
        <button @click="convert" class="btn-primary">{{ t('convert') }}</button>
        <button @click="copy" class="btn-secondary">📋 {{ t('copy') }}</button>
        <button @click="download" class="btn-secondary">📥 {{ t('download') }}</button>
      </div>
      <textarea :value="output" class="tool-input h-48 font-mono text-sm" readonly style="background: var(--card-bg);" placeholder="HTML output..."></textarea>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { t } from '../../i18n'
const input = ref(''); const output = ref('')

function convert() {
  let h = input.value
  h = h.replace(/^### (.+)$/gm, '<h3>$1</h3>').replace(/^## (.+)$/gm, '<h2>$1</h2>').replace(/^# (.+)$/gm, '<h1>$1</h1>')
  h = h.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>')
  h = h.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
  h = h.replace(/`([^`]+)`/g, '<code>$1</code>')
  h = h.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
  h = h.replace(/^- (.+)$/gm, '<li>$1</li>')
  h = h.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  h = h.replace(/^---$/gm, '<hr>')
  output.value = h
  window.showToast?.('OK')
}

function copy() { navigator.clipboard.writeText(output.value); window.showToast?.(t('copied')) }
function download() {
  const blob = new Blob([output.value], { type: 'text/html' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'output.html'; a.click()
}
</script>
