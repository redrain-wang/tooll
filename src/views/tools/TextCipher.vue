<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('text-cipher') }}</h1>
    <p class="mb-6" style="color: var(--text-secondary);">{{ t('text-cipher-desc') }}</p>
    <div class="space-y-4">
      <textarea v-model="input" class="tool-input h-40 font-mono text-sm" :placeholder="t('text-cipher-placeholder')"></textarea>
      <div class="flex gap-3 flex-wrap items-center">
        <select v-model="cipher" class="tool-input w-48 text-sm">
          <option value="caesar">{{ t('text-cipher-caesar') }}</option>
          <option value="rot13">ROT13</option>
          <option value="atbash">Atbash</option>
          <option value="vigenere">{{ t('text-cipher-vigenere') }}</option>
          <option value="base64">Base64</option>
        </select>
        <input v-if="cipher === 'caesar'" v-model.number="shift" type="number" min="0" max="25" class="tool-input w-20 text-sm" :placeholder="t('text-cipher-shift')">
        <input v-if="cipher === 'vigenere'" v-model="keyword" class="tool-input w-48 text-sm" :placeholder="t('text-cipher-keyword')">
      </div>
      <div class="flex gap-3 flex-wrap">
        <button @click="encrypt" class="btn-primary">🔒 {{ t('encrypt') }}</button>
        <button @click="decrypt" class="btn-primary">🔓 {{ t('decrypt') }}</button>
        <button @click="copy" class="btn-secondary">📋 {{ t('copy') }}</button>
      </div>
      <div v-if="message" :class="['p-3 rounded-lg text-sm', error ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400']">{{ message }}</div>
      <textarea v-model="output" class="tool-input h-40 font-mono text-sm" readonly style="background: var(--card-bg);" :placeholder="t('output')"></textarea>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { t } from '../../i18n'

const input = ref('')
const output = ref('')
const cipher = ref('caesar')
const shift = ref(3)
const keyword = ref('')
const message = ref('')
const error = ref(false)

function caesarProcess(text, s, decryptMode) {
  const k = decryptMode ? (26 - (s % 26)) : (s % 26)
  return text.replace(/[a-zA-Z]/g, c => {
    const base = c <= 'Z' ? 65 : 97
    return String.fromCharCode(((c.charCodeAt(0) - base + k) % 26) + base)
  })
}

function rot13(text) {
  return caesarProcess(text, 13, false)
}

function atbash(text) {
  return text.replace(/[a-zA-Z]/g, c => {
    const base = c <= 'Z' ? 65 : 97
    return String.fromCharCode(base + 25 - (c.charCodeAt(0) - base))
  })
}

function vigenereProcess(text, key, decryptMode) {
  if (!key) return text
  const k = key.replace(/[^a-zA-Z]/g, '').toLowerCase()
  if (!k) return text
  let ki = 0
  return text.replace(/[a-zA-Z]/g, c => {
    const base = c <= 'Z' ? 65 : 97
    const kv = k.charCodeAt(ki % k.length) - 97
    const shift = decryptMode ? (26 - kv) : kv
    ki++
    return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base)
  })
}

function b64Encode(text) {
  try { return btoa(unescape(encodeURIComponent(text))) } catch { return '' }
}

function b64Decode(text) {
  try { return decodeURIComponent(escape(atob(text))) } catch { return '' }
}

function encrypt() {
  message.value = ''
  error.value = false
  if (!input.value) { message.value = '⚠️ ' + t('text-cipher-empty'); error.value = true; return }
  try {
    switch (cipher.value) {
      case 'caesar': output.value = caesarProcess(input.value, shift.value, false); break
      case 'rot13': output.value = rot13(input.value); break
      case 'atbash': output.value = atbash(input.value); break
      case 'vigenere': output.value = vigenereProcess(input.value, keyword.value, false); break
      case 'base64': output.value = b64Encode(input.value); break
    }
    message.value = '✅ OK'; error.value = false; window.showToast?.('OK')
  } catch (e) { message.value = '❌ ' + e.message; error.value = true }
}

function decrypt() {
  message.value = ''
  error.value = false
  if (!input.value) { message.value = '⚠️ ' + t('text-cipher-empty'); error.value = true; return }
  try {
    switch (cipher.value) {
      case 'caesar': output.value = caesarProcess(input.value, shift.value, true); break
      case 'rot13': output.value = rot13(input.value); break
      case 'atbash': output.value = atbash(input.value); break
      case 'vigenere': output.value = vigenereProcess(input.value, keyword.value, true); break
      case 'base64': output.value = b64Decode(input.value); break
    }
    message.value = '✅ OK'; error.value = false; window.showToast?.('OK')
  } catch (e) { message.value = '❌ ' + e.message; error.value = true }
}

function copy() {
  navigator.clipboard.writeText(output.value)
  window.showToast?.(t('copied'))
}
</script>
