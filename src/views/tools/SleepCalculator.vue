<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">😴 {{ t('sleep-calculator') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('sleep-calculator-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="flex items-center gap-3">
        <label class="w-40 text-sm font-medium" style="color:var(--text-secondary)">{{ t('wake-up-time') }}</label>
        <input v-model="wake" type="time" class="tool-input flex-1" @change="calc">
      </div>
      <div class="text-xs mt-1" style="color:var(--text-secondary)">{{ t('sleep-cycles') }}: 90 {{ t('minutes') }}</div>

      <div class="pt-3 border-t" style="border-color:var(--border)">
        <div class="text-xs mb-3" style="color:var(--text-secondary)">{{ t('suggested-bedtime') }}</div>
        <div class="space-y-2">
          <div v-for="(s, i) in suggestions" :key="i" class="flex items-center justify-between card p-3">
            <div class="flex items-center gap-3">
              <span class="font-mono font-bold text-indigo-600">{{ s.time }}</span>
              <span class="text-sm" style="color:var(--text-secondary)">{{ s.cycles }} {{ t('sleep-cycles') }}</span>
            </div>
            <span class="text-xs px-2 py-1 rounded-full" :class="i === 0 ? 'bg-indigo-100 text-indigo-700' : ''" style="background:var(--bg)">
              {{ s.hours }}h {{ s.min }}m
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'

const wake = ref('07:00')

const suggestions = computed(() => {
  const [h, m] = wake.value.split(':').map(Number)
  if (isNaN(h)) return []
  const wakeMin = h * 60 + m
  const res = []
  for (let cycles = 6; cycles >= 4; cycles--) {
    let bed = wakeMin - cycles * 90 - 15
    bed = ((bed % 1440) + 1440) % 1440
    const bh = Math.floor(bed / 60), bm = bed % 60
    const sleepH = cycles * 90, hours = Math.floor(sleepH / 60), min = sleepH % 60
    res.push({ time: `${String(bh).padStart(2, '0')}:${String(bm).padStart(2, '0')}`, cycles, hours, min })
  }
  return res
})
</script>