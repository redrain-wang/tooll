<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">⚖️ {{ t('ideal-weight') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('ideal-weight-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('gender') }}</label>
        <select v-model="gender" class="tool-input flex-1">
          <option value="male">{{ t('male') }}</option>
          <option value="female">{{ t('female') }}</option>
        </select>
      </div>
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('height') }} (cm)</label>
        <input v-model.number="height" type="number" min="100" max="250" class="tool-input flex-1 font-mono" placeholder="170">
      </div>

      <div v-if="results.length" class="pt-3 border-t space-y-3" style="border-color:var(--border)">
        <div v-for="(r, i) in results" :key="i" class="flex items-center justify-between card p-3">
          <div class="text-sm" style="color:var(--text-secondary)">{{ r.label }}</div>
          <div class="font-mono font-bold text-indigo-600">{{ r.value }} kg</div>
        </div>
        <div class="text-xs" style="color:var(--text-secondary)">{{ t('ideal-weight-note') }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'

const gender = ref('male')
const height = ref(170)

const results = computed(() => {
  const h = height.value
  if (!h) return []
  const devine = gender.value === 'male' ? 50 + 2.3 * (h / 2.54 - 60) : 45.5 + 2.3 * (h / 2.54 - 60)
  const broca = gender.value === 'male' ? (h - 100) * 0.9 : (h - 100) * 0.85
  const bmiLow = 18.5 * (h / 100) ** 2
  const bmiHigh = 24 * (h / 100) ** 2
  return [
    { label: t('devine-formula'), value: devine.toFixed(1) },
    { label: t('broca-formula'), value: broca.toFixed(1) },
    { label: t('bmi-range'), value: `${bmiLow.toFixed(1)} - ${bmiHigh.toFixed(1)}` },
  ]
})
</script>