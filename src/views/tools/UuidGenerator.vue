<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('uuid') }}</h1>
    <p class="mb-6" style="color: var(--text-secondary);">{{ t('uuid-desc') }}</p>
    <div class="space-y-4">
      <div class="flex gap-3 items-center flex-wrap">
        <div class="flex items-center gap-2">
          <label class="text-sm" style="color: var(--text-secondary);">{{ t('quantity') }}:</label>
          <input v-model.number="count" type="number" min="1" max="100" class="tool-input w-20">
        </div>
        <label class="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" v-model="uppercase" class="rounded accent-indigo-500"> {{ t('uppercase') }}</label>
        <label class="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" v-model="noDashes" class="rounded accent-indigo-500"> {{ t('noDashes') }}</label>
        <button @click="generate" class="btn-primary">🎲 {{ t('gen-uuid') }}</button>
      </div>
      <div class="card">
        <div v-for="(uuid, i) in uuids" :key="i" class="flex items-center gap-3 py-2.5" :style="{ borderBottom: i < uuids.length - 1 ? '1px solid var(--border)' : 'none' }">
          <span class="text-xs font-medium px-2 py-0.5 rounded" style="background: var(--primary); color: white; opacity: 0.7;">{{ i + 1 }}</span>
          <code class="flex-1 font-mono text-sm break-all" style="color: var(--text);">{{ uuid }}</code>
          <button @click="copyOne(uuid)" class="text-xs px-2 py-1 rounded hover:opacity-80" style="color: var(--primary);">{{ t('copy') }}</button>
        </div>
      </div>
      <button v-if="uuids.length" @click="copyAll" class="btn-secondary w-full">📋 {{ t('copy-all') }} ({{ uuids.length }})</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { t } from '../../i18n'
const count = ref(5); const uppercase = ref(false); const noDashes = ref(false); const uuids = ref([])
function genOne() {
  // crypto.randomUUID() is only available in secure contexts; use fallback.
  const bytes = new Uint8Array(16)
  if (crypto.getRandomValues) crypto.getRandomValues(bytes)
  else for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const parts = []
  for (let i = 0; i < 16; i++) parts.push(bytes[i].toString(16).padStart(2, '0'))
  let u = parts[0] + parts[1] + parts[2] + parts[3] + '-' + parts[4] + parts[5] + '-' + parts[6] + parts[7] + '-' + parts[8] + parts[9] + '-' + parts[10] + parts[11] + parts[12] + parts[13] + parts[14] + parts[15]
  if (uppercase.value) u = u.toUpperCase()
  if (noDashes.value) u = u.replace(/-/g, '')
  return u
}
function generate() { uuids.value = Array.from({ length: count.value }, genOne); window.showToast?.(t('generated') || 'Generated') }
function copyOne(u) { navigator.clipboard.writeText(u); window.showToast?.(t('copied')) }
function copyAll() { navigator.clipboard.writeText(uuids.value.join('\n')); window.showToast?.(t('copied')) }
generate()
</script>
