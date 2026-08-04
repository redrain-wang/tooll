<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('css-anim-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('css-anim-desc') }}</p>
    <div class="space-y-6">
      <div class="grid md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="text-sm block mb-1" style="color:var(--text-secondary)">{{ t('css-anim-type') }}</label>
            <select v-model="animType" class="tool-input">
              <option value="fade">Fade</option>
              <option value="slide">Slide</option>
              <option value="bounce">Bounce</option>
              <option value="rotate">Rotate</option>
              <option value="scale">Scale</option>
              <option value="custom">{{ t('css-anim-custom') }}</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm block mb-1" style="color:var(--text-secondary)">{{ t('css-anim-duration') }}</label>
              <input v-model="duration" type="text" class="tool-input" placeholder="1s">
            </div>
            <div>
              <label class="text-sm block mb-1" style="color:var(--text-secondary)">{{ t('css-anim-delay') }}</label>
              <input v-model="delay" type="text" class="tool-input" placeholder="0s">
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm block mb-1" style="color:var(--text-secondary)">{{ t('css-anim-iterations') }}</label>
              <input v-model="iterations" type="text" class="tool-input" placeholder="1">
            </div>
            <div>
              <label class="text-sm block mb-1" style="color:var(--text-secondary)">{{ t('css-anim-easing') }}</label>
              <select v-model="easing" class="tool-input">
                <option value="ease">ease</option>
                <option value="linear">linear</option>
                <option value="ease-in">ease-in</option>
                <option value="ease-out">ease-out</option>
                <option value="ease-in-out">ease-in-out</option>
                <option value="cubic-bezier(0.68,-0.55,0.27,1.55)">elastic</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm block mb-1" style="color:var(--text-secondary)">{{ t('css-anim-fill') }}</label>
              <select v-model="fillMode" class="tool-input">
                <option value="none">none</option>
                <option value="forwards">forwards</option>
                <option value="backwards">backwards</option>
                <option value="both">both</option>
              </select>
            </div>
            <div>
              <label class="text-sm block mb-1" style="color:var(--text-secondary)">{{ t('css-anim-direction') }}</label>
              <select v-model="direction" class="tool-input">
                <option value="normal">normal</option>
                <option value="reverse">reverse</option>
                <option value="alternate">alternate</option>
                <option value="alternate-reverse">alternate-reverse</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label class="text-sm block mb-2" style="color:var(--text-secondary)">{{ t('preview') }}</label>
          <div class="preview-box rounded-xl flex items-center justify-center h-48 border" style="background:var(--bg);border-color:var(--border)">
            <div ref="previewEl" class="preview-element w-20 h-20 rounded-xl" :style="previewStyle"></div>
          </div>
          <button @click="replay" class="btn-secondary text-xs mt-2 w-full">{{ t('css-anim-replay') }}</button>
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="text-sm" style="color:var(--text-secondary)">{{ t('css-anim-keyframes') }}</label>
          <button @click="copy" class="btn-secondary text-xs">📋 {{ t('copy') }}</button>
        </div>
        <pre class="rounded-xl p-4 font-mono text-xs overflow-x-auto" style="background:var(--bg);color:var(--primary)">{{ generatedCSS }}</pre>
      </div>

      <div class="flex gap-2">
        <button @click="applyToBody" class="btn-primary text-sm">{{ t('css-anim-apply') }}</button>
        <button @click="reset" class="btn-secondary text-sm">{{ t('reset') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { t } from '../../i18n'

const animType = ref('fade')
const duration = ref('1s')
const delay = ref('0s')
const iterations = ref('1')
const easing = ref('ease')
const fillMode = ref('both')
const direction = ref('normal')
const previewEl = ref(null)
const animKey = ref(0)

const keyframesMap = {
  fade: {
    '0%': 'opacity: 0;',
    '100%': 'opacity: 1;'
  },
  slide: {
    '0%': 'transform: translateX(-50px); opacity: 0;',
    '100%': 'transform: translateX(0); opacity: 1;'
  },
  bounce: {
    '0%': 'transform: translateY(-30px); opacity: 0;',
    '50%': 'transform: translateY(8px);',
    '70%': 'transform: translateY(-4px);',
    '100%': 'transform: translateY(0); opacity: 1;'
  },
  rotate: {
    '0%': 'transform: rotate(-180deg) scale(0.5); opacity: 0;',
    '100%': 'transform: rotate(0deg) scale(1); opacity: 1;'
  },
  scale: {
    '0%': 'transform: scale(0); opacity: 0;',
    '60%': 'transform: scale(1.15);',
    '100%': 'transform: scale(1); opacity: 1;'
  }
}

const generatedCSS = computed(() => {
  const frames = keyframesMap[animType.value] || keyframesMap.fade
  let keyframes = `@keyframes myAnimation {\n`
  for (const [step, props] of Object.entries(frames)) {
    keyframes += `  ${step} { ${props} }\n`
  }
  keyframes += `}\n\n`
  keyframes += `.animated-element {\n`
  keyframes += `  animation-name: myAnimation;\n`
  keyframes += `  animation-duration: ${duration.value};\n`
  keyframes += `  animation-delay: ${delay.value};\n`
  keyframes += `  animation-iteration-count: ${iterations.value};\n`
  keyframes += `  animation-timing-function: ${easing.value};\n`
  keyframes += `  animation-fill-mode: ${fillMode.value};\n`
  keyframes += `  animation-direction: ${direction.value};\n`
  keyframes += `}`
  return keyframes
})

const previewStyle = computed(() => ({
  background: 'var(--primary)',
  animation: `myAnimation ${duration.value} ${easing.value} ${delay.value} ${iterations.value} ${direction.value} ${fillMode.value}`,
  animationPlayState: 'running',
  ...(animKey.value ? {} : {})
}))

function replay() {
  animKey.value++
  if (previewEl.value) {
    const el = previewEl.value
    el.style.animation = 'none'
    void el.offsetHeight
    el.style.animation = ''
  }
}

function copy() {
  navigator.clipboard.writeText(generatedCSS.value)
  window.showToast?.(t('copied'))
}

function applyToBody() {
  let styleEl = document.getElementById('css-anim-preview-style')
  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = 'css-anim-preview-style'
    document.head.appendChild(styleEl)
  }
  styleEl.textContent = generatedCSS.value
}

function reset() {
  animType.value = 'fade'
  duration.value = '1s'
  delay.value = '0s'
  iterations.value = '1'
  easing.value = 'ease'
  fillMode.value = 'both'
  direction.value = 'normal'
}
</script>
