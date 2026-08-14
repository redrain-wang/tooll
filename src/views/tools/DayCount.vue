<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">📅 {{ t('day-count') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('day-count-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('memorial-date') }}</label>
        <input v-model="date" type="date" class="tool-input flex-1" @change="calc">
      </div>

      <div v-if="info.days != null" class="pt-3 border-t grid grid-cols-2 gap-3" style="border-color:var(--border)">
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('days-passed') }}</div>
          <div class="text-lg font-bold text-indigo-600">{{ info.days }} {{ t('days') }}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('years-passed') }}</div>
          <div class="text-lg font-bold" style="color:var(--text)">{{ info.years }}</div>
        </div>
        <div class="card p-3 text-center col-span-2">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('weekday') }}</div>
          <div class="font-medium" style="color:var(--text)">{{ info.weekday }}</div>
        </div>
      </div>
      <div class="text-xs" style="color:var(--text-secondary)">{{ t('day-count-note') }}</div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { t } from '../../i18n'

const date = ref(new Date().toISOString().slice(0, 10))
const info = reactive({})
const weekdays = ['日', '一', '二', '三', '四', '五', '六']

function calc() {
  if (!date.value) return
  const d = new Date(date.value)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const days = Math.round((now - d) / 86400000)
  info.days = Math.max(0, days)
  info.years = (days / 365.25).toFixed(2)
  info.weekday = t('week-' + weekdays[d.getDay()])
}
calc()
</script>