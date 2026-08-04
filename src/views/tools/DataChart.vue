<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('data-chart') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('data-chart-desc') }}</p>

    <div class="mb-4 flex gap-2 flex-wrap">
      <select v-model="type" @change="update" class="tool-input" style="width:auto">
        <option v-for="opt in chartTypes" :key="opt.k" :value="opt.k">{{ opt.label }}</option>
      </select>
      <select v-model="preset" @change="loadPreset" class="tool-input" style="width:auto">
        <option v-for="opt in presets" :key="opt.k" :value="opt.k">{{ opt.label }}</option>
      </select>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <div>
        <div class="mb-2 text-sm font-medium" style="color:var(--text-secondary)">JSON</div>
        <textarea v-model="json" @input="update" class="tool-input h-80 font-mono text-sm" placeholder='{"labels":["周一","周二"],"series":[{"name":"销量","data":[12,19]}]}'></textarea>
      </div>
      <div>
        <div class="mb-2 text-sm font-medium" style="color:var(--text-secondary)">{{ t('preview') }}</div>
        <div class="rounded-xl border p-4" style="border-color:var(--border)">
          <div class="relative" style="height:320px">
            <canvas ref="canvasEl"></canvas>
          </div>
        </div>
        <div v-if="err" class="mt-3 text-sm text-red-500 whitespace-pre-wrap">{{ err }}</div>
      </div>
    </div>

    <div class="mt-4 flex gap-3 flex-wrap">
      <button @click="update" class="btn-primary">✨ {{ t('render') }}</button>
      <button @click="downloadPng" class="btn-secondary">⬇️ PNG</button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Chart, registerables } from 'chart.js'
import { t } from '../../i18n'

Chart.register(...registerables)

const type = ref('bar')
const json = ref('')
const err = ref('')
const canvasEl = ref(null)
let chart = null

const chartTypes = [
  { k: 'bar', label: 'Bar / 柱状图' },
  { k: 'line', label: 'Line / 折线图' },
  { k: 'pie', label: 'Pie / 饼图' },
  { k: 'doughnut', label: 'Doughnut / 环形图' },
  { k: 'radar', label: 'Radar / 雷达图' },
  { k: 'scatter', label: 'Scatter / 散点图' },
]

const presets = [
  { k: 'sales', label: 'Sales / 销售数据' },
  { k: 'score', label: 'Score / 成绩单' },
  { k: 'share', label: 'Share / 市场份额' },
]

const presetData = {
  sales: '{"labels":["一月","二月","三月","四月","五月","六月"],"series":[{"name":"2024","data":[65,59,80,81,56,72]},{"name":"2025","data":[45,62,70,90,65,85]}]}',
  score: '{"labels":["语文","数学","英语","物理","化学","生物"],"series":[{"name":"张三","data":[88,92,76,84,90,78]},{"name":"李四","data":[75,80,85,70,88,82]}]}',
  share: '{"labels":["谷歌","微软","苹果","其他"],"series":[{"name":"市场份额","data":[40,25,20,15]}]}',
}

function loadPreset() { json.value = presetData[preset.value]; update() }

const palette = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16']

function parseData() {
  const obj = JSON.parse(json.value || '{}')
  const labels = obj.labels || []
  const series = obj.series || []
  return { labels, series }
}

function update() {
  err.value = ''
  try {
    const { labels, series } = parseData()
    if (!chart) {
      chart = new Chart(canvasEl.value, { type: type.value, data: { labels, datasets: [] }, options: {} })
    }
    chart.type = type.value
    chart.data.labels = labels
    chart.data.datasets = series.map((s, i) => {
      const base = {
        label: s.name,
        data: s.data,
        backgroundColor: type.value === 'line' ? palette[i % palette.length] : palette.map((_, j) => palette[(i * 3 + j) % palette.length]).slice(0, labels.length || 1),
        borderColor: palette[i % palette.length],
      }
      if (type.value === 'pie' || type.value === 'doughnut') {
        return { label: s.name, data: s.data, backgroundColor: palette.slice(0, labels.length || 1) }
      }
      if (type.value === 'scatter') {
        return { label: s.name, data: (s.data || []).map((v, j) => ({ x: j, y: v })), borderColor: palette[i % palette.length] }
      }
      if (type.value === 'radar') {
        return { label: s.name, data: s.data, backgroundColor: palette[i % palette.length] + '33', borderColor: palette[i % palette.length], pointBackgroundColor: palette[i % palette.length] }
      }
      return base
    })
    chart.update()
  } catch (e) { err.value = String(e.message || e) }
}

function downloadPng() {
  try {
    const url = chart.toBase64Image('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = 'chart.png'
    a.click()
  } catch (e) { err.value = String(e.message || e) }
}

onMounted(() => { json.value = presetData.sales; update() })
onBeforeUnmount(() => { if (chart) chart.destroy() })
</script>