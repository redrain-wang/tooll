<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🌡️ {{ t('temperature-converter') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('temperature-converter-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div v-for="u in units" :key="u" class="flex items-center gap-3">
        <span class="w-24 text-sm font-medium" style="color:var(--text-secondary)">{{ u }} (°{{ u === 'Celsius' ? 'C' : u === 'Fahrenheit' ? 'F' : 'K' }})</span>
        <input v-model.number="values[u]" type="number" @input="convertFrom(u)"
          class="tool-input flex-1 font-mono" :placeholder="u">
      </div>
      <div class="pt-3 border-t" style="border-color:var(--border)">
        <button @click="convertFrom('Celsius')" class="btn-primary">⟳ {{ t('convert') }}</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { t } from '../../i18n'

const units = ['Celsius', 'Fahrenheit', 'Kelvin']
const values = ref({ Celsius: 25, Fahrenheit: '', Kelvin: '' })

function toCelsius(v, unit) {
  if (v === '' || v === null || isNaN(v)) return null
  if (unit === 'Celsius') return v
  if (unit === 'Fahrenheit') return (v - 32) * 5 / 9
  if (unit === 'Kelvin') return v - 273.15
}
function fromCelsius(c, unit) {
  if (c === null) return ''
  if (unit === 'Celsius') return round(c)
  if (unit === 'Fahrenheit') return round(c * 9 / 5 + 32)
  if (unit === 'Kelvin') return round(c + 273.15)
}
function round(n) { return Math.round(n * 100) / 100 }

function convertFrom(unit) {
  const c = toCelsius(values.value[unit], unit)
  units.forEach(u => { if (u !== unit) values.value[u] = fromCelsius(c, u) })
}
</script>