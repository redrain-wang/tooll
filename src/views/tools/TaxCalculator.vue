<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🧾 {{ t('tax-calculator') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('tax-calculator-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('monthly-salary') }}</label>
        <input v-model.number="salary" type="number" min="0" class="tool-input flex-1 font-mono" placeholder="15000">
      </div>
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('social-insurance') }}</label>
        <input v-model.number="insurance" type="number" min="0" class="tool-input flex-1 font-mono" placeholder="1000">
      </div>
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('special-deduction') }}</label>
        <input v-model.number="extra" type="number" min="0" class="tool-input flex-1 font-mono" placeholder="0">
      </div>
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('tax-yearly') }}</label>        <select v-model="year" class="tool-input flex-1">
          <option :value="5000">2024/2025 - 5000</option>
        </select>
      </div>

      <div v-if="monthlyTax != null" class="pt-3 border-t grid grid-cols-3 gap-3" style="border-color:var(--border)">
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('taxable-income') }}</div>
          <div class="text-lg font-bold text-indigo-600">¥{{ taxable }}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('tax-per-month') }}</div>
          <div class="text-lg font-bold" style="color:var(--text)">¥{{ monthlyTax }}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('take-home') }}</div>
          <div class="text-lg font-bold" style="color:var(--text)">¥{{ takeHome }}</div>
        </div>
      </div>
      <div v-if="monthlyTax != null" class="text-xs" style="color:var(--text-secondary)">{{ t('tax-rate') }}: {{ rate }}%</div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'

const salary = ref(15000)
const insurance = ref(1000)
const extra = ref(0)
const year = ref(5000)

const brackets = [
  { limit: 36000, rate: 0.03, ded: 0 },
  { limit: 144000, rate: 0.10, ded: 2520 },
  { limit: 300000, rate: 0.20, ded: 16920 },
  { limit: 420000, rate: 0.25, ded: 31920 },
  { limit: 660000, rate: 0.30, ded: 52920 },
  { limit: 960000, rate: 0.35, ded: 85920 },
  { limit: Infinity, rate: 0.45, ded: 181920 },
]

const monthlyTaxable = computed(() => Math.max(0, salary.value - year.value - insurance.value - extra.value))
const monthlyTax = computed(() => {
  const annual = monthlyTaxable.value * 12
  const b = brackets.find(x => annual <= x.limit)
  const annualTax = annual * b.rate - b.ded
  return annualTax > 0 ? Math.max(0, annualTax / 12).toFixed(2) : null
})
const taxable = computed(() => monthlyTax.value != null ? monthlyTaxable.value : null)
const takeHome = computed(() => monthlyTax.value != null ? (salary.value - insurance.value - parseFloat(monthlyTax.value)).toFixed(2) : null)
const rate = computed(() => {
  if (monthlyTax.value == null) return 0
  const annual = monthlyTaxable.value * 12
  return (brackets.find(x => annual <= x.limit).rate * 100).toFixed(0)
})
</script>