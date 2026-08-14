<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">💧 {{ t('hydration-tracker') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('hydration-tracker-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('weight') }} (kg)</label>
        <input v-model.number="weight" type="number" min="30" max="250" class="tool-input flex-1 font-mono" @input="calc">
      </div>
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('daily-goal') }}</label>
        <select v-model="level" class="tool-input flex-1" @change="calc">
          <option value="normal">{{ t('activity-1') }}</option>
          <option value="sport">{{ t('hydration-sport') }}</option>
        </select>
      </div>

      <div class="pt-3 border-t space-y-3" style="border-color:var(--border)">
        <div class="flex items-center justify-between">
          <div class="text-sm" style="color:var(--text-secondary)">{{ t('daily-water-need') }}</div>
          <div class="font-bold text-lg text-indigo-600">{{ goal }} ml</div>
        </div>
        <div class="flex items-center gap-3">
          <button @click="add(250)" class="btn-primary">+250ml</button>
          <button @click="add(500)" class="btn-secondary">+500ml</button>
          <button @click="reset" class="btn-secondary">🗑️ {{ t('reset') }}</button>
        </div>
        <div class="h-4 rounded-full overflow-hidden" style="background:var(--bg);border:1px solid var(--border)">
          <div class="h-full transition-all" :style="{ width: pct + '%', background: pct >= 100 ? '#22c55e' : 'var(--primary)' }"></div>
        </div>
        <div class="text-sm" style="color:var(--text-secondary)">{{ drank }} / {{ goal }} ml ({{ pct }}%)</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'

const weight = ref(60)
const level = ref('normal')
const drank = ref(0)

const goal = computed(() => {
  const base = weight.value * 30
  return level.value === 'sport' ? Math.round(base * 1.3) : Math.round(base)
})
const pct = computed(() => goal.value ? Math.min(100, Math.round(drank.value / goal.value * 100)) : 0)

function calc() { drank.value = Math.min(drank.value, goal.value) }
function add(ml) { drank.value += ml; if (drank.value > goal.value * 1.5) drank.value = goal.value * 1.5 }
function reset() { drank.value = 0 }
</script>