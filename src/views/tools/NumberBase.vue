<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('number-base') }}</h1>
    <p class="mb-6" style="color: var(--text-secondary);">{{ t('number-base-desc') }}</p>
    <div class="space-y-4">
      <div class="card">
        <label class="text-sm font-medium block mb-2" style="color: var(--text-secondary);">{{ t('input-number') }}</label>
        <div class="flex gap-3">
          <input v-model="input" class="tool-input flex-1 font-mono" placeholder="0">
          <select v-model="base" class="tool-input w-40">
            <option :value="2">{{ t('binary') }} (2)</option>
            <option :value="8">{{ t('octal') }} (8)</option>
            <option :value="10">{{ t('decimal') }} (10)</option>
            <option :value="16">{{ t('hex') }} (16)</option>
          </select>
        </div>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div v-for="b in bases" :key="b.base" class="card text-center cursor-pointer" @click="copy(results[b.base])">
          <p class="text-xs mb-1" style="color: var(--text-secondary);">{{ t(b.key) }}</p>
          <p class="font-mono text-sm break-all font-medium" style="color: var(--text);">{{ results[b.base] || '-' }}</p>
          <p class="text-xs mt-1" style="color: var(--text-secondary);">{{ t('click-copy') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'
const input = ref(''); const base = ref(10)
const bases = [{base:2,key:'binary'},{base:8,key:'octal'},{base:10,key:'decimal'},{base:16,key:'hex'}]
const results = computed(() => {
  try { const n = parseInt(input.value, base.value); if(isNaN(n))return{}; return {2:n.toString(2),8:n.toString(8),10:n.toString(10),16:n.toString(16).toUpperCase()} } catch{return{}}
})
function copy(v) { if(v){navigator.clipboard.writeText(v);window.showToast?.(t('copied'))} }
</script>
