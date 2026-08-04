<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('cron-gen') }}</h1>
    <p class="mb-6" style="color: var(--text-secondary);">{{ t('cron-gen-desc') }}</p>
    <div class="grid md:grid-cols-2 gap-6">
      <!-- Generator -->
      <div class="card space-y-4">
        <h3 class="font-semibold" style="color: var(--text);">{{ t('cron-gen') }}</h3>
        <div>
          <label class="text-sm font-medium block mb-1" style="color: var(--text-secondary);">{{ t('cron-minute') }}</label>
          <input v-model="cron.min" class="tool-input font-mono" placeholder="*">
        </div>
        <div>
          <label class="text-sm font-medium block mb-1" style="color: var(--text-secondary);">{{ t('cron-hour') }}</label>
          <input v-model="cron.hour" class="tool-input font-mono" placeholder="*">
        </div>
        <div>
          <label class="text-sm font-medium block mb-1" style="color: var(--text-secondary);">{{ t('cron-day') }}</label>
          <input v-model="cron.day" class="tool-input font-mono" placeholder="*">
        </div>
        <div>
          <label class="text-sm font-medium block mb-1" style="color: var(--text-secondary);">{{ t('cron-month') }}</label>
          <input v-model="cron.month" class="tool-input font-mono" placeholder="*">
        </div>
        <div>
          <label class="text-sm font-medium block mb-1" style="color: var(--text-secondary);">{{ t('cron-weekday') }}</label>
          <input v-model="cron.weekday" class="tool-input font-mono" placeholder="*">
        </div>
        <div>
          <label class="text-sm font-medium block mb-2" style="color: var(--text-secondary);">{{ t('cron-presets') }}</label>
          <div class="flex flex-wrap gap-2">
            <button v-for="p in presets" :key="p.expr" @click="applyPreset(p)" class="btn-secondary text-xs">{{ p.label }}</button>
          </div>
        </div>
        <div>
          <label class="text-sm font-medium block mb-2" style="color: var(--text-secondary);">{{ t('cron-result') }}</label>
          <div class="flex items-center gap-2">
            <code class="flex-1 p-3 rounded-lg font-mono text-lg" style="background: var(--bg); color: var(--primary);">{{ cronExpr }}</code>
            <button @click="copy" class="btn-primary">📋</button>
          </div>
          <p class="mt-2 text-sm" style="color: var(--text-secondary);">{{ t('cron-meaning') }}</p>
          <p class="mt-1 p-3 rounded-lg text-sm" style="background: var(--bg); color: var(--text);">{{ description }}</p>
        </div>
      </div>
      <!-- Parser -->
      <div class="card space-y-4">
        <h3 class="font-semibold" style="color: var(--text);">{{ t('cron-parser') }}</h3>
        <div>
          <label class="text-sm font-medium block mb-1" style="color: var(--text-secondary);">{{ t('cron-parser-input') }}</label>
          <input v-model="parseInput" class="tool-input font-mono" placeholder="0 9 * * 1-5" @input="parseCron">
        </div>
        <div v-if="parseError" class="p-3 rounded-lg text-sm" style="background: #fef2f2; color: #dc2626;">{{ parseError }}</div>
        <div v-if="parseResult">
          <label class="text-sm font-medium block mb-2" style="color: var(--text-secondary);">{{ t('cron-parser-desc') }}</label>
          <p class="p-3 rounded-lg text-sm mb-4" style="background: var(--bg); color: var(--text);">{{ parseResult.description }}</p>
          <label class="text-sm font-medium block mb-2" style="color: var(--text-secondary);">{{ t('cron-parser-next') }}</label>
          <div class="space-y-1">
            <div v-for="(time, i) in parseResult.nextTimes" :key="i" class="p-2 rounded text-sm font-mono" style="background: var(--bg); color: var(--text);">
              {{ time }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { t } from '../../i18n'

const cron = reactive({ min: '*', hour: '*', day: '*', month: '*', weekday: '*' })

const presets = computed(()=>[
  { label: t('cron-every-min'), expr: '* * * * *', vals: ['*','*','*','*','*'] },
  { label: t('cron-every-hour'), expr: '0 * * * *', vals: ['0','*','*','*','*'] },
  { label: t('cron-daily-9am'), expr: '0 9 * * *', vals: ['0','9','*','*','*'] },
  { label: t('cron-weekly-mon'), expr: '0 9 * * 1', vals: ['0','9','*','*','1'] },
  { label: t('cron-monthly-1st'), expr: '0 9 1 * *', vals: ['0','9','1','*','*'] },
  { label: t('cron-every-5min'), expr: '*/5 * * * *', vals: ['*/5','*','*','*','*'] },
])

function applyPreset(p) {
  [cron.min, cron.hour, cron.day, cron.month, cron.weekday] = p.vals
}

const cronExpr = computed(() => `${cron.min} ${cron.hour} ${cron.day} ${cron.month} ${cron.weekday}`)

const description = computed(() => {
  const parts = []
  if (cron.weekday !== '*') {
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    parts.push(cron.weekday.includes(',') ? cron.weekday.split(',').map(d => days[d]||d).join(', ') : (days[cron.weekday] || cron.weekday))
  }
  if (cron.day !== '*') parts.push(t('cron-day') + ' ' + cron.day)
  if (cron.month !== '*') parts.push(t('cron-month') + ' ' + cron.month)
  if (cron.hour !== '*') parts.push(cron.hour + 'h')
  if (cron.min !== '*') parts.push(cron.min + 'min')
  return parts.length ? parts.join(', ') : t('cron-every-min')
})

function copy() { navigator.clipboard.writeText(cronExpr.value); window.showToast?.(t('copied')) }

// --- Reverse Parser ---
const parseInput = ref('')
const parseError = ref('')
const parseResult = ref(null)

function parseCron() {
  parseError.value = ''
  parseResult.value = null
  const expr = parseInput.value.trim()
  if (!expr) return

  const parts = expr.split(/\s+/)
  if (parts.length < 5 || parts.length > 6) {
    parseError.value = t('cron-parser-invalid')
    return
  }

  const [min, hour, day, month, weekday] = parts
  const desc = buildDescription(min, hour, day, month, weekday)
  const nextTimes = getNextRuns(min, hour, day, month, weekday, 10)

  parseResult.value = { description: desc, nextTimes }
}

function buildDescription(min, hour, day, month, weekday) {
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  const months = ['','January','February','March','April','May','June','July','August','September','October','November','December']
  const parts = []

  if (weekday !== '*') {
    const dayNames = weekday.includes(',')
      ? weekday.split(',').map(d => days[parseInt(d)] || d).join(', ')
      : weekday.includes('-')
        ? `${days[parseInt(weekday.split('-')[0])]} to ${days[parseInt(weekday.split('-')[1])]}`
        : days[parseInt(weekday)] || weekday
    parts.push(`On ${dayNames}`)
  }
  if (day !== '*') parts.push(`on day ${day}`)
  if (month !== '*') {
    const m = month.includes(',') ? month.split(',').map(m => months[parseInt(m)]).join(', ') : months[parseInt(month)]
    parts.push(`in ${m}`)
  }
  if (hour !== '*') parts.push(`at ${hour}:00`)
  if (min !== '*') parts.push(`at minute ${min}`)

  if (parts.length === 0) return 'Every minute'
  return parts.join(', ')
}

function getNextRuns(min, hour, day, month, weekday, count) {
  const times = []
  const now = new Date()
  const d = new Date(now)
  d.setSeconds(0)
  d.setMilliseconds(0)
  d.setMinutes(d.getMinutes() + 1)

  for (let i = 0; i < 525960 && times.length < count; i++) {
    if (matchField(min, d.getMinutes()) && matchField(hour, d.getHours()) &&
        matchField(day, d.getDate()) && matchField(month, d.getMonth() + 1) &&
        matchField(weekday, d.getDay())) {
      times.push(formatDate(d))
    }
    d.setMinutes(d.getMinutes() + 1)
  }
  return times
}

function matchField(field, value) {
  if (field === '*') return true
  if (field.includes(',')) return field.split(',').some(f => matchSingle(f, value))
  return matchSingle(field, value)
}

function matchSingle(field, value) {
  if (field.includes('-')) {
    const [a, b] = field.split('-').map(Number)
    return value >= a && value <= b
  }
  if (field.includes('/')) {
    const [start, step] = field.split('/')
    const s = parseInt(step)
    if (start === '*') return value % s === 0
    const a = parseInt(start)
    return value >= a && (value - a) % s === 0
  }
  return parseInt(field) === value
}

function formatDate(d) {
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
</script>
