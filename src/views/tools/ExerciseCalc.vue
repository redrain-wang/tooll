<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🏃 {{ t('exercise-calc') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('exercise-calc-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('exercise-type') }}</label>
        <select v-model="activity" class="tool-input flex-1">
          <option v-for="a in activities" :key="a.key" :value="a.key">{{ t('ex-' + a.key) }}</option>
        </select>
      </div>
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('duration') }} (min)</label>
        <input v-model.number="minutes" type="number" min="1" class="tool-input flex-1 font-mono">
      </div>
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('weight') }} (kg)</label>
        <input v-model.number="weight" type="number" min="30" max="250" class="tool-input flex-1 font-mono">
      </div>

      <div v-if="burn" class="pt-3 border-t" style="border-color:var(--border)">
        <div class="card p-4 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('calories-burned') }}</div>
          <div class="text-2xl font-bold text-indigo-600">{{ burn }} kcal</div>
        </div>
        <div class="text-xs mt-2 text-center" style="color:var(--text-secondary)">{{ t('exercise-note') }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'

const activities = [
  { key: 'walking', met: 3.5 }, { key: 'jogging', met: 7 }, { key: 'running', met: 9.8 },
  { key: 'cycling', met: 7.5 }, { key: 'swimming', met: 8 }, { key: 'jump', met: 11 },
  { key: 'yoga', met: 3 }, { key: 'dance', met: 5.5 }, { key: 'basketball', met: 6.5 },
  { key: 'badminton', met: 5.5 }, { key: 'football', met: 7 }, { key: 'table-tennis', met: 4 },
]
const activity = ref('walking')
const minutes = ref(30)
const weight = ref(60)

const burn = computed(() => {
  if (!minutes.value || !weight.value) return null
  const met = activities.find(a => a.key === activity.value).met
  return Math.round(met * 3.5 * weight.value / 200 * minutes.value)
})
</script>