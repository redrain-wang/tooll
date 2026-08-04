<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('ts-enhanced-title') }}</h1>
    <p class="mb-6" style="color: var(--text-secondary);">{{ t('ts-enhanced-desc') }}</p>

    <div class="card mb-6">
      <h3 class="font-semibold mb-4">{{ t('ts-enhanced-now') }}</h3>
      <div class="grid md:grid-cols-2 gap-4 mb-4">
        <div class="p-3 rounded-lg" style="background: var(--bg);">
          <p class="text-xs mb-1" style="color: var(--text-secondary);">{{ t('ts-enhanced-seconds') }}</p>
          <p class="text-xl font-mono font-bold" style="color: var(--primary);">{{ nowSeconds }}</p>
        </div>
        <div class="p-3 rounded-lg" style="background: var(--bg);">
          <p class="text-xs mb-1" style="color: var(--text-secondary);">{{ t('ts-enhanced-millis') }}</p>
          <p class="text-xl font-mono font-bold" style="color: var(--primary);">{{ nowMillis }}</p>
        </div>
      </div>
      <div class="grid md:grid-cols-2 gap-4">
        <div class="p-3 rounded-lg" style="background: var(--bg);">
          <p class="text-xs mb-1" style="color: var(--text-secondary);">{{ t('ts-enhanced-relative') }}</p>
          <p class="text-sm" style="color: var(--text);">{{ relativeTime }}</p>
        </div>
        <div class="p-3 rounded-lg" style="background: var(--bg);">
          <p class="text-xs mb-1" style="color: var(--text-secondary);">{{ t('ts-enhanced-readable') }}</p>
          <p class="text-sm" style="color: var(--text);">{{ readableNow }}</p>
        </div>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-6 mb-6">
      <div class="card">
        <h3 class="font-semibold mb-4">{{ t('ts-to-date') }}</h3>
        <input v-model="tsInput" class="tool-input mb-3 font-mono" :placeholder="t('ts-placeholder')">
        <div class="flex gap-3 mb-3">
          <select v-model="tzConvert" class="tool-input" style="flex: 1;">
            <option value="local">{{ t('ts-enhanced-local') }}</option>
            <option value="UTC">UTC</option>
            <option v-for="tz in commonTimezones" :key="tz" :value="tz">{{ tz }}</option>
          </select>
        </div>
        <button @click="tsToDate" class="btn-primary w-full">{{ t('convert') }}</button>
        <div v-if="tsResult" class="mt-3 p-3 rounded-lg text-sm" style="background: var(--bg); color: var(--text);">
          <div v-for="(val, key) in tsResult" :key="key" class="flex justify-between py-1" style="border-bottom: 1px solid var(--border);">
            <span style="color: var(--text-secondary);">{{ key }}</span>
            <span class="font-mono">{{ val }}</span>
          </div>
          <button @click="copyText(Object.values(tsResult).join('\n'))" class="btn-secondary mt-2 w-full text-xs">{{ t('copy') }}</button>
        </div>
      </div>
      <div class="card">
        <h3 class="font-semibold mb-4">{{ t('date-to-ts') }}</h3>
        <input v-model="dateInput" type="datetime-local" class="tool-input mb-3" step="1">
        <button @click="dateToTs" class="btn-primary w-full mb-3">{{ t('convert') }}</button>
        <div v-if="dateResult" class="p-3 rounded-lg text-sm font-mono" style="background: var(--bg); color: var(--text);">
          <div class="flex justify-between py-1" style="border-bottom: 1px solid var(--border);">
            <span style="color: var(--text-secondary);">s</span>
            <span>{{ dateResult.s }}</span>
          </div>
          <div class="flex justify-between py-1" style="border-bottom: 1px solid var(--border);">
            <span style="color: var(--text-secondary);">ms</span>
            <span>{{ dateResult.ms }}</span>
          </div>
          <div class="flex justify-between py-1" style="border-bottom: 1px solid var(--border);">
            <span style="color: var(--text-secondary);">ISO</span>
            <span class="text-xs">{{ dateResult.iso }}</span>
          </div>
          <button @click="copyText(dateResult.s + '\n' + dateResult.ms)" class="btn-secondary mt-2 w-full text-xs">{{ t('copy') }}</button>
        </div>
      </div>
    </div>

    <div class="card">
      <h3 class="font-semibold mb-4">{{ t('ts-enhanced-timezones') }}</h3>
      <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        <div v-for="zone in displayTimezones" :key="zone.name" class="p-3 rounded-lg" style="background: var(--bg);">
          <p class="text-xs mb-1 font-semibold" style="color: var(--text-secondary);">{{ zone.name }}</p>
          <p class="text-sm font-mono" style="color: var(--text);">{{ zone.time }}</p>
        </div>
      </div>
    </div>

    <div v-if="toast" class="toast show">{{ toast }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { t } from '../../i18n'

const nowSeconds = ref(Math.floor(Date.now() / 1000))
const nowMillis = ref(Date.now())
const tsInput = ref('')
const tsResult = ref(null)
const dateInput = ref('')
const dateResult = ref(null)
const tzConvert = ref('local')
const toast = ref('')
let timer

const commonTimezones = [
  'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo',
  'Asia/Shanghai', 'Asia/Kolkata', 'Asia/Dubai', 'Australia/Sydney'
]

const displayTimezones = computed(() => {
  const now = new Date()
  const zones = [
    { name: 'UTC', tz: 'UTC' },
    { name: t('ts-enhanced-local'), tz: Intl.DateTimeFormat().resolvedOptions().timeZone },
    { name: 'New York', tz: 'America/New_York' },
    { name: 'London', tz: 'Europe/London' },
    { name: 'Tokyo', tz: 'Asia/Tokyo' },
    { name: 'Shanghai', tz: 'Asia/Shanghai' },
    { name: 'Sydney', tz: 'Australia/Sydney' },
    { name: 'Dubai', tz: 'Asia/Dubai' },
    { name: 'Paris', tz: 'Europe/Paris' }
  ]
  return zones.map(z => ({
    name: z.name,
    time: formatDateInZone(now, z.tz)
  }))
})

const relativeTime = computed(() => {
  const now = Date.now()
  const diff = Math.floor((now - nowMillis.value) / 1000)
  if (diff < 5) return t('ts-enhanced-just-now')
  if (diff < 60) return diff + ' ' + t('ts-enhanced-seconds-ago')
  if (diff < 3600) return Math.floor(diff / 60) + ' ' + t('ts-enhanced-minutes-ago')
  if (diff < 86400) return Math.floor(diff / 3600) + ' ' + t('ts-enhanced-hours-ago')
  return Math.floor(diff / 86400) + ' ' + t('ts-enhanced-days-ago')
})

const readableNow = computed(() => {
  return new Date(nowMillis.value).toLocaleString(undefined, {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  })
})

function formatDateInZone(date, tz) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: tz,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false
    }).format(date)
  } catch {
    return '-'
  }
}

