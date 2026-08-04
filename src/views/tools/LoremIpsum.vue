<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('lorem') }}</h1>
    <p class="mb-6" style="color: var(--text-secondary);">{{ t('lorem-desc') }}</p>
    <div class="card space-y-4">
      <div class="flex gap-4 items-end flex-wrap">
        <div>
          <label class="text-sm font-medium block mb-1" style="color: var(--text-secondary);">{{ t('lorem-paragraphs') }}</label>
          <input v-model.number="count" type="number" min="1" max="50" class="tool-input w-24">
        </div>
        <div>
          <label class="text-sm font-medium block mb-1" style="color: var(--text-secondary);">{{ t('lorem-type') }}</label>
          <select v-model="type" class="tool-input w-32">
            <option value="paragraphs">{{ t('lorem-paragraphs') }}</option>
            <option value="sentences">{{ t('lorem-sentences') }}</option>
            <option value="words">{{ t('lorem-words') }}</option>
          </select>
        </div>
        <button @click="generate" class="btn-primary">🎲 {{ t('generate') }}</button>
        <button @click="copy" class="btn-secondary">📋 {{ t('copy') }}</button>
      </div>
      <textarea :value="result" class="tool-input h-64 font-mono text-sm" readonly style="background: var(--bg);"></textarea>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { t } from '../../i18n'

const count = ref(3); const type = ref('paragraphs'); const result = ref('')

const words = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ')

function genSentence() {
  const len = 8 + Math.floor(Math.random() * 12)
  let s = []
  for (let i = 0; i < len; i++) s.push(words[Math.floor(Math.random() * words.length)])
  s[0] = s[0][0].toUpperCase() + s[0].slice(1)
  return s.join(' ') + '.'
}

function genParagraph() {
  const len = 3 + Math.floor(Math.random() * 5)
  return Array.from({ length: len }, genSentence).join(' ')
}

function generate() {
  if (type.value === 'words') {
    result.value = Array.from({ length: count.value }, () => words[Math.floor(Math.random() * words.length)]).join(' ')
  } else if (type.value === 'sentences') {
    result.value = Array.from({ length: count.value }, genSentence).join(' ')
  } else {
    result.value = Array.from({ length: count.value }, genParagraph).join('\n\n')
  }
  window.showToast?.(t('generated') || 'Generated')
}

function copy() { navigator.clipboard.writeText(result.value); window.showToast?.(t('copied')) }
generate()
</script>
