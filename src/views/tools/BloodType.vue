<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🩸 {{ t('blood-type') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('blood-type-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-sm font-medium" style="color:var(--text-secondary)">{{ t('father') }}</label>
          <select v-model="father" class="tool-input w-full mt-1">
            <option v-for="b in bloodTypes" :key="'f'+b" :value="b">{{ b }}</option>
          </select>
        </div>
        <div>
          <label class="text-sm font-medium" style="color:var(--text-secondary)">{{ t('mother') }}</label>
          <select v-model="mother" class="tool-input w-full mt-1">
            <option v-for="b in bloodTypes" :key="'m'+b" :value="b">{{ b }}</option>
          </select>
        </div>
      </div>

      <div class="pt-3 border-t" style="border-color:var(--border)">
        <div class="text-xs mb-2" style="color:var(--text-secondary)">{{ t('possible-types') }}</div>
        <div class="flex flex-wrap gap-2">
          <span v-for="b in possible" :key="b" class="px-4 py-2 rounded-lg font-bold text-white" :style="{ background: color(b) }">{{ b }}</span>
        </div>
      </div>
      <div class="text-xs" style="color:var(--text-secondary)">{{ t('blood-type-note') }}</div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'

const bloodTypes = ['A', 'B', 'AB', 'O']
const father = ref('A')
const mother = ref('B')

const matrix = {
  'A,A': ['A', 'O'],
  'A,B': ['A', 'B', 'AB', 'O'],
  'A,AB': ['A', 'B', 'AB'],
  'A,O': ['A', 'O'],
  'B,B': ['B', 'O'],
  'B,AB': ['A', 'B', 'AB'],
  'B,O': ['B', 'O'],
  'AB,AB': ['A', 'B', 'AB'],
  'AB,O': ['A', 'B'],
  'O,O': ['O'],
}

const possible = computed(() => {
  const key = [father.value, mother.value].sort().join(',')
  return matrix[key] || []
})
function color(b) {
  return { A: '#ef4444', B: '#3b82f6', AB: '#8b5cf6', O: '#10b981' }[b]
}
</script>