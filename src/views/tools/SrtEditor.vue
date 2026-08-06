<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🎬 {{ t('srt-editor') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('srt-editor-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <textarea v-model="srt" rows="8" class="tool-input w-full font-mono text-xs" :placeholder="t('srt-hint')"></textarea>
      <div class="flex items-center gap-3">
        <label class="text-sm font-medium w-32" style="color:var(--text-secondary)">{{ t('time-shift') }}</label>
        <input v-model.number="shift" type="number" step="0.5" class="tool-input w-24 font-mono">
        <span class="text-sm">{{ t('seconds') }}</span>
        <button @click="applyShift" class="btn-primary ml-auto">▶ {{ t('apply') }}</button>
      </div>
      <div v-if="lines" class="text-sm" style="color:var(--text-secondary)">
        {{ t('total-rows') }}: {{ lines }}
        <button @click="copy" class="btn-secondary ml-2">📋 {{ t('copy') }}</button>
        <button @click="download" class="btn-secondary ml-2">⬇️ {{ t('download') }}</button>
      </div>
      <div v-if="err" class="text-sm text-red-500">{{ err }}</div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'

const srt = ref('')
const shift = ref(0)
const err = ref('')

const lines = computed(() => srt.value.trim() ? srt.value.split('\n').filter(l => l.trim()).length : null)

function parseTime(s) {
  const m = s.match(/(\d+):(\d{2}):(\d{2}),(\d{3})/)
  if (!m) return null
  return (+m[1]) * 3600 + (+m[2]) * 60 + (+m[3]) + (+m[4]) / 1000
}
function fmtTime(sec) {
  const s = Math.max(0, sec)
  const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), secs = Math.floor(s % 60), ms = Math.round((s - Math.floor(s)) * 1000)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`
}

function applyShift() {
  err.value = ''
  const d = shift.value
  if (!d) return
  const out = srt.value.split('\n').map(line => {
    const m = line.match(/^(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})(.*)$/)
    if (!m) return line
    const t1 = parseTime(m[1]), t2 = parseTime(m[2])
    if (t1 == null || t2 == null) return line
    return `${fmtTime(t1 + d)} --> ${fmtTime(t2 + d)}${m[3]}`
  })
  srt.value = out.join('\n')
}
function copy() { navigator.clipboard.writeText(srt.value); window.showToast?.(t('copied')) }
function download() {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([srt.value], { type: 'text/plain' }))
  a.download = 'subtitles.srt'
  a.click()
}
</script>