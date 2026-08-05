<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🏦 {{ t('mortgage-calculator') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('mortgage-calculator-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('loan-amount') }}</label>
        <input v-model.number="amount" type="number" min="0" @input="calc" class="tool-input flex-1 font-mono" placeholder="1000000">
      </div>
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('loan-years') }}</label>
        <input v-model.number="years" type="number" min="1" max="30" @input="calc" class="tool-input flex-1 font-mono" placeholder="30">
      </div>
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('loan-rate') }} (%)</label>
        <input v-model.number="rate" type="number" step="0.01" min="0" @input="calc" class="tool-input flex-1 font-mono" placeholder="4.9">
      </div>

      <div v-if="monthly" class="pt-3 border-t grid grid-cols-3 gap-3" style="border-color:var(--border)">
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('monthly-payment') }}</div>
          <div class="text-lg font-bold text-indigo-600">¥{{ monthly }}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('total-interest') }}</div>
          <div class="text-lg font-bold" style="color:var(--text)">¥{{ totalInterest }}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('total-payment') }}</div>
          <div class="text-lg font-bold" style="color:var(--text)">¥{{ totalPayment }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'

const amount = ref(1000000)
const years = ref(30)
const rate = ref(4.9)

const monthly = computed(() => {
  if (!amount.value || !years.value || !rate.value) return null
  const p = amount.value, n = years.value * 12, r = rate.value / 100 / 12
  if (r === 0) return (p / n).toFixed(2)
  const m = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
  return m.toFixed(2)
})
const totalPayment = computed(() => monthly.value ? (parseFloat(monthly.value) * years.value * 12).toFixed(2) : null)
const totalInterest = computed(() => totalPayment.value ? (parseFloat(totalPayment.value) - amount.value).toFixed(2) : null)
function calc() {}
</script>