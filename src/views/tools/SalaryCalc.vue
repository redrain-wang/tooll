<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">💼 {{ t('salary-calc') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('salary-calc-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('gross-salary') }}</label>
        <input v-model.number="gross" type="number" min="0" class="tool-input flex-1 font-mono" placeholder="15000">
      </div>
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('insurance-pct') }}</label>
        <input v-model.number="insPct" type="number" min="0" step="0.1" class="tool-input w-24 font-mono">
        <span class="text-sm">%</span>
      </div>

      <div v-if="net != null" class="pt-3 border-t grid grid-cols-3 gap-3" style="border-color:var(--border)">
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('insurance-paid') }}</div>
          <div class="text-lg font-bold text-indigo-600">¥{{ insurance }}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('tax-per-month') }}</div>
          <div class="text-lg font-bold" style="color:var(--text)">¥{{ tax }}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('take-home') }}</div>
          <div class="text-lg font-bold" style="color:var(--text)">¥{{ net }}</div>
        </div>
      </div>
      <div class="text-xs" style="color:var(--text-secondary)">{{ t('salary-calc-note') }}</div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'

const gross = ref(15000)
const insPct = ref(10.5)

const brackets = [
  { limit: 36000, rate: 0.03, ded: 0 },
  { limit: 144000, rate: 0.10, ded: 2520 },
  { limit: 300000, rate: 0.20, ded: 16920 },
  { limit: 420000, rate: 0.25, ded: 31920 },
  { limit: 660000, rate: 0.30, ded: 52920 },
  { limit: 960000, rate: 0.35, ded: 85920 },
  { limit: Infinity, rate: 0.45, ded: 181920 },
]

const insurance = computed(() => (gross.value * insPct.value / 100).toFixed(2))
const taxable = computed(() => Math.max(0, gross.value - parseFloat(insurance.value) - 5000))
const tax = computed(() => {
  const annual = taxable.value * 12
  if (!annual) return '0.00'
  const b = brackets.find(x => annual <= x.limit)
  return Math.max(0, annual * b.rate - b.ded).toFixed(2)
})
const net = computed(() => gross.value ? (gross.value - parseFloat(insurance.value) - parseFloat(tax.value)).toFixed(2) : null)
</script>