<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('code-shot') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('code-shot-desc') }}</p>

    <div class="mb-4 flex flex-wrap items-center gap-2">
      <select v-model="lang" class="tool-input" style="width:auto" @change="highlight">
        <option v-for="l in langs" :key="l" :value="l">{{ l }}</option>
      </select>
      <select v-model="theme" class="tool-input" style="width:auto">
        <option v-for="t in themes" :key="t.id" :value="t.id">{{ t.name }}</option>
      </select>
      <select v-model="windowStyle" class="tool-input" style="width:auto">
        <option value="mac">Mac</option>
        <option value="dots">Dots (droplets)</option>
        <option value="none">None</option>
      </select>
      <input type="range" min="12" max="20" v-model.number="fontSize" class="flex-1 max-w-40">
      <span class="text-sm" style="color:var(--text-secondary)">{{ fontSize }}px</span>
      <input type="checkbox" id="showLineNos" v-model="showLineNos" class="w-4 h-4">
      <label for="showLineNos" class="text-sm" style="color:var(--text-secondary)">#</label>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <div>
        <div class="mb-2 text-sm font-medium" style="color:var(--text-secondary)">{{ t('code') }}</div>
        <textarea v-model="code" @input="highlight" class="tool-input h-80 font-mono text-sm" :placeholder="t('code-shot-placeholder')" spellcheck="false"></textarea>
      </div>
      <div>
        <div class="mb-2 text-sm font-medium" style="color:var(--text-secondary)">{{ t('preview') }}</div>
        <div class="rounded-xl border p-6 flex items-center justify-center overflow-auto" style="border-color:var(--border);background:#f4f4f5">
          <div :id="shotId" ref="shotEl" class="code-shot min-w-full" :class="theme">
            <div v-if="windowStyle !== 'none'" class="shot-win">
              <span v-for="i in 3" :key="i" class="shot-dot"></span>
              <span class="shot-title">{{ t('code') }}</span>
            </div>
            <pre class="shot-pre" :style="{ fontSize: fontSize + 'px' }"><code :class="'language-' + lang" v-html="highlighted"></code></pre>
          </div>
        </div>
        <div v-if="err" class="mt-3 text-sm text-red-500">{{ err }}</div>
      </div>
    </div>

    <div class="mt-4 flex gap-3 flex-wrap">
      <button @click="exportPng" class="btn-primary">⬇️ {{ t('export-png') }}</button>
      <button @click="copy" class="btn-secondary">📋 {{ t('copy') }}</button>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-markdown'
import { download } from '../../lib/export'
import { t } from '../../i18n'

const langs = ['javascript', 'typescript', 'python', 'json', 'css', 'markup', 'sql', 'bash', 'go', 'java', 'rust', 'c', 'markdown']
const themes = [
  { id: 'dracula', name: 'Dracula' },
  { id: 'github', name: 'GitHub' },
  { id: 'one-dark', name: 'One Dark' },
  { id: 'monokai', name: 'Monokai' },
  { id: 'solarized', name: 'Solarized' },
]
const code = ref(`function fibonacci(n) {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}

// 生成前 10 个斐波那契数
for (let i = 0; i < 10; i++) {
  console.log(fibonacci(i))
}`)
const lang = ref('javascript')
const theme = ref('dracula')
const windowStyle = ref('mac')
const fontSize = ref(15)
const showLineNos = ref(true)
const highlighted = ref('')
const err = ref('')
const shotEl = ref(null)
const shotId = 'shot-' + Math.random().toString(36).slice(2, 8)

const lineNoMarkup = computed(() => {
  if (!showLineNos.value) return highlighted.value.split('\n').map(l => l).join('\n')
  return highlighted.value.split('\n').map((l, i) => `<span class="token line-number">${i + 1}</span>${l}`).join('\n')
})

async function highlight() {
  err.value = ''
  try {
    const grammar = Prism.languages[lang.value]
    if (grammar) {
      highlighted.value = Prism.highlight(code.value, grammar, lang.value)
    } else {
      highlighted.value = escapeHtml(code.value)
    }
  } catch (e) { highlighted.value = escapeHtml(code.value) }
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

async function exportPng() {
  err.value = ''
  try {
    const { toPng } = await import('html-to-image')
    const dataUrl = await toPng(shotEl.value, { pixelRatio: 2, backgroundColor: getBg() })
    download(dataUrl, 'code-shot.png')
  } catch (e) { err.value = String(e.message || e) }
}

function getBg() {
  const map = { dracula: '#282a36', 'one-dark': '#282c34', monokai: '#272822', solarized: '#002b36', github: '#ffffff' }
  return map[theme.value] || '#282a36'
}

function copy() { navigator.clipboard.writeText(code.value); window.showToast?.(t('copied')) }

highlight()
</script>
<style scoped>
.code-shot { border-radius: 10px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,.25); }
.code-shot .shot-pre { margin: 0; padding: 20px; background: transparent; white-space: pre; overflow: auto; }
.code-shot pre { font-family: 'Fira Code','Courier New',monospace; }
.shot-win { display: flex; align-items: center; gap: 6px; padding: 10px 14px; background: rgba(0,0,0,.15); }
.shot-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,.25); }
.shot-title { margin-left: 8px; font-size: 12px; opacity: .7; }
.code-shot.github { background: #fff; color: #24292e; }
.code-shot.github pre code { color: #24292e; }
.line-number { display: inline-block; width: 2.4em; margin-right: 1em; opacity: .4; user-select: none; text-align: right; }
</style>