<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🔊 {{ t('tts-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('tts-desc') }}</p>
    <div class="space-y-4">
      <textarea v-model="text" class="tool-input h-40 font-mono text-sm" :placeholder="t('tts-placeholder')"></textarea>

      <div class="card space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1" style="color:var(--text-secondary)">{{ t('tts-voice') }}</label>
            <select v-model="selectedVoiceURI" class="tool-input text-sm">
              <option v-for="v in voices" :key="v.voiceURI" :value="v.voiceURI">{{ v.name }} ({{ v.lang }})</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" style="color:var(--text-secondary)">{{ t('tts-lang') }}</label>
            <select v-model="lang" class="tool-input text-sm">
              <option v-for="l in languages" :key="l" :value="l">{{ l }}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1" style="color:var(--text-secondary)">{{ t('tts-rate') }}: {{ rate }}</label>
            <input type="range" v-model.number="rate" min="0.1" max="10" step="0.1" class="w-full accent-[var(--primary)]">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" style="color:var(--text-secondary)">{{ t('tts-pitch') }}: {{ pitch }}</label>
            <input type="range" v-model.number="pitch" min="0" max="2" step="0.1" class="w-full accent-[var(--primary)]">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" style="color:var(--text-secondary)">{{ t('tts-volume') }}: {{ volume }}</label>
            <input type="range" v-model.number="volume" min="0" max="1" step="0.05" class="w-full accent-[var(--primary)]">
          </div>
        </div>

        <div class="flex items-center gap-2">
          <label class="flex items-center gap-2 text-sm" style="color:var(--text-secondary)">
            <input type="checkbox" v-model="highlightWords" class="rounded"> {{ t('tts-highlight') }}
          </label>
        </div>
      </div>

      <div class="flex gap-3">
        <button v-if="!speaking" @click="speak" class="btn-primary px-8 py-3">▶ {{ t('tts-play') }}</button>
        <button v-else @click="pause" class="btn-secondary px-8 py-3">⏸ {{ t('tts-pause') }}</button>
        <button @click="stop" class="btn-secondary px-8 py-3">⏹ {{ t('tts-stop') }}</button>
      </div>

      <div v-if="highlightWords && text" class="card p-4 leading-relaxed text-sm" style="color:var(--text)">
        <template v-for="(word, i) in words" :key="i">
          <span :style="i === currentWordIndex
            ? 'background:var(--primary);color:white;border-radius:3px;padding:1px 3px'
            : ''">{{ word }}{{ ' ' }}</span>
        </template>
        <span v-if="!words.length" style="color:var(--text-secondary)">{{ t('tts-no-text') }}</span>
      </div>

      <div v-if="error" class="card p-3 text-sm" style="color:#ef4444">
        ⚠ {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, watch } from 'vue'
import { t } from '../../i18n'

const text = ref('')
const rate = ref(1)
const pitch = ref(1)
const volume = ref(1)
const speaking = ref(false)
const paused = ref(false)
const voices = ref([])
const selectedVoiceURI = ref('')
const lang = ref('')
const highlightWords = ref(true)
const currentWordIndex = ref(-1)
const error = ref('')
let synth = null
let currentUtterance = null
let wordTimer = null

const languages = computed(() => {
  const langs = new Set(voices.value.map(v => v.lang))
  return [...langs].sort()
})

const words = computed(() => text.value.trim().split(/\s+/).filter(Boolean))

const selectedVoice = computed(() => voices.value.find(v => v.voiceURI === selectedVoiceURI.value) || null)

function loadVoices() {
  if (!window.speechSynthesis) return
  synth = window.speechSynthesis
  voices.value = synth.getVoices()
  if (voices.value.length && !selectedVoiceURI.value) {
    selectedVoiceURI.value = voices.value[0].voiceURI
    lang.value = voices.value[0].lang
  }
}

function speak() {
  if (!synth) loadVoices()
  if (!synth || !text.value.trim()) {
    error.value = text.value.trim() ? t('tts-no-support') : t('tts-enter-text')
    return
  }
  error.value = ''
  synth.cancel()

  const utt = new SpeechSynthesisUtterance(text.value)
  if (selectedVoice.value) {
    utt.voice = selectedVoice.value
    utt.lang = selectedVoice.value.lang
  } else if (lang.value) {
    utt.lang = lang.value
  }
  utt.rate = rate.value
  utt.pitch = pitch.value
  utt.volume = volume.value

  if (highlightWords.value) {
    currentWordIndex.value = -1
    utt.onboundary = (e) => {
      if (e.name === 'word') {
        const charIndex = e.charIndex
        const prefix = text.value.substring(0, charIndex)
        currentWordIndex.value = prefix.trim().split(/\s+/).length - 1
      }
    }
  }

  utt.onend = () => {
    speaking.value = false
    paused.value = false
    currentWordIndex.value = -1
  }
  utt.onerror = (e) => {
    speaking.value = false
    paused.value = false
    currentWordIndex.value = -1
    if (e.error !== 'canceled') error.value = t('tts-error')
  }

  currentUtterance = utt
  synth.speak(utt)
  speaking.value = true
  paused.value = false
}

function pause() {
  if (!synth) return
  if (paused.value) {
    synth.resume()
    paused.value = false
  } else {
    synth.pause()
    paused.value = true
  }
}

function stop() {
  if (!synth) return
  synth.cancel()
  speaking.value = false
  paused.value = false
  currentWordIndex.value = -1
}

function reloadVoices() {
  loadVoices()
}

onUnmounted(() => {
  if (synth) synth.cancel()
  clearTimeout(wordTimer)
})

loadVoices()
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = loadVoices
}
</script>
