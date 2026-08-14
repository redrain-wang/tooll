<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">📈 {{ t('compound-interest') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('compound-interest-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="flex items-center gap-3">
        <label class="w-36 text-sm font-medium" style="color:var(--text-secondary)">{{ t('principal') }}</label>
        <input v-model.number="principal" type="number" min="0" class="tool-input flex-1 font-mono" @input="calc">
      </div>
      <div class="flex items-center gap-3">
        <label class="w-36 text-sm font-medium" style="color:var(--text-secondary)">{{ t('annual-rate') }}</label>
        <input v-model.number="rate" type="number" min="0" max="100" step="0.1" class="tool-input w-28 font-mono" @input="calc">
        <span class="text-sm">%</span>
      </div>
      <div class="flex items-center gap-3">
        <label class="w-36 text-sm font-medium" style="color:var(--text-secondary)">{{ t('years-num') }}</label>
        <input v-model.number="term" type="number" min="1" max="60" class="tool-input w-28 font-mono" @input="calc">
        <span class="text-sm">{{ t('years') }}</span>
      </div>

      <div v-if="result" class="pt-3 border-t grid grid-cols-3 gap-3" style="border-color:var(--border)">
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('future-value') }}</div>
          <div class="text-lg font-bold text-indigo-600">{{ fmt(result.future) }}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('total-interest') }}</div>
          <div class="text-lg font-bold" style="color:var(--text)">{{ fmt(result.interest) }}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('multiples') }}</div>
          <div class="text-lg font-bold" style="color:var(--text)">{{ result.mult }}×</div>
        </div>
      </div>
      <div class="text-xs" style="color:var(--text-secondary)">{{ t('compound-note') }}</div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'

const principal = ref(10000)
const rate = ref(5)
const term = ref(10)

const result = computed(() => {
  const p = principal.value, r = rate.value, n = term.value
  if (!p || !n || p < 0) return null
  const future = p * Math.pow(1 + (r || 0) / 100, n)
  return { future, interest: future - p, mult: future / p }
})
function fmt(x) {
  return new Intl.NumberFormat(t('locale') === 'zh' ? 'zh-CN' : 'en-US', { style: 'currency', currency: t('locale') === 'zh' ? 'CNY' : 'USD' }).format(Math.round(x))
}
</script>