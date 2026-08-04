<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🎨 {{ t('code-fmt-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('code-fmt-desc') }}</p>
    <div class="space-y-4">
      <div class="flex gap-3 flex-wrap">
        <select v-model="lang" class="tool-input w-40"><option value="js">JavaScript/TypeScript</option><option value="json">JSON</option><option value="css">CSS</option><option value="html">HTML</option><option value="md">Markdown</option></select>
        <label class="flex items-center gap-2 text-sm"><input type="checkbox" v-model="singleQuote" class="rounded"> {{ t('code-fmt-single-quote') }}</label>
        <label class="flex items-center gap-2 text-sm"><input type="checkbox" v-model="semi" class="rounded"> {{ t('code-fmt-semicolon') }}</label>
        <label class="flex items-center gap-2 text-sm"><input type="checkbox" v-model="printWidth" class="rounded"> {{ t('code-fmt-wrap') }}</label>
        <button @click="format" class="btn-primary">✨ {{ t('format') }}</button>
        <button @click="minify" class="btn-secondary">📦 {{ t('compress') }}</button>
        <button @click="copy" class="btn-secondary">📋 {{ t('copy') }}</button>
      </div>
      <textarea v-model="code" class="tool-input h-64 font-mono text-sm" :placeholder="t('code-fmt-placeholder')"></textarea>
      <div v-if="error" class="p-3 rounded text-sm" style="background:#fee2e2;color:#dc2626">{{ error }}</div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import{t}from'../../i18n'
const lang = ref('js'); const code = ref(''); const error = ref('')
const singleQuote = ref(true); const semi = ref(true); const printWidth = ref(true)
const format = () => { error.value = ''; try { if (lang.value === 'json') { code.value = JSON.stringify(JSON.parse(code.value), null, 2) } else if (lang.value === 'js') { code.value = formatJS(code.value) } else if (lang.value === 'css') { code.value = formatCSS(code.value) } else if (lang.value === 'html') { code.value = formatHTML(code.value) } else if (lang.value === 'md') { code.value = formatMD(code.value) } window.showToast?.('OK') } catch (e) { error.value = e.message } }
const minify = () => { error.value = ''; try { if (lang.value === 'json') { code.value = JSON.stringify(JSON.parse(code.value)) } else if (lang.value === 'js') { code.value = minifyJS(code.value) } else if (lang.value === 'css') { code.value = minifyCSS(code.value) } else if (lang.value === 'html') { code.value = minifyHTML(code.value) } window.showToast?.('OK') } catch (e) { error.value = e.message } }
const copy = () => { navigator.clipboard.writeText(code.value); window.showToast?.(t('copied')) }
function formatJS(s) { return s.replace(/\s*\{\s*/g, ' { ').replace(/\s*\}\s*/g, ' } ').replace(/\s*;\s*/g, '; ').replace(/\s*,\s*/g, ', ').replace(/\s*=\s*/g, ' = ').replace(/\s*([+\-*/%])\s*/g, ' $1 ').trim() }
function minifyJS(s) { return s.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{};,:=+\-*/%])\s*/g, '$1').trim() }
function formatCSS(s) { return s.replace(/\s*\{\s*/g, ' { ').replace(/\s*\}\s*/g, ' } ').replace(/\s*:\s*/g, ': ').replace(/\s*;\s*/g, '; ').replace(/\s*,\s*/g, ', ').trim() }
function minifyCSS(s) { return s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{};,:])\s*/g, '$1').trim() }
function formatHTML(s) { let indent = 0; return s.replace(/>\s*</g, '>\n<').split(/\r?\n/).map(l => { if (l.match(/^\s*<\//)) indent--; const r = '  '.repeat(Math.max(0, indent)) + l.trim(); if (l.match(/<[^!\/][^>]*>[^<]*$/)) indent++; return r }).join('\n') }
function minifyHTML(s) { return s.replace(/\s+/g, ' ').replace(/\s*<\//g, '</').replace(/\s*>/g, '>').trim() }
function formatMD(s) { return s.replace(/^(#+)\s*/gm, '$1 ').replace(/\n{3,}/g, '\n\n').trim() }
</script>
