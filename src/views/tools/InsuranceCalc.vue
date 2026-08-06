<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🛡️ {{ t('insurance-calc') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('insurance-calc-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('salary-base') }}</label>
        <input v-model.number="base" type="number" min="0" class="tool-input flex-1 font-mono" placeholder="10000">
      </div>
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('social-insurance-rate') }}</label>
        <input v-model.number="siRate" type="number" min="0" step="0.1" class="tool-input w-24 font-mono">
        <span class="text-sm">%</span>
      </div>
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('housing-fund-rate') }}</label>
        <input v-model.number="hfRate" type="number" min="0" step="0.1" class="tool-input w-24 font-mono">
        <span class="text-sm">%</span>
      </div>

      <div v-if="total" class="pt-3 border-t grid grid-cols-3 gap-3" style="border-color:var(--border)">
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('si-monthly') }}</div>
          <div class="text-lg font-bold text-indigo-600">¥{{ si }}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('hf-monthly') }}</div>
          <div class="text-lg font-bold" style="color:var(--text)">¥{{ hf }}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('total-monthly') }}</div>
          <div class="text-lg font-bold" style="color:var(--text)">¥{{ total }}</div>
        </div>
      </div>
      <div class="text-xs" style="color:var(--text-secondary)">{{ t('insurance-calc-note') }}</div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'

const base = ref(10000)
const siRate = ref(10.5)
const hfRate = ref(12)

const si = computed(() => (base.value * siRate.value / 100).toFixed(2))
const hf = computed(() => (base.value * hfRate.value / 100).toFixed(2))
const total = computed(() => base.value ? (base.value * (siRate.value + hfRate.value) / 100).toFixed(2) : null)
</script>