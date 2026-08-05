<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🌍 {{ t('world-clock') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('world-clock-desc') }}</p>

    <div class="card p-6 space-y-3 max-w-2xl">
      <div v-for="c in cities" :key="c.name" class="flex items-center justify-between py-2 border-b last:border-0" style="border-color:var(--border)">
        <div>
          <div class="font-medium" style="color:var(--text)">{{ c.name }}</div>
          <div class="text-xs" style="color:var(--text-secondary)">{{ c.offset >= 0 ? '+' : '' }}{{ c.offset }}:00</div>
        </div>
        <div class="font-mono text-lg font-bold text-indigo-600" :data-offset="c.offset" :data-zone="c.name">{{ time(c.offset) }}</div>
      </div>
      <div class="text-xs" style="color:var(--text-secondary)">{{ t('world-clock-note') }}</div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { t } from '../../i18n'

const now = ref(new Date())
let timer
onMounted(() => { timer = setInterval(() => { now.value = new Date() }, 1000) })
onUnmounted(() => clearInterval(timer))

const cities = [
  { name: 'London / UTC', offset: 0 },
  { name: 'Paris / Berlin', offset: 1 },
  { name: 'Beijing / Shanghai', offset: 8 },
  { name: 'Tokyo', offset: 9 },
  { name: 'New York', offset: -5 },
  { name: 'Chicago', offset: -6 },
  { name: 'Los Angeles', offset: -8 },
  { name: 'Sydney', offset: 10 },
  { name: 'Dubai', offset: 4 },
  { name: 'Singapore', offset: 8 },
]
function time(offset) {
  const d = new Date(now.value.getTime() + offset * 3600000)
  return d.toUTCString().slice(17, 25)
}
</script>