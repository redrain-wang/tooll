<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">👴 {{ t('retirement-age') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('retirement-age-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('birth-year') }}</label>
        <input v-model.number="year" type="number" min="1950" max="2010" class="tool-input flex-1 font-mono" placeholder="1990">
      </div>
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('gender') }}</label>
        <select v-model="gender" class="tool-input flex-1">
          <option value="male">{{ t('male') }}</option>
          <option value="female">{{ t('female') }}</option>
        </select>
      </div>

      <div v-if="info" class="pt-3 border-t grid grid-cols-2 gap-3" style="border-color:var(--border)">
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('retire-age') }}</div>
          <div class="text-lg font-bold text-indigo-600">{{ info.age }}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('retire-year') }}</div>
          <div class="text-lg font-bold" style="color:var(--text)">{{ info.retireYear }}</div>
        </div>
        <div class="card p-3 text-center col-span-2">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('working-years') }}</div>
          <div class="font-medium" style="color:var(--text)">{{ info.yearsLeft }} {{ t('years') }}</div>
        </div>
      </div>
      <div class="text-xs" style="color:var(--text-secondary)">{{ t('retirement-age-note') }}</div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'

const year = ref(1990)
const gender = ref('male')

const baseAge = { male: 60, female: 55 }
const femaleOfficer = 55

const info = computed(() => {
  const y = year.value
  if (!y) return null
  let age
  if (gender.value === 'male') {
    age = y <= 1964 ? 60 : y <= 1969 ? 61 : y <= 1974 ? 62 : y <= 1979 ? 63 : 64
  } else {
    age = y <= 1969 ? 55 : y <= 1974 ? 56 : y <= 1979 ? 57 : y <= 1984 ? 58 : 59
  }
  const retireYear = y + age
  const now = new Date().getFullYear()
  return {
    age,
    retireYear,
    yearsLeft: Math.max(0, retireYear - now),
    base: baseAge[gender.value],
  }
})
</script>