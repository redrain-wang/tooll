<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('text-dedup') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('text-dedup-desc') }}</p>
    <div class="space-y-4">
      <div class="flex gap-3 flex-wrap mb-4">
        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" v-model="trimWhitespace" class="rounded"> {{ t('trim-whitespace') }}
        </label>
        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" v-model="removeEmpty" class="rounded"> {{ t('remove-empty') }}
        </label>
        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" v-model="ignoreCase" class="rounded"> {{ t('ignore-case') }}
        </label>
      </div>
      <textarea v-model="input" class="tool-input h-48 font-mono text-sm" :placeholder="t('text-dedup-placeholder')"></textarea>
      <div class="flex gap-3 flex-wrap">
        <button @click="dedup" class="btn-primary">{{ t('dedup') }}</button>
        <button @click="copy" class="btn-secondary">📋 {{ t('copy') }}</button>
        <span class="text-sm self-center" style="color:var(--text-secondary)">{{ stats }}</span>
      </div>
      <textarea v-model="output" class="tool-input h-48 font-mono text-sm" readonly style="background:var(--card-bg)"></textarea>
    </div>
  </div>
</template>
<script setup>
import {ref, computed} from 'vue'
import {t} from '../../i18n'

const input = ref('')
const output = ref('')
const trimWhitespace=ref(false)
const removeEmpty=ref(false)
const ignoreCase=ref(false)

const removedText = computed(() => t('removed'))
const stats = computed(() => {
  if (!output.value) return ''
  const a = input.value.split(/\r?\n/).length
  const b = output.value.split(/\r?\n/).length
  return a + ' → ' + b + ' (' + (a - b) + ' ' + t('removed') + ')'
})

function dedup() {
  let lines = input.value.split(/\r?\n/)
  
  if (trimWhitespace.value) {
    lines = lines.map(l => l.trim())
  }
  
  if (removeEmpty.value) {
    lines = lines.filter(l => l.length > 0)
  }
  
  const seen = new Set()
  const result = []
  
  for (const line of lines) {
    const key = ignoreCase.value ? line.toLowerCase() : line
    if (!seen.has(key)) {
      seen.add(key)
      result.push(line)
    }
  }
  
  output.value = result.join('\n')
  window.showToast?.('OK')
}

function copy() {
  navigator.clipboard.writeText(output.value)
  window.showToast?.(t('copied'))
}
</script>