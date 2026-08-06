<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🌸 {{ t('ovulation-calc') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('ovulation-calc-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="flex items-center gap-3">
        <label class="w-40 text-sm font-medium" style="color:var(--text-secondary)">{{ t('last-period') }}</label>
        <input v-model="lmp" type="date" class="tool-input flex-1" @change="calc">
      </div>
      <div class="flex items-center gap-3">
        <label class="w-40 text-sm font-medium" style="color:var(--text-secondary)">{{ t('cycle-length') }}</label>
        <input v-model.number="cycle" type="number" min="21" max="40" class="tool-input w-24 font-mono">
        <span class="text-sm">{{ t('days') }}</span>
      </div>

      <div v-if="info.ovulation" class="pt-3 border-t space-y-3" style="border-color:var(--border)">
        <div class="grid grid-cols-3 gap-3">
          <div class="card p-3 text-center">
            <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('ovulation-date') }}</div>
            <div class="font-bold text-indigo-600">{{ info.ovulation }}</div>
          </div>
          <div class="card p-3 text-center">
            <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('fertile-window') }}</div>
            <div class="font-medium" style="color:var(--text)">{{ info.fertileStart }} ~ {{ info.fertileEnd }}</div>
          </div>
          <div class="card p-3 text-center">
            <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('next-period') }}</div>
            <div class="font-medium" style="color:var(--text)">{{ info.nextPeriod }}</div>
          </div>
        </div>
        <div class="text-xs" style="color:var(--text-secondary)">{{ t('ovulation-note') }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { t } from '../../i18n'

const lmp = ref('')
const cycle = ref(28)
const info = reactive({})

function fmt(d) { return d.toISOString().slice(0, 10) }
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x }

function calc() {
  if (!lmp.value) return
  const d = new Date(lmp.value)
  const ovulation = addDays(d, cycle.value - 14)
  info.ovulation = fmt(ovulation)
  info.fertileStart = fmt(addDays(ovulation, -4))
  info.fertileEnd = fmt(addDays(ovulation, 2))
  info.nextPeriod = fmt(addDays(d, cycle.value))
}
</script>