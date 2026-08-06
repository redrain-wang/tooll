<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🧧 {{ t('lucky-money') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('lucky-money-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('total-amount') }}</label>
        <input v-model.number="total" type="number" min="0.01" step="0.01" class="tool-input flex-1 font-mono" placeholder="100">
      </div>
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('packet-count') }}</label>
        <input v-model.number="num" type="number" min="1" max="100" class="tool-input flex-1 font-mono" placeholder="10">
      </div>
      <button @click="generate" class="btn-primary" :disabled="busy">🧧 {{ t('generate-packet') }}</button>

      <div v-if="packets.length" class="pt-3 border-t" style="border-color:var(--border)">
        <div class="flex flex-wrap gap-2">
          <span v-for="(p, i) in packets" :key="i" class="card px-3 py-1.5 font-mono" :style="{ color: lucky(i) }">¥{{ p.toFixed(2) }}</span>
        </div>
        <div class="text-xs mt-2" style="color:var(--text-secondary)">{{ t('packet-total') }}: ¥{{ packets.reduce((a, b) => a + b, 0).toFixed(2) }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { t } from '../../i18n'

const total = ref(100)
const num = ref(10)
const packets = ref([])
const busy = ref(false)

const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6']
function lucky(i) { return colors[i % colors.length] }

function generate() {
  busy.value = true
  setTimeout(() => {
    const n = Math.min(num.value || 1, Math.floor(total.value / 0.01))
    const amounts = []
    let remaining = Math.round(total.value * 100)
    for (let i = 0; i < n; i++) {
      const left = n - i
      const max = Math.floor(remaining / left * 2)
      let amt
      if (left === 1) amt = remaining
      else amt = Math.max(1, Math.floor(Math.random() * (max - 1)) + 1)
      remaining -= amt
      amounts.push(amt / 100)
    }
    amounts.sort(() => Math.random() - 0.5)
    packets.value = amounts
    busy.value = false
  }, 300)
}
</script>