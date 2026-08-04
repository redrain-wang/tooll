<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('code-runner') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('code-runner-desc') }}</p>

    <div class="mb-4 flex gap-2 flex-wrap">
      <button v-for="p in presets" :key="p.k" @click="loadPreset(p.k)" class="btn-secondary">{{ p.label }}</button>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <div>
        <div class="mb-2 text-sm font-medium" style="color:var(--text-secondary)">HTML / CSS / JS</div>
        <textarea v-model="code" @input="run" class="tool-input h-96 font-mono text-sm" placeholder="<h1>Hello</h1>"></textarea>
      </div>
      <div>
        <div class="mb-2 text-sm font-medium" style="color:var(--text-secondary)">{{ t('preview') }}</div>
        <div class="rounded-xl border overflow-hidden" style="border-color:var(--border)">
          <div class="flex items-center gap-1 px-3 py-1.5 bg-black/5 dark:bg-white/10">
            <span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-green-500"></span>
            <span class="ml-2 text-xs" style="color:var(--text-secondary)">sandbox</span>
          </div>
          <iframe ref="frameEl" sandbox="allow-scripts allow-modals allow-forms allow-popups"
            class="w-full bg-white" style="height:380px" :srcdoc="frameDoc"></iframe>
        </div>
      </div>
    </div>

    <div class="mt-4 flex gap-3 flex-wrap">
      <button @click="run" class="btn-primary">▶ {{ t('run') }}</button>
      <button @click="copy" class="btn-secondary">📋 {{ t('copy') }}</button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { t } from '../../i18n'

const code = ref(`<div class="box">Hello, ToolBox!</div>
<style>
  body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f0f4ff; }
  .box { background: linear-gradient(135deg, #6366f1, #a855f7); color: #fff; padding: 24px 40px; border-radius: 16px; font-size: 24px; box-shadow: 0 10px 30px rgba(99,102,241,.4); }
</style>
<script>
  console.log('ready')
<\/script>`)

const frameEl = ref(null)
const frameDoc = ref('')

const presets = [
  { k: 'hello', label: 'Hello' },
  { k: 'clock', label: 'Clock / 时钟' },
  { k: 'counter', label: 'Counter / 计数器' },
]

const presetCode = {
  hello: `<div class="box">Hello, ToolBox!</div>
<style>
  body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f0f4ff; }
  .box { background: linear-gradient(135deg, #6366f1, #a855f7); color: #fff; padding: 24px 40px; border-radius: 16px; font-size: 24px; box-shadow: 0 10px 30px rgba(99,102,241,.4); }
</style>
<script>
  console.log('ready')
<\/script>`,
  clock: `<div id="clock" style="font-size:48px;font-family:monospace;text-align:center;padding:80px 0">--:--:--</div>
<script>
  const el = document.getElementById('clock')
  setInterval(() => { el.textContent = new Date().toLocaleTimeString() }, 1000)
<\/script>`,
  counter: `<button id="btn" style="font-size:24px;padding:12px 28px;border:none;border-radius:10px;background:#22c55e;color:#fff;cursor:pointer;display:block;margin:80px auto">Count: 0</button>
<script>
  let n = 0
  const btn = document.getElementById('btn')
  btn.onclick = () => { btn.textContent = 'Count: ' + (++n) }
<\/script>`,
}

function loadPreset(k) { code.value = presetCode[k]; run() }
function run() { frameDoc.value = code.value }
function copy() { navigator.clipboard.writeText(code.value); window.showToast?.(t('copied')) }

onMounted(() => { run() })
</script>