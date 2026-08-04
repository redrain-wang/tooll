<template>
  <div class="tool-container">
    <h1 class="tool-title">{{ t('cssUnit.title') }}</h1>

    <div class="settings-row card">
      <div class="setting-item">
        <label>{{ t('cssUnit.baseFontSize') }}</label>
        <div class="input-group">
          <input
            type="number"
            class="tool-input"
            v-model.number="baseFontSize"
            min="1"
          />
          <span class="unit-label">px</span>
        </div>
      </div>
      <div class="setting-item">
        <label>{{ t('cssUnit.viewportWidth') }}</label>
        <div class="input-group">
          <input
            type="number"
            class="tool-input"
            v-model.number="viewportWidth"
            min="1"
          />
          <span class="unit-label">px</span>
        </div>
      </div>
    </div>

    <div class="card input-section">
      <label>{{ t('cssUnit.inputValue') }}</label>
      <div class="input-row">
        <select class="tool-select" v-model="inputUnit">
          <option v-for="unit in units" :key="unit" :value="unit">
            {{ unit }}
          </option>
        </select>
        <input
          type="number"
          class="tool-input input-value"
          v-model.number="inputValue"
          placeholder="0"
        />
        <button class="btn-secondary" @click="reset">
          {{ t('cssUnit.reset') }}
        </button>
      </div>
    </div>

    <div class="results-grid">
      <div
        v-for="unit in otherUnits"
        :key="unit"
        class="result-card card"
      >
        <div class="result-label">{{ unit }}</div>
        <div class="result-value">{{ results[unit] }}</div>
        <button class="btn-copy" @click="copyToClipboard(unit)">
          {{ t('cssUnit.copy') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'

const units = ['px', 'rem', 'em', 'vw', 'vh', 'pt', '%']

const baseFontSize = ref(16)
const viewportWidth = ref(1920)
const inputValue = ref(0)
const inputUnit = ref('px')

const otherUnits = computed(() =>
  units.filter((u) => u !== inputUnit.value)
)

const results = computed(() => {
  const px = convertToPx(inputValue.value, inputUnit.value)
  const conversions = {}
  for (const unit of units) {
    if (unit === inputUnit.value) {
      conversions[unit] = inputValue.value
    } else {
      conversions[unit] = round(convertFromPx(px, unit))
    }
  }
  return conversions
})

function convertToPx(value, unit) {
  switch (unit) {
    case 'px':
      return value
    case 'rem':
    case 'em':
      return value * baseFontSize.value
    case 'vw':
      return (value / 100) * viewportWidth.value
    case 'vh':
      return (value / 100) * (viewportWidth.value * 0.5625)
    case 'pt':
      return value * (96 / 72)
    case '%':
      return (value / 100) * baseFontSize.value
    default:
      return value
  }
}

function convertFromPx(px, unit) {
  switch (unit) {
    case 'px':
      return px
    case 'rem':
    case 'em':
      return px / baseFontSize.value
    case 'vw':
      return (px / viewportWidth.value) * 100
    case 'vh':
      return (px / (viewportWidth.value * 0.5625)) * 100
    case 'pt':
      return px * (72 / 96)
    case '%':
      return (px / baseFontSize.value) * 100
    default:
      return px
  }
}

function round(num) {
  return Math.round(num * 10000) / 10000
}

function reset() {
  inputValue.value = 0
  inputUnit.value = 'px'
}

function copyToClipboard(unit) {
  navigator.clipboard.writeText(String(results.value[unit]))
}
</script>

<style scoped>
.tool-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.tool-title {
  font-size: 1.5rem;
  color: var(--text);
  margin-bottom: 24px;
}

.settings-row {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  padding: 16px;
}

.setting-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-item label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.unit-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.input-section {
  padding: 16px;
  margin-bottom: 16px;
}

.input-section label {
  display: block;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.input-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.tool-input,
.tool-select {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text);
  padding: 8px 12px;
  font-size: 1rem;
  outline: none;
}

.tool-input:focus,
.tool-select:focus {
  border-color: var(--primary);
}

.input-value {
  flex: 1;
}

.btn-primary,
.btn-secondary {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: var(--primary);
  color: #fff;
}

.btn-secondary {
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--text);
}

.btn-secondary:hover {
  opacity: 0.8;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.result-card {
  padding: 16px;
  text-align: center;
  position: relative;
}

.result-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  margin-bottom: 8px;
}

.result-value {
  font-size: 1.25rem;
  color: var(--text);
  font-weight: 600;
  margin-bottom: 8px;
}

.btn-copy {
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--text-secondary);
  padding: 4px 8px;
  font-size: 0.75rem;
  cursor: pointer;
}

.btn-copy:hover {
  border-color: var(--primary);
  color: var(--primary);
}
</style>
