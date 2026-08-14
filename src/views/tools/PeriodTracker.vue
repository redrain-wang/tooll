<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">📆 {{ t('period-tracker') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('period-tracker-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="flex items-center gap-3">
        <label class="w-40 text-sm font-medium" style="color:var(--text-secondary)">{{ t('last-period-start') }}</label>
        <input v-model="start" type="date" class="tool-input flex-1" @change="calc">
      </div>
      <div class="flex items-center gap-3">
        <label class="w-40 text-sm font-medium" style="color:var(--text-secondary)">{{ t('cycle-length') }}</label>
        <input v-model.number="cycle" type="number" min="21" max="40" class="tool-input w-24 font-mono">
        <span class="text-sm">{{ t('days') }}</span>
      </div>
      <div class="flex items-center gap-3">
        <label class="w-40 text-sm font-medium" style="color:var(--text-secondary)">{{ t('period-duration') }}</label>
        <input v-model.number="duration" type="number" min="3" max="9" class="tool-input w-24 font-mono">
        <span class="text-sm">{{ t('days') }}</span>
      </div>

      <div v-if="info.next != ''" class="pt-3 border-t grid grid-cols-3 gap-3" style="border-color:var(--border)">
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('next-period') }}</div>
          <div class="font-bold text-indigo-600">{{ info.next }}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('days-to-next') }}</div>
          <div class="font-bold" style="color:var(--text)">{{ info.daysToNext }} {{ t('days') }}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('ovulation-date') }}</div>
          <div class="font-bold" style="color:var(--text)">{{ info.ovulation }}</div>
        </div>
      </div>
      <div class="text-xs" style="color:var(--text-secondary)">{{ t('period-tracker-note') }}</div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { t } from '../../i18n'

const start = ref('')
const cycle = ref(28)
const duration = ref(5)
const info = reactive({ next: '', daysToNext: null, ovulation: '' })

function fmt(d) { return d.toISOString().slice(0, 10) }
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x }

function calc() {
  if (!start.value) { info.next = ''; return }
  const d = new Date(start.value)
  const next = addDays(d, cycle.value)
  const ovulation = addDays(d, cycle.value - 14)
  const now = new Date(); now.setHours(0, 0, 0, 0)
  info.next = fmt(next)
  info.ovulation = fmt(ovulation)
  info.daysToNext = Math.max(0, Math.round((next - now) / 86400000))
}
</script>