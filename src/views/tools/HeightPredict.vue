<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">📏 {{ t('height-predict') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('height-predict-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('father-height') }}</label>
        <input v-model.number="father" type="number" min="140" max="220" class="tool-input flex-1 font-mono" placeholder="175">
        <span class="text-sm">cm</span>
      </div>
      <div class="flex items-center gap-3">
        <label class="w-32 text-sm font-medium" style="color:var(--text-secondary)">{{ t('mother-height') }}</label>
        <input v-model.number="mother" type="number" min="140" max="220" class="tool-input flex-1 font-mono" placeholder="165">
        <span class="text-sm">cm</span>
      </div>

      <div v-if="results.length" class="pt-3 border-t grid grid-cols-2 gap-3" style="border-color:var(--border)">
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('son-height') }}</div>
          <div class="text-lg font-bold text-indigo-600">{{ results[0] }} cm</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('daughter-height') }}</div>
          <div class="text-lg font-bold" style="color:var(--text)">{{ results[1] }} cm</div>
        </div>
      </div>
      <div class="text-xs" style="color:var(--text-secondary)">{{ t('height-predict-note') }}</div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'

const father = ref(175)
const mother = ref(165)

const results = computed(() => {
  if (!father.value || !mother.value) return []
  const son = (father.value + mother.value + 13) / 2
  const daughter = (father.value + mother.value - 13) / 2
  return [son.toFixed(1), daughter.toFixed(1)]
})
</script>