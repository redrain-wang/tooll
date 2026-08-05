<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🔥 {{ t('calorie-calculator') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('calorie-calculator-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('gender') }}</label>
        <select v-model="gender" class="tool-input flex-1">
          <option value="male">{{ t('male') }}</option>
          <option value="female">{{ t('female') }}</option>
        </select>
      </div>
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('height') }} (cm)</label>
        <input v-model.number="height" type="number" min="80" max="250" class="tool-input flex-1 font-mono" placeholder="170">
      </div>
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('weight') }} (kg)</label>
        <input v-model.number="weight" type="number" min="30" max="250" class="tool-input flex-1 font-mono" placeholder="65">
      </div>
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('age') }}</label>
        <input v-model.number="age" type="number" min="10" max="100" class="tool-input flex-1 font-mono" placeholder="30">
      </div>
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('activity-level') }}</label>
        <select v-model="activity" class="tool-input flex-1">
          <option :value="1.2">{{ t('activity-1') }}</option>
          <option :value="1.375">{{ t('activity-2') }}</option>
          <option :value="1.55">{{ t('activity-3') }}</option>
          <option :value="1.725">{{ t('activity-4') }}</option>
          <option :value="1.9">{{ t('activity-5') }}</option>
        </select>
      </div>

      <div v-if="bmr" class="pt-3 border-t grid grid-cols-2 gap-3" style="border-color:var(--border)">
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('bmr') }}</div>
          <div class="text-lg font-bold text-indigo-600">{{ bmr }} kcal</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('daily-need') }}</div>
          <div class="text-lg font-bold" style="color:var(--text)">{{ tdee }} kcal</div>
        </div>
      </div>
      <div v-if="bmr" class="text-xs" style="color:var(--text-secondary)">Mifflin-St Jeor</div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'

const gender = ref('male')
const height = ref(170)
const weight = ref(65)
const age = ref(30)
const activity = ref(1.375)

const bmr = computed(() => {
  if (!height.value || !weight.value || !age.value) return null
  const base = 10 * weight.value + 6.25 * height.value - 5 * age.value
  return Math.round(gender.value === 'male' ? base + 5 : base - 161)
})
const tdee = computed(() => bmr.value ? Math.round(bmr.value * activity.value) : null)
</script>