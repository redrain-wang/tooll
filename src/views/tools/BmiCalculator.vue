<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">⚖️ {{ t('bmi-calculator') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('bmi-calculator-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="flex items-center gap-3">
        <label class="w-24 text-sm font-medium" style="color:var(--text-secondary)">{{ t('height') }} (m)</label>
        <input v-model.number="height" type="number" step="0.01" min="0.5" max="2.5" @input="calc" class="tool-input flex-1 font-mono" placeholder="1.75">
      </div>
      <div class="flex items-center gap-3">
        <label class="w-24 text-sm font-medium" style="color:var(--text-secondary)">{{ t('weight') }} (kg)</label>
        <input v-model.number="weight" type="number" step="0.1" min="20" max="300" @input="calc" class="tool-input flex-1 font-mono" placeholder="65">
      </div>

      <div v-if="bmi" class="pt-3 border-t space-y-2" style="border-color:var(--border)">
        <div class="flex items-center justify-between">
          <span class="text-sm" style="color:var(--text-secondary)">BMI</span>
          <span class="text-2xl font-bold">{{ bmi }}</span>
        </div>
        <div class="w-full h-3 rounded-full overflow-hidden" style="background:#e5e7eb">
          <div class="h-full rounded-full" :style="{ width: posPct + '%', background: category.color }"></div>
        </div>
        <div class="flex justify-between text-xs" style="color:var(--text-secondary)">
          <span>18.5</span><span>24</span><span>28</span><span>32+</span>
        </div>
        <div class="mt-2 text-sm font-medium" :style="{ color: category.color }">{{ t('result') }}：{{ t(category.label) }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'

const height = ref(1.75)
const weight = ref(65)
const bmi = computed(() => {
  if (!height.value || !weight.value || height.value <= 0) return null
  return (weight.value / (height.value * height.value)).toFixed(1)
})
const category = computed(() => {
  const v = parseFloat(bmi.value)
  if (v < 18.5) return { label: 'bmi-underweight', color: '#3b82f6' }
  if (v < 24) return { label: 'bmi-normal', color: '#22c55e' }
  if (v < 28) return { label: 'bmi-overweight', color: '#f59e0b' }
  return { label: 'bmi-obese', color: '#ef4444' }
})
const posPct = computed(() => {
  const v = parseFloat(bmi.value)
  if (!v) return 0
  const pct = Math.min(100, Math.max(0, ((v - 16) / 16) * 100))
  return pct
})
function calc() {}
</script>