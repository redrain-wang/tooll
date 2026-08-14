<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🐶 {{ t('pet-age') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('pet-age-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('pet-type') }}</label>
        <select v-model="type" class="tool-input flex-1">
          <option value="dog">🐕 {{ t('dog') }}</option>
          <option value="cat">🐈 {{ t('cat') }}</option>
        </select>
      </div>
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('pet-years') }}</label>
        <input v-model.number="years" type="number" min="0" max="30" step="0.1" class="tool-input w-28 font-mono" @input="calc">
      </div>

      <div v-if="humanAge" class="pt-3 border-t" style="border-color:var(--border)">
        <div class="card p-4 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('human-equivalent') }}</div>
          <div class="text-3xl font-bold text-indigo-600">{{ humanAge }} {{ t('years') }}</div>
        </div>
        <div class="text-xs mt-2" style="color:var(--text-secondary)">{{ t('pet-age-note') }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'

const type = ref('dog')
const years = ref(2)

const humanAge = computed(() => {
  const y = years.value
  if (!y || y < 0) return null
  if (type.value === 'dog') {
    if (y <= 1) return Math.round(y * 15)
    if (y <= 2) return Math.round(15 + (y - 1) * 9)
    return Math.round(24 + (y - 2) * 5)
  }
  if (y <= 1) return Math.round(y * 15)
  if (y <= 2) return Math.round(15 + (y - 1) * 9)
  return Math.round(24 + (y - 2) * 4)
})
</script>