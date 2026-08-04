<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('hash-gen') }}</h1>
    <p class="mb-6" style="color: var(--text-secondary);">{{ t('hash-gen-desc') }}</p>
    <div class="space-y-4">
      <textarea v-model="input" class="tool-input h-40 font-mono text-sm" :placeholder="t('hash-placeholder')"></textarea>
      <button @click="compute" class="btn-primary">{{ t('generate') }}</button>
      <div v-if="hashes.length" class="card space-y-3">
        <div v-for="h in hashes" :key="h.algo" class="flex items-center gap-3 py-2" style="border-bottom: 1px solid var(--border);">
          <span class="text-sm font-medium w-12" style="color: var(--text-secondary);">{{ h.algo }}</span>
          <code class="flex-1 font-mono text-xs break-all" style="color: var(--text);">{{ h.value }}</code>
          <button @click="copy(h.value)" class="text-xs px-2 py-1 rounded" style="color: var(--primary);">{{ t('copy') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { t } from '../../i18n'
const input = ref(''); const hashes = ref([])

async function compute() {
  if (!input.value) return
  const encoder = new TextEncoder()
  const data = encoder.encode(input.value)
  const results = []
  if (crypto.subtle) {
    const sha256 = await crypto.subtle.digest('SHA-256', data)
    results.push({ algo: 'SHA-256', value: buf2hex(sha256) })
    const sha384 = await crypto.subtle.digest('SHA-384', data)
    results.push({ algo: 'SHA-384', value: buf2hex(sha384) })
    const sha512 = await crypto.subtle.digest('SHA-512', data)
    results.push({ algo: 'SHA-512', value: buf2hex(sha512) })
  } else {
    try {
      const res = await fetch('/api/hash', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: input.value }) })
      const d = await res.json()
      if (d.success) {
        results.push({ algo: 'SHA-256', value: d.sha256 })
        results.push({ algo: 'SHA-384', value: d.sha384 })
        results.push({ algo: 'SHA-512', value: d.sha512 })
      }
    } catch (e) { window.showToast?.(t('hash-unavailable')) }
  }
  hashes.value = results
  window.showToast?.('OK')
}

function buf2hex(buf) {
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function copy(v) { navigator.clipboard.writeText(v); window.showToast?.(t('copied')) }
</script>
