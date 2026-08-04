<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('batch-pwd-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('batch-pwd-desc') }}</p>
    <div class="card space-y-5">
      <div class="flex items-center gap-4">
        <label class="text-sm font-medium w-24" style="color:var(--text-secondary)">{{ t('password-length') }}</label>
        <input v-model.number="length" type="range" min="4" max="128" class="flex-1 accent-indigo-500">
        <span class="text-lg font-mono font-bold w-10" style="color:var(--primary)">{{ length }}</span>
      </div>
      <div class="flex flex-wrap gap-4">
        <label class="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" v-model="opts.upper" class="rounded accent-indigo-500"> {{ t('upper-case') }}</label>
        <label class="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" v-model="opts.lower" class="rounded accent-indigo-500"> {{ t('lower-case') }}</label>
        <label class="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" v-model="opts.numbers" class="rounded accent-indigo-500"> {{ t('numbers') }}</label>
        <label class="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" v-model="opts.symbols" class="rounded accent-indigo-500"> {{ t('symbols') }}</label>
      </div>
      <div class="flex items-center gap-4">
        <label class="text-sm font-medium w-24" style="color:var(--text-secondary)">{{ t('quantity') }}</label>
        <input v-model.number="count" type="range" min="1" max="100" class="flex-1 accent-indigo-500">
        <span class="text-lg font-mono font-bold w-10" style="color:var(--primary)">{{ count }}</span>
      </div>
      <button @click="generate" class="btn-primary w-full py-3 text-base">🎲 {{ t('batch-pwd-gen') }}</button>
    </div>

    <div v-if="passwords.length" class="card mt-4 space-y-4">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium" style="color:var(--text-secondary)">{{ t('batch-pwd-result') }} ({{ passwords.length }})</span>
        <div class="flex gap-2">
          <button @click="copyAll" class="btn-secondary text-sm">📋 {{ t('copy-all') }}</button>
          <button @click="exportTxt" class="btn-secondary text-sm">📥 {{ t('batch-pwd-export') }}</button>
        </div>
      </div>
      <div class="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        <div v-for="(item, i) in passwords" :key="i" class="flex items-center gap-2 p-3 rounded-lg" style="background:var(--bg)">
          <span class="text-xs font-mono w-6 text-right shrink-0" style="color:var(--text-secondary)">{{ i + 1 }}.</span>
          <code class="flex-1 text-sm font-mono break-all select-all" style="color:var(--text)">{{ item.pwd }}</code>
          <div class="flex items-center gap-1 shrink-0">
            <span class="text-xs px-1.5 py-0.5 rounded font-medium" :style="{color: item.strength.textColor, background: item.strength.bg}">{{ t(item.strength.key) }}</span>
            <button @click="copyOne(item.pwd)" class="p-1 rounded hover:opacity-80" style="color:var(--primary)" :title="t('copy')">📋</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { t } from '../../i18n'

const length = ref(16)
const count = ref(10)
const opts = reactive({ upper: true, lower: true, numbers: true, symbols: true })
const passwords = ref([])

const strengthLevels = [
  { key: 'weak', color: '#ef4444', textColor: '#ef4444', bg: 'rgba(239,68,68,0.15)', width: '20%' },
  { key: 'fair', color: '#f97316', textColor: '#f97316', bg: 'rgba(249,115,22,0.15)', width: '40%' },
  { key: 'medium', color: '#eab308', textColor: '#eab308', bg: 'rgba(234,179,8,0.15)', width: '60%' },
  { key: 'strong', color: '#22c55e', textColor: '#22c55e', bg: 'rgba(34,197,94,0.15)', width: '80%' },
  { key: 'very-strong', color: '#16a34a', textColor: '#16a34a', bg: 'rgba(22,163,74,0.15)', width: '100%' },
]

function calcStrength(pwd) {
  let score = 0
  if (pwd.length >= 12) score++
  if (pwd.length >= 20) score++
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++
  if (/\d/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  return strengthLevels[Math.min(score, 4)]
}

function generate() {
  let chars = ''
  if (opts.upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (opts.lower) chars += 'abcdefghijklmnopqrstuvwxyz'
  if (opts.numbers) chars += '0123456789'
  if (opts.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'
  if (!chars) { alert('Select at least one character type'); return }
  const arr = new Uint32Array(length.value * count.value)
  crypto.getRandomValues(arr)
  const result = []
  for (let j = 0; j < count.value; j++) {
    let pwd = ''
    const base = j * length.value
    for (let i = 0; i < length.value; i++) pwd += chars[arr[base + i] % chars.length]
    result.push({ pwd, strength: calcStrength(pwd) })
  }
  passwords.value = result
  window.showToast?.(t('generated') || 'Generated')
}

function copyOne(pwd) { navigator.clipboard.writeText(pwd); window.showToast?.(t('copied')) }
function copyAll() { navigator.clipboard.writeText(passwords.value.map(p => p.pwd).join('\n')); window.showToast?.(t('copied')) }
function exportTxt() {
  const text = passwords.value.map(p => p.pwd).join('\n')
  const blob = new Blob([text], { type: 'text/plain' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'passwords.txt'
  a.click()
  URL.revokeObjectURL(a.href)
}
</script>
