<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">👶 {{ t('baby-age') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('baby-age-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('birth-date') }}</label>
        <input v-model="date" type="date" class="tool-input flex-1" @change="calc">
      </div>

      <div v-if="info.months != null" class="pt-3 border-t grid grid-cols-3 gap-3" style="border-color:var(--border)">
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('baby-months') }}</div>
          <div class="text-lg font-bold text-indigo-600">{{ info.months }}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('baby-days') }}</div>
          <div class="text-lg font-bold" style="color:var(--text)">{{ info.days }}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('zodiac') }}</div>
          <div class="text-lg font-bold" style="color:var(--text)">{{ info.zodiac }}</div>
        </div>
      </div>
      <div class="text-xs" style="color:var(--text-secondary)">{{ t('baby-age-note') }}</div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { t } from '../../i18n'

const date = ref('')
const info = reactive({})
const zodiacs = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']

function calc() {
  if (!date.value) { info.months = null; return }
  const d = new Date(date.value)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const days = Math.max(0, Math.floor((now - d) / 86400000))
  info.days = days
  info.months = Math.floor(days / 30.44)
  const y = d.getFullYear()
  info.zodiac = zodiacs[(y - 4) % 12]
}
</script>