<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('markdown') }}</h1>
    <p class="mb-6" style="color: var(--text-secondary);">{{ t('markdown-desc') }}</p>
    <div class="grid md:grid-cols-2 gap-4" style="min-height: 500px;">
      <div>
        <p class="text-sm font-medium mb-2" style="color: var(--text-secondary);">{{ t('edit') }}</p>
        <textarea v-model="md" class="tool-input h-full font-mono text-sm" style="min-height: 460px;" placeholder="# Hello"></textarea>
      </div>
      <div>
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm font-medium" style="color: var(--text-secondary);">{{ t('preview') }}</p>
          <div class="flex gap-2">
            <button @click="exportHtml" class="btn-secondary text-xs">📄 HTML</button>
            <button @click="exportPdf" class="btn-primary text-xs">📑 PDF</button>
          </div>
        </div>
        <div id="markdown-preview" class="card h-full overflow-auto" style="min-height: 460px;" v-html="html"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'
const md = ref('# Hello Markdown\n\nThis is a **preview** tool.')
const html = computed(() => {
  let h = md.value
  h = h.replace(/^### (.+)$/gm, '<h3>$1</h3>').replace(/^## (.+)$/gm, '<h2>$1</h2>').replace(/^# (.+)$/gm, '<h1>$1</h1>')
  h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>')
  h = h.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>').replace(/`([^`]+)`/g, '<code>$1</code>')
  h = h.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>').replace(/^- (.+)$/gm, '<li>$1</li>')
  h = h.replace(/\n\n/g, '<br><br>')
  return '<div style="line-height:1.7">' + h + '</div>'
})

function exportPdf() {
  const content = document.getElementById('markdown-preview')
  if (!content) return
  const printWindow = window.open('', '_blank')
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Markdown Export</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; line-height: 1.7; color: #333; max-width: 800px; margin: 0 auto; }
        h1, h2, h3 { margin-top: 1.5em; }
        pre { background: #f5f5f5; padding: 12px; border-radius: 6px; overflow-x: auto; }
        code { background: #f0f0f0; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
        blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 16px; color: #666; }
        @media print { body { padding: 0; } }
      </style>
    </head>
    <body>${content.innerHTML}</body>
    </html>
  `)
  printWindow.document.close()
  setTimeout(() => { printWindow.print() }, 300)
  window.showToast?.(t('copied'))
}

function exportHtml() {
  const content = document.getElementById('markdown-preview')
  if (!content) return
  const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Markdown Export</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; line-height: 1.7; color: #333; max-width: 800px; margin: 0 auto; }
    h1, h2, h3 { margin-top: 1.5em; }
    pre { background: #f5f5f5; padding: 12px; border-radius: 6px; overflow-x: auto; }
    code { background: #f0f0f0; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
    blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 16px; color: #666; }
  </style>
</head>
<body>${content.innerHTML}</body>
</html>`
  const blob = new Blob([fullHtml], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'markdown-export.html'; a.click()
  URL.revokeObjectURL(url)
  window.showToast?.(t('copied'))
}
</script>
