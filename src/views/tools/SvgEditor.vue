<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🎨 {{ t('svg-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('svg-desc') }}</p>
    <div class="space-y-4">
      <div class="flex gap-3 flex-wrap">
        <button @click="loadDemo" class="btn-secondary text-sm">📋 {{ t('svg-load-example') }}</button>
        <button @click="optimize" class="btn-primary text-sm">✨ {{ t('svg-optimize') }}</button>
        <button @click="download" class="btn-secondary text-sm" :disabled="!svg">💾 {{ t('svg-download') }}</button>
        <button @click="copyCode" class="btn-secondary text-sm">📋 {{ t('svg-copy-code') }}</button>
      </div>
      <div class="grid lg:grid-cols-2 gap-4">
        <div class="card">
          <p class="font-medium mb-2">{{ t('svg-code-edit') }}</p>
          <textarea v-model="code" class="tool-input h-[500px] font-mono text-xs" :placeholder="t('svg-placeholder')" @input="parse"></textarea>
          <p v-if="error" class="text-sm mt-2" style="color:#ef4444">{{ error }}</p>
        </div>
        <div class="card">
          <p class="font-medium mb-2">{{ t('svg-live-preview') }}</p>
          <div class="aspect-square border rounded-lg overflow-auto flex items-center justify-center" style="border-color:var(--border);background:var(--bg)">
            <div v-if="svg" class="max-w-full max-h-full" v-html="svg"></div>
            <p v-else class="text-sm" style="color:var(--text-secondary)">{{ t('svg-invalid') }}</p>
          </div>
          <div class="mt-3 grid grid-cols-3 gap-2 text-xs" style="color:var(--text-secondary)">
            <span>{{ t('svg-original') }}: {{ originalSize }} {{ t('svg-bytes') }}</span>
            <span>{{ t('svg-optimized') }}: {{ optimizedSize }} {{ t('svg-bytes') }}</span>
            <span>{{ t('svg-compression') }}: {{ ratio }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import{t}from'../../i18n'
const code = ref(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#4F46E5"/><text x="50" y="55" text-anchor="middle" fill="white" font-size="30">SVG</text></svg>`)
const svg = ref(''); const error = ref(''); const originalSize = ref(0); const optimizedSize = ref(0)
const parse = () => { error.value = ''; try { const parser = new DOMParser(); const doc = parser.parseFromString(code.value, 'image/svg+xml'); if (doc.querySelector('parsererror')) throw new Error(t('svg-parse-error')); svg.value = doc.documentElement.outerHTML; originalSize.value = code.value.length } catch (e) { error.value = e.message; svg.value = '' } }
const optimize = () => { if (!svg.value) return; let s = svg.value; s = s.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim(); s = s.replace(/\s*(=["'][^"']*["'])\s*/g, '$1'); s = s.replace(/fill="#[0-9a-fA-F]{6}"/g, ''); optimizedSize.value = s.length; code.value = s; parse() }
const loadDemo = () => { code.value = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#4F46E5"/><stop offset="100%" stop-color="#EC4899"/></linearGradient></defs><circle cx="100" cy="100" r="90" fill="url(#g)"/><path d="M60,100 Q100,60 140,100 Q100,140 60,100" fill="#fff" opacity="0.2"/></svg>`; parse() }
const download = () => { const blob = new Blob([code.value], { type: 'image/svg+xml' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'optimized.svg'; a.click() }
const copyCode = () => { navigator.clipboard.writeText(code.value); window.showToast?.(t('copied')) }
const ratio = () => originalSize.value ? Math.round((1 - optimizedSize.value / originalSize.value) * 100) : 0
parse()
</script>
