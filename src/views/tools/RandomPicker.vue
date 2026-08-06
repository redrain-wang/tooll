<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🎯 {{ t('random-picker') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('random-picker-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <textarea v-model="text" rows="6" class="tool-input w-full font-mono" :placeholder="t('random-picker-hint')"></textarea>
      <div class="flex items-center gap-3">
        <label class="text-sm font-medium w-28" style="color:var(--text-secondary)">{{ t('pick-count') }}</label>
        <input v-model.number="count" type="number" min="1" class="tool-input w-20 font-mono">
      </div>
      <div class="flex items-center gap-3">
        <button @click="pick" class="btn-primary">🎯 {{ t('start-pick') }}</button>
        <button @click="clear" class="btn-secondary">🗑️ {{ t('clear') }}</button>
      </div>
      <div v-if="result.length" class="pt-3 border-t space-y-2" style="border-color:var(--border)">
        <div v-for="(r, i) in result" :key="i" class="card p-3 font-medium text-center" style="color:var(--primary);font-size:1.1rem">{{ r }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { t } from '../../i18n'

const text = ref('')
const count = ref(1)
const result = ref([])

function items() {
  return text.value.split(/[\n,，;；]+/).map(s => s.trim()).filter(Boolean)
}
function pick() {
  const arr = items()
  if (!arr.length) return
  const n = Math.min(count.value || 1, arr.length)
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  result.value = shuffled.slice(0, n)
}
function clear() { result.value = [] }
</script>