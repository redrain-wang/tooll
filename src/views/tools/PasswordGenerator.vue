<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('password') }}</h1>
    <p class="mb-6" style="color: var(--text-secondary);">{{ t('password-desc') }}</p>
    <div class="card space-y-5">
      <div class="flex items-center gap-4">
        <label class="text-sm font-medium w-24" style="color: var(--text-secondary);">{{ t('password-length') }}</label>
        <input v-model.number="length" type="range" min="8" max="64" class="flex-1 accent-indigo-500">
        <span class="text-lg font-mono font-bold w-8" style="color: var(--primary);">{{ length }}</span>
      </div>
      <div class="flex flex-wrap gap-4">
        <label class="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" v-model="opts.upper" class="rounded accent-indigo-500"> {{ t('upper-case') }}</label>
        <label class="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" v-model="opts.lower" class="rounded accent-indigo-500"> {{ t('lower-case') }}</label>
        <label class="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" v-model="opts.numbers" class="rounded accent-indigo-500"> {{ t('numbers') }}</label>
        <label class="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" v-model="opts.symbols" class="rounded accent-indigo-500"> {{ t('symbols') }}</label>
      </div>
      <button @click="generate" class="btn-primary w-full py-3 text-base">🎲 {{ t('gen-password') }}</button>
      <div v-if="password" class="flex items-center gap-3 p-4 rounded-lg" style="background: var(--bg);">
        <code class="flex-1 text-base font-mono break-all select-all" style="color: var(--text);">{{ password }}</code>
        <button @click="copy" class="btn-secondary whitespace-nowrap">📋 {{ t('copy') }}</button>
      </div>
      <div v-if="strength" class="space-y-2">
        <div class="flex items-center gap-2">
          <span class="text-sm" style="color: var(--text-secondary);">{{ t('strength') }}:</span>
          <div class="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <div :class="['h-full rounded-full transition-all', strength.color]" :style="{ width: strength.width }"></div>
          </div>
          <span :class="['text-sm font-medium', strength.textColor]">{{ t(strength.key) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { t } from '../../i18n'
const length = ref(16); const opts = reactive({ upper: true, lower: true, numbers: true, symbols: true })
const password = ref(''); const strength = ref(null)

function generate() {
  let chars = ''
  if (opts.upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (opts.lower) chars += 'abcdefghijklmnopqrstuvwxyz'
  if (opts.numbers) chars += '0123456789'
  if (opts.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'
  if (!chars) { alert('Select at least one character type'); return }
  let pwd = ''; const arr = new Uint32Array(length.value); crypto.getRandomValues(arr)
  for (let i = 0; i < length.value; i++) pwd += chars[arr[i] % chars.length]
  password.value = pwd; calcStrength(); window.showToast?.(t('generated') || 'Generated')
}
function calcStrength() {
  let score = 0
  if (password.value.length >= 12) score++; if (password.value.length >= 20) score++
  if (/[A-Z]/.test(password.value) && /[a-z]/.test(password.value)) score++
  if (/\d/.test(password.value)) score++; if (/[^A-Za-z0-9]/.test(password.value)) score++
  const levels = [
    { key: 'weak', color: 'bg-red-400', textColor: 'text-red-600', width: '20%' },
    { key: 'fair', color: 'bg-orange-400', textColor: 'text-orange-600', width: '40%' },
    { key: 'medium', color: 'bg-yellow-400', textColor: 'text-yellow-600', width: '60%' },
    { key: 'strong', color: 'bg-green-400', textColor: 'text-green-600', width: '80%' },
    { key: 'very-strong', color: 'bg-emerald-500', textColor: 'text-emerald-600', width: '100%' },
  ]
  strength.value = levels[Math.min(score, 4)]
}
function copy() { navigator.clipboard.writeText(password.value); window.showToast?.(t('copied')) }
</script>
