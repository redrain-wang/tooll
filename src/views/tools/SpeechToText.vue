<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🎙️ {{ t('speech-to-text') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('speech-to-text-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="flex items-center gap-3">
        <label class="text-sm font-medium" style="color:var(--text-secondary)">{{ t('language') }}</label>
        <select v-model="lang" class="tool-input w-48">
          <option value="zh-CN">中文（普通话）</option>
          <option value="en-US">English (US)</option>
          <option value="en-GB">English (UK)</option>
          <option value="ja-JP">日本語</option>
        </select>
      </div>

      <button @click="toggle" class="btn-primary" :class="listening?'opacity-60':''">
        {{ listening ? '🔴 ' + t('stop') : '🎙️ ' + t('start-listening') }}
      </button>
      <div v-if="unsupported" class="text-sm text-red-500">{{ t('speech-unsupported') }}</div>

      <textarea v-model="text" rows="8" class="tool-input w-full" :placeholder="t('speech-placeholder')"></textarea>
      <div class="flex gap-2">
        <button @click="copy" class="btn-primary">{{ t('copy') }}</button>
        <button @click="text=''" class="btn-secondary">{{ t('clear') }}</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onUnmounted } from 'vue'
import { t } from '../../i18n'

const text = ref('')
const lang = ref('zh-CN')
const listening = ref(false)
const unsupported = ref(false)
let rec = null

const SR = window.SpeechRecognition || window.webkitSpeechRecognition
unsupported.value = !SR

function toggle() {
  if (listening.value) { rec?.stop(); return }
  if (!SR) return
  rec = new SR()
  rec.lang = lang.value
  rec.continuous = true
  rec.interimResults = true
  rec.onresult = (e) => {
    let final = ''
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) final += e.results[i][0].transcript
    }
    if (final) text.value += final
  }
  rec.onend = () => { listening.value = false }
  rec.onerror = () => { listening.value = false }
  rec.start()
  listening.value = true
}
function copy() { navigator.clipboard.writeText(text.value); window.showToast?.(t('copied')) }
onUnmounted(() => rec?.stop())
</script>