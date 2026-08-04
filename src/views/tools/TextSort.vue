<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('text-sort') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('text-sort-desc') }}</p>
    <div class="space-y-4">
      <div class="flex gap-3 flex-wrap mb-4">
        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" v-model="trimWhitespace" class="rounded"> {{ t('trim-whitespace') }}
        </label>
        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" v-model="removeEmpty" class="rounded"> {{ t('remove-empty') }}
        </label>
        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" v-model="unique" class="rounded"> {{ t('unique-lines') }}
        </label>
      </div>
      <textarea v-model="input" class="tool-input h-48 font-mono text-sm" :placeholder="t('text-sort-placeholder')"></textarea>
      <div class="flex gap-3 flex-wrap">
        <button @click="sort('asc')" class="btn-primary">A→Z {{ t('asc') }}</button>
        <button @click="sort('desc')" class="btn-primary">Z→A {{ t('desc') }}</button>
        <button @click="sort('len')" class="btn-secondary">{{ t('text-sort-by-len') }} {{ t('asc') }}</button>
        <button @click="sort('len-desc')" class="btn-secondary">{{ t('text-sort-by-len') }} {{ t('desc') }}</button>
        <button @click="sort('rand')" class="btn-secondary">🎲 {{ t('random') }}</button>
        <button @click="copy" class="btn-secondary">📋 {{ t('copy') }}</button>
      </div>
      <textarea v-model="output" class="tool-input h-48 font-mono text-sm" readonly style="background:var(--card-bg)"></textarea>
    </div>
  </div>
</template>
<script setup>
import {ref} from 'vue'
import {t} from '../../i18n'

const input = ref('')
const output = ref('')
const trimWhitespace = ref(true)
const removeEmpty = ref(true)
const unique = ref(false)

const sort = (mode) => {
  let lines = input.value.split(/\r?\n/)
  
  if (trimWhitespace.value) {
    lines = lines.map(l => l.trim())
  }
  
  if (removeEmpty.value) {
    lines = lines.filter(l => l.length > 0)
  }
  
  if (unique.value) {
    lines = [...new Set(lines)]
  }
  
  if (mode === 'asc') {
    lines.sort()
  } else if (mode === 'desc') {
    lines.sort().reverse()
  } else if (mode === 'len') {
    lines.sort((a, b) => a.length - b.length)
  } else if (mode === 'len-desc') {
    lines.sort((a, b) => b.length - a.length)
  } else {
    lines.sort(() => Math.random() - 0.5)
  }
  
  output.value = lines.join('\n')
  window.showToast?.('OK')
}

const copy = () => {
  navigator.clipboard.writeText(output.value)
  window.showToast?.(t('copied'))
}
</script>