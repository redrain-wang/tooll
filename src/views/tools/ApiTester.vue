<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('api-tester-title') }}</h1>
    <p class="mb-6" style="color: var(--text-secondary);">{{ t('api-tester-desc') }}</p>
    <div class="space-y-4">
      <div class="flex gap-2">
        <select v-model="method" class="tool-input w-28 font-mono font-bold">
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>
        <input v-model="url" class="tool-input flex-1 font-mono" :placeholder="t('api-tester-url')" @keyup.enter="sendRequest">
        <button @click="sendRequest" class="btn-primary" :disabled="loading">
          {{ loading ? '...' : t('api-tester-send') }}
        </button>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div class="card space-y-3">
          <div class="flex gap-2 text-sm">
            <button @click="reqTab = 'headers'" :class="['px-3 py-1 rounded', reqTab === 'headers' ? 'bg-indigo-500 text-white' : '']" :style="reqTab !== 'headers' ? {color:'var(--text-secondary)'} : {}">
              {{ t('api-tester-headers') }}
            </button>
            <button @click="reqTab = 'body'" :class="['px-3 py-1 rounded', reqTab === 'body' ? 'bg-indigo-500 text-white' : {}]" :style="reqTab !== 'body' ? {color:'var(--text-secondary)'} : {}">
              {{ t('api-tester-body') }}
            </button>
          </div>
          <div v-if="reqTab === 'headers'" class="space-y-2">
            <div v-for="(h, i) in headers" :key="i" class="flex gap-2">
              <input v-model="h.key" class="tool-input flex-1 text-sm" placeholder="Key">
              <input v-model="h.value" class="tool-input flex-1 text-sm" placeholder="Value">
              <button @click="headers.splice(i, 1)" class="text-red-500 text-sm">×</button>
            </div>
            <button @click="headers.push({key:'',value:''})" class="btn-secondary text-xs">+ {{ t('api-tester-add-header') }}</button>
          </div>
          <div v-if="reqTab === 'body'">
            <textarea v-model="body" class="tool-input font-mono text-sm h-40" :placeholder="t('api-tester-body-placeholder')"></textarea>
          </div>
        </div>

        <div class="card space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium" style="color: var(--text-secondary);">{{ t('api-tester-response') }}</span>
            <span v-if="response" class="text-sm font-mono px-2 py-0.5 rounded" :style="{background: response.ok ? '#dcfce7' : '#fee2e2', color: response.ok ? '#16a34a' : '#dc2626'}">
              {{ response.status }} {{ response.statusText }}
            </span>
          </div>
          <div v-if="response" class="space-y-2">
            <div class="flex items-center gap-2 text-xs" style="color: var(--text-secondary);">
              <span>{{ response.time }}ms</span>
              <span>•</span>
              <span>{{ response.size }}</span>
            </div>
            <div class="flex gap-2 text-sm">
              <button @click="resTab = 'body'" :class="['px-3 py-1 rounded', resTab === 'body' ? 'bg-indigo-500 text-white' : '']" :style="resTab !== 'body' ? {color:'var(--text-secondary)'} : {}">
                Body
              </button>
              <button @click="resTab = 'headers'" :class="['px-3 py-1 rounded', resTab === 'headers' ? 'bg-indigo-500 text-white' : '']" :style="resTab !== 'headers' ? {color:'var(--text-secondary)'} : {}">
                {{ t('api-tester-headers') }}
              </button>
            </div>
            <div v-if="resTab === 'body'" class="p-3 rounded-lg text-sm font-mono overflow-auto max-h-80 whitespace-pre-wrap" style="background: var(--bg); color: var(--text);">{{ response.body }}</div>
            <div v-if="resTab === 'headers'" class="space-y-1 max-h-80 overflow-auto">
              <div v-for="(v, k) in response.headers" :key="k" class="flex gap-2 text-sm font-mono">
                <span class="font-medium" style="color: var(--primary);">{{ k }}:</span>
                <span style="color: var(--text);">{{ v }}</span>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8" style="color: var(--text-secondary);">
            {{ t('api-tester-hint') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { t } from '../../i18n'

const method = ref('GET')
const url = ref('')
const headers = ref([{ key: 'Content-Type', value: 'application/json' }])
const body = ref('')
const reqTab = ref('headers')
const resTab = ref('body')
const loading = ref(false)
const response = ref(null)

async function sendRequest() {
  if (!url.value) return
  loading.value = true
  response.value = null
  const start = performance.now()

  try {
    const opts = { method: method.value, headers: {} }
    headers.value.forEach(h => { if (h.key) opts.headers[h.key] = h.value })
    if (['POST', 'PUT', 'PATCH'].includes(method.value) && body.value) {
      opts.body = body.value
    }

    const res = await fetch(url.value, opts)
    const text = await res.text()
    const elapsed = Math.round(performance.now() - start)

    const resHeaders = {}
    res.headers.forEach((v, k) => { resHeaders[k] = v })

    response.value = {
      status: res.status,
      statusText: res.statusText,
      ok: res.ok,
      body: text,
      time: elapsed,
      size: formatSize(new Blob([text]).size),
      headers: resHeaders
    }
  } catch (e) {
    response.value = {
      status: 0,
      statusText: 'Error',
      ok: false,
      body: e.message,
      time: Math.round(performance.now() - start),
      size: '0 B',
      headers: {}
    }
  } finally {
    loading.value = false
  }
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}
</script>