function tsToDate() {
  if (!tsInput.value) return
  let ts = parseInt(tsInput.value)
  if (isNaN(ts)) return
  if (ts > 1e12) ts = Math.floor(ts / 1000)
  const d = new Date(ts * 1000)
  const result = {}
  result[t('ts-enhanced-local')] = d.toLocaleString()
  result['UTC'] = d.toUTCString()
  result['ISO'] = d.toISOString()
  if (tzConvert.value !== 'local') {
    try {
      result[tzConvert.value] = new Intl.DateTimeFormat('en-GB', {
        timeZone: tzConvert.value,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
      }).format(d)
    } catch {}
  }
  tsResult.value = result
}

function dateToTs() {
  if (!dateInput.value) return
  const d = new Date(dateInput.value)
  if (isNaN(d.getTime())) return
  dateResult.value = {
    s: Math.floor(d.getTime() / 1000),
    ms: d.getTime(),
    iso: d.toISOString()
  }
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    toast.value = t('copied')
    setTimeout(() => toast.value = '', 2000)
  })
}

onMounted(() => {
  timer = setInterval(() => {
    nowSeconds.value = Math.floor(Date.now() / 1000)
    nowMillis.value = Date.now()
  }, 1000)
  dateInput.value = new Date().toISOString().slice(0, 19)
})

onUnmounted(() => clearInterval(timer))
</script>
