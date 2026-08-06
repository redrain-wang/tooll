<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🤰 {{ t('due-date') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('due-date-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('last-period') }}</label>
        <input v-model="lmp" type="date" class="tool-input flex-1" @change="calc">
      </div>

      <div v-if="info.due" class="pt-3 border-t grid grid-cols-2 gap-3" style="border-color:var(--border)">
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('due-date') }}</div>
          <div class="text-lg font-bold text-indigo-600">{{ info.due }}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('gestational-age') }}</div>
          <div class="text-lg font-bold" style="color:var(--text)">{{ info.weeks }} {{ t('weeks') }}</div>
        </div>
        <div class="card p-3 text-center col-span-2">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('days-left') }}</div>
          <div class="font-medium" style="color:var(--text)">{{ info.daysLeft }} {{ t('days') }}</div>
        </div>
      </div>
      <div class="text-xs" style="color:var(--text-secondary)">{{ t('due-date-note') }}</div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { t } from '../../i18n'

const lmp = ref('')
const info = reactive({})

function calc() {
  if (!lmp.value) return
  const d = new Date(lmp.value)
  const due = new Date(d)
  due.setDate(due.getDate() + 280)
  const now = new Date()
  const ms = now - d
  const days = Math.floor(ms / 86400000)
  info.due = due.toISOString().slice(0, 10)
  info.weeks = Math.max(0, Math.floor(days / 7))
  info.daysLeft = Math.max(0, Math.ceil((due - now) / 86400000))
}
</script>