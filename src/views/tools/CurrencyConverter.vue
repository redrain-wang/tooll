<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">💱 {{ t('currency-converter') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('currency-converter-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="flex items-center gap-3">
        <input v-model.number="amount" type="number" min="0" class="tool-input flex-1 font-mono" placeholder="100">
        <select v-model="from" class="tool-input" style="width:auto">
          <option v-for="c in currencies" :key="c.code" :value="c.code">{{ c.code }}</option>
        </select>
      </div>
      <div class="flex justify-center">
        <button @click="swap" class="btn-secondary">⇅ {{ t('swap') }}</button>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex-1 font-mono text-lg font-bold text-indigo-600">{{ result }}</div>
        <select v-model="to" class="tool-input" style="width:auto">
          <option v-for="c in currencies" :key="c.code" :value="c.code">{{ c.code }}</option>
        </select>
      </div>
      <div class="text-xs" style="color:var(--text-secondary)">{{ t('currency-note') }}</div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'

const rates = { CNY: 1, USD: 7.1, EUR: 7.7, JPY: 0.048, GBP: 8.9, KRW: 0.0052, HKD: 0.91, AUD: 4.7, CAD: 5.2, SGD: 5.3 }
const currencies = Object.keys(rates).map(code => ({ code }))
const amount = ref(100)
const from = ref('CNY')
const to = ref('USD')

const result = computed(() => {
  if (!amount.value) return '0.00'
  const v = amount.value * rates[to.value] / rates[from.value]
  return v.toFixed(2)
})
function swap() { const t = from.value; from.value = to.value; to.value = t }
</script>