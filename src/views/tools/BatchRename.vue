<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🏷️ {{ t('batch-rename') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('batch-rename-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="card p-6 text-center" @click="$refs.fileInput.click()" @dragover.prevent="dragging=true" @dragleave="dragging=false" @drop.prevent="onDrop" style="border:2px dashed var(--border);cursor:pointer" :class="dragging?'ring-2 ring-indigo-400':''">
        <div class="text-4xl mb-2">📁</div>
        <p>{{ t('drop-or-click') }}</p>
        <input ref="fileInput" type="file" multiple class="hidden" @change="onSelect">
      </div>

      <div v-if="files.length" class="pt-3 border-t space-y-4" style="border-color:var(--border)">
        <div class="flex items-center gap-3">
          <label class="text-sm font-medium w-28" style="color:var(--text-secondary)">{{ t('prefix') }}</label>
          <input v-model="prefix" class="tool-input flex-1 font-mono" placeholder="photo_">
        </div>
        <div class="flex items-center gap-3">
          <label class="text-sm font-medium w-28" style="color:var(--text-secondary)">{{ t('start-number') }}</label>
          <input v-model.number="start" type="number" min="0" class="tool-input w-24 font-mono">
        </div>
        <div class="flex items-center gap-3">
          <label class="text-sm font-medium w-28" style="color:var(--text-secondary)">{{ t('keep-extension') }}</label>
          <input v-model="keepExt" type="checkbox" class="w-5 h-5" style="accent-color:var(--primary)">
        </div>

        <div class="border rounded-lg divide-y max-h-64 overflow-auto" style="border-color:var(--border)">
          <div v-for="(f, i) in renamed" :key="i" class="flex items-center justify-between px-3 py-2 text-sm">
            <span class="font-mono truncate" style="color:var(--text-secondary)">{{ f.old }}</span>
            <span class="mx-2" style="color:var(--text-secondary)">→</span>
            <span class="font-mono truncate text-indigo-600">{{ f.new }}</span>
          </div>
        </div>

        <button @click="doRename" class="btn-primary" :disabled="busy">🏷️ {{ t('apply-rename') }}</button>
        <div v-if="busy" class="text-sm" style="color:var(--text-secondary)">{{ t('browser-cannot-rename') }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'

const files = ref([])
const prefix = ref('')
const start = ref(1)
const keepExt = ref(true)
const dragging = ref(false)
const busy = ref(false)

function ext(name) {
  const i = name.lastIndexOf('.')
  return i > 0 ? name.slice(i) : ''
}
function base(name) {
  const i = name.lastIndexOf('.')
  return i > 0 ? name.slice(0, i) : name
}

const renamed = computed(() => files.value.map((f, i) => {
  const e = keepExt.value ? ext(f.name) : ''
  const num = String(start.value + i).padStart(3, '0')
  return { old: f.name, new: `${prefix.value}${num}${e}` }
}))

function onSelect(e) { files.value.push(...e.target.files) }
function onDrop(e) { dragging.value = false; files.value.push(...e.dataTransfer.files) }

function doRename() {
  busy.value = true
  setTimeout(() => { busy.value = false }, 1500)
}
</script>