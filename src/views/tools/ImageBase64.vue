<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('image-base64') }}</h1>
    <p class="mb-6" style="color: var(--text-secondary);">{{ t('image-base64-desc') }}</p>
    <div class="space-y-4">
      <div class="card text-center" @dragover.prevent="dragging=true" @dragleave="dragging=false" @drop.prevent="handleDrop" :class="{'ring-2 ring-indigo-400':dragging}" style="cursor:pointer" @click="$refs.fileInput.click()">
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFile">
        <p class="text-lg mb-1" style="color:var(--text-secondary)">{{ t('drag-hint') }}</p>
        <p class="text-xs" style="color:var(--text-secondary)">{{ t('drag-sub') }}</p>
      </div>
      <div v-if="result" class="card">
        <div class="flex items-center justify-between mb-3">
          <p class="text-sm font-medium">{{ t('result') }}</p>
          <button @click="copy" class="btn-secondary text-sm">{{ t('copy') }}</button>
        </div>
        <img v-if="preview" :src="preview" class="max-h-48 rounded mb-3 mx-auto">
        <p class="text-xs mb-2" style="color:var(--text-secondary)">{{ t('file-size') }}: {{ fileSize }}</p>
        <textarea :value="result" class="tool-input font-mono text-xs" rows="4" readonly></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { t } from '../../i18n'
const dragging = ref(false); const result = ref(''); const preview = ref(''); const fileSize = ref('')
function handleFile(e) { if (e.target.files[0]) processFile(e.target.files[0]) }
function handleDrop(e) { dragging.value = false; const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) processFile(f) }
function processFile(file) { fileSize.value = (file.size/1024).toFixed(1)+'KB'; preview.value = URL.createObjectURL(file); const r = new FileReader(); r.onload = () => result.value = r.result; r.readAsDataURL(file) }
function copy() { navigator.clipboard.writeText(result.value); window.showToast?.(t('copied')) }
</script>
