<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🎂 {{ t('age-calculator') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('age-calculator-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('birth-date') }}</label>
        <input v-model="date" type="date" class="tool-input flex-1" @change="calc">
      </div>
      <div v-if="info.years != null" class="pt-3 border-t grid grid-cols-3 gap-3" style="border-color:var(--border)">
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('age') }}</div>
          <div class="text-lg font-bold text-indigo-600">{{ info.years }}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('days-alive') }}</div>
          <div class="text-lg font-bold" style="color:var(--text)">{{ info.days }}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('zodiac') }}</div>
          <div class="text-lg font-bold" style="color:var(--text)">{{ info.zodiac }}</div>
        </div>
        <div class="card p-3 text-center col-span-3">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('next-birthday') }}</div>
          <div class="font-medium" style="color:var(--text)">{{ info.nextBirthday }}（{{ info.daysLeft }} {{ t('days') }}）</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { t } from '../../i18n'

const date = ref(new Date().toISOString().slice(0, 10))
const info = reactive({})
const zodiacs = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']

function calc() {
  if (!date.value) return
  const b = new Date(date.value)
  const now = new Date()
  let years = now.getFullYear() - b.getFullYear()
  if (now.getMonth() < b.getMonth() || (now.getMonth() === b.getMonth() && now.getDate() < b.getDate())) years--
  const days = Math.floor((now - b) / 86400000)
  let nb = new Date(now.getFullYear(), b.getMonth(), b.getDate())
  if (nb < now) nb = new Date(now.getFullYear() + 1, b.getMonth(), b.getDate())
  info.years = years
  info.days = days
  info.zodiac = zodiacs[(b.getFullYear() - 4) % 12]
  info.nextBirthday = nb.toLocaleDateString()
  info.daysLeft = Math.ceil((nb - now) / 86400000)
}
calc()
</script>