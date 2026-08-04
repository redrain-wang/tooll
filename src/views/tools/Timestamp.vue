<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('timestamp') }}</h1>
    <p class="mb-6" style="color: var(--text-secondary);">{{ t('timestamp-desc') }}</p>
    <div class="card mb-6 text-center">
      <p class="text-sm mb-1" style="color: var(--text-secondary);">{{ t('current-timestamp') }}</p>
      <p class="text-3xl font-mono font-bold" style="color: var(--primary);">{{ now }}</p>
      <p class="text-sm mt-1" style="color: var(--text-secondary);">{{ nowDate }}</p>
    </div>
    <div class="grid md:grid-cols-2 gap-6">
      <div class="card">
        <h3 class="font-semibold mb-4">{{ t('ts-to-date') }}</h3>
        <input v-model="tsInput" class="tool-input mb-3 font-mono" :placeholder="t('ts-placeholder')">
        <button @click="tsToDate" class="btn-primary w-full">{{ t('convert') || 'Convert' }}</button>
        <div v-if="tsResult" class="mt-3 p-3 rounded-lg text-sm" style="background: var(--bg); color: var(--text);">
          <p><strong>{{ t('local-time') }}:</strong> {{ tsResult.local }}</p>
          <p><strong>{{ t('utc-time') }}:</strong> {{ tsResult.utc }}</p>
          <p class="text-xs mt-1" style="color: var(--text-secondary);">{{ tsResult.iso }}</p>
        </div>
      </div>
      <div class="card">
        <h3 class="font-semibold mb-4">{{ t('date-to-ts') }}</h3>
        <input v-model="dateInput" type="datetime-local" class="tool-input mb-3">
        <button @click="dateToTs" class="btn-primary w-full">{{ t('convert') || 'Convert' }}</button>
        <div v-if="dateResult" class="mt-3 p-3 rounded-lg text-sm font-mono" style="background: var(--bg); color: var(--text);">
          <p><strong>s:</strong> {{ dateResult.s }}</p>
          <p><strong>ms:</strong> {{ dateResult.ms }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { t } from '../../i18n'
const now = ref(Math.floor(Date.now() / 1000))
const nowDate = ref(new Date().toLocaleString('zh-CN'))
const tsInput = ref('')
const tsResult = ref(null)
const dateInput = ref('')
const dateResult = ref(null)
let timer
onMounted(() => { timer = setInterval(() => { now.value = Math.floor(Date.now() / 1000); nowDate.value = new Date().toLocaleString() }, 1000) })
onUnmounted(() => clearInterval(timer))
function tsToDate() {
  let ts = parseInt(tsInput.value); if (ts > 1e12) ts = Math.floor(ts / 1000)
  const d = new Date(ts * 1000); tsResult.value = { local: d.toLocaleString(), utc: d.toUTCString(), iso: d.toISOString() }
}
function dateToTs() { const d = new Date(dateInput.value); dateResult.value = { s: Math.floor(d.getTime() / 1000), ms: d.getTime() } }
</script>
