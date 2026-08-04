<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('mermaid-chart') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('mermaid-chart-desc') }}</p>

    <div class="mb-4 flex flex-wrap gap-2">
      <button v-for="s in samples" :key="s.k" @click="loadSample(s.k)"
        class="btn-secondary">{{ s.label }}</button>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <div>
        <div class="mb-2 text-sm font-medium" style="color:var(--text-secondary)">Mermaid</div>
        <textarea v-model="code" @input="debouncedRender" class="tool-input h-96 font-mono text-sm" placeholder="graph TD&#10;  A-->B"></textarea>
      </div>
      <div>
        <div class="mb-2 text-sm font-medium" style="color:var(--text-secondary)">{{ t('preview') }}</div>
        <div class="rounded-xl border p-4 min-h-96 overflow-auto flex items-center justify-center bg-white" style="border-color:var(--border)">
          <div ref="chartEl"></div>
        </div>
        <div v-if="err" class="mt-3 text-sm text-red-500 whitespace-pre-wrap">{{ err }}</div>
      </div>
    </div>

    <div class="mt-4 flex gap-3 flex-wrap">
      <button @click="render" class="btn-primary">✨ {{ t('render') }}</button>
      <button @click="copy" class="btn-secondary">📋 {{ t('copy') }}</button>
      <button @click="downloadSvg" class="btn-secondary">⬇️ SVG</button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import mermaid from 'mermaid'
import { t } from '../../i18n'

mermaid.initialize({ startOnLoad: false, securityLevel: 'loose', theme: 'default' })

const code = ref('')
const err = ref('')
const chartEl = ref(null)
let seq = 0

const samples = [
  { k: 'flow', label: 'Flow / 流程图' },
  { k: 'seq', label: 'Sequence / 时序图' },
  { k: 'gantt', label: 'Gantt / 甘特图' },
  { k: 'class', label: 'Class / 类图' },
  { k: 'pie', label: 'Pie / 饼图' },
]

const sampleCode = {
  flow: `graph TD\n  A[开始] --> B{是否满足条件?}\n  B -- 是 --> C[处理成功]\n  B -- 否 --> D[处理失败]\n  C --> E[结束]\n  D --> E`,
  seq: `sequenceDiagram\n  participant U as 用户\n  participant S as 服务器\n  participant D as 数据库\n  U->>S: 登录请求\n  S->>D: 查询用户\n  D-->>S: 返回用户信息\n  S-->>U: 登录成功`,
  gantt: `gantt\n  title 项目计划\n  dateFormat  YYYY-MM-DD\n  section 设计\n  需求分析     :a1, 2024-01-01, 7d\n  原型设计     :a2, after a1, 5d\n  section 开发\n  前端开发     :b1, after a2, 10d\n  后端开发     :b2, after a2, 12d`,
  class: `classDiagram\n  class Animal{\n    +String name\n    +eat()\n  }\n  class Dog{\n    +bark()\n  }\n  Animal <|-- Dog`,
  pie: `pie\n  title 市场份额\n  "谷歌" : 60\n  "微软" : 25\n  "其他" : 15`,
}

function loadSample(k) { code.value = sampleCode[k]; render() }

let timer = null
function debouncedRender() { clearTimeout(timer); timer = setTimeout(render, 400) }

async function render() {
  err.value = ''
  const text = code.value.trim()
  if (!text) { if (chartEl.value) chartEl.value.innerHTML = ''; return }
  seq++
  const id = 'mmd-' + seq
  try {
    const { svg } = await mermaid.render(id, text)
    if (chartEl.value) chartEl.value.innerHTML = svg
  } catch (e) { err.value = String(e.message || e) }
}

function copy() { navigator.clipboard.writeText(code.value); window.showToast?.(t('copied')) }

function downloadSvg() {
  try {
    const svg = chartEl.value?.querySelector('svg')
    if (!svg) throw new Error('no svg')
    const b = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([b], { type: 'image/svg+xml' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'diagram.svg'
    a.click()
    URL.revokeObjectURL(a.href)
  } catch (e) { err.value = String(e.message || e) }
}

onMounted(() => { render() })
onBeforeUnmount(() => clearTimeout(timer))
</script>