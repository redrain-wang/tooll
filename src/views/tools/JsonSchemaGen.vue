<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">📋 {{ t('json-schema-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('json-schema-desc') }}</p>
    <div class="space-y-4">
      <textarea v-model="input" class="tool-input h-48 font-mono text-sm" :placeholder="t('json-schema-placeholder')"></textarea>
      <button @click="generate" class="btn-primary w-full">🔮 {{ t('json-schema-generate') }}</button>
      <div v-if="error" class="p-3 rounded text-sm" style="background:#fee2e2;color:#dc2626">{{ error }}</div>
      <div v-if="schema" class="card">
        <div class="flex items-center justify-between mb-3">
          <p class="font-medium">{{ t('json-schema-generated') }}</p>
          <button @click="copySchema" class="btn-secondary text-sm">📋 {{ t('copy') }}</button>
        </div>
        <pre class="font-mono text-xs overflow-auto max-h-96" style="color:var(--text)">{{ formattedSchema }}</pre>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import{t}from'../../i18n'
const input = ref(''); const schema = ref(null); const error = ref('')
const formattedSchema = computed(() => schema.value ? JSON.stringify(schema.value, null, 2) : '')
function inferType(v) { if (v === null) return { type: 'null' }; const t = typeof v; if (t === 'string') return { type: 'string' }; if (t === 'number') return Number.isInteger(v) ? { type: 'integer' } : { type: 'number' }; if (t === 'boolean') return { type: 'boolean' }; if (Array.isArray(v)) { if (!v.length) return { type: 'array', items: {} }; const items = v.map(inferType); const first = items[0]; const same = items.every(i => JSON.stringify(i) === JSON.stringify(first)); return { type: 'array', items: same ? first : { anyOf: items } } } return { type: 'object', properties: Object.fromEntries(Object.entries(v).map(([k, val]) => [k, inferType(val)])), required: Object.keys(v) } }
function generate() { error.value = ''; schema.value = null; try { const data = JSON.parse(input.value); schema.value = { $schema: 'https://json-schema.org/draft/2020-12/schema', ...inferType(data) }; window.showToast?.('OK') } catch (e) { error.value = t('json-schema-parse-failed') + ': ' + e.message } }
function copySchema() { navigator.clipboard.writeText(formattedSchema.value); window.showToast?.(t('copied')) }
</script>
