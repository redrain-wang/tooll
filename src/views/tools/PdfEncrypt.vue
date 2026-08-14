<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🔐 {{ t('pdf-encrypt') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('pdf-encrypt-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="card p-6 text-center" @click="$refs.fileInput.click()" @dragover.prevent="dragging=true" @dragleave="dragging=false" @drop.prevent="onDrop" style="border:2px dashed var(--border);cursor:pointer" :class="dragging?'ring-2 ring-indigo-400':''">
        <div class="text-4xl mb-2">🔐</div>
        <p>{{ t('drop-or-click') }}</p>
        <input ref="fileInput" type="file" accept="application/pdf" class="hidden" @change="onSelect">
      </div>

      <div v-if="file" class="pt-3 border-t space-y-3" style="border-color:var(--border)">
        <div class="text-sm" style="color:var(--text-secondary)">{{ t('total-pages') }}: <b>{{ pages }}</b></div>
        <div class="flex items-center gap-3">
          <label class="text-sm font-medium w-32" style="color:var(--text-secondary)">{{ t('password') }}</label>
          <input v-model="password" type="password" class="tool-input flex-1 font-mono">
        </div>
        <button @click="encrypt" class="btn-primary" :disabled="busy || !password">{{ t('encrypt-pdf') }}</button>
        <div v-if="err" class="text-sm text-red-500">{{ err }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { PDFDocument } from 'pdf-lib'
import { t } from '../../i18n'

const file = ref(null)
const pages = ref(0)
const password = ref('')
const busy = ref(false)
const err = ref('')
const dragging = ref(false)

async function onSelect(e) {
  const f = e.target.files[0]
  if (!f) return
  file.value = f
  const pdf = await PDFDocument.load(await f.arrayBuffer())
  pages.value = pdf.getPageCount()
}
function onDrop(e) { dragging.value = false; if (e.dataTransfer.files[0]) onSelect({ target: { files: e.dataTransfer.files } }) }

async function encrypt() {
  busy.value = true
  err.value = ''
  try {
    const pdf = await PDFDocument.load(await file.value.arrayBuffer())
    pdf.encrypt({ userPassword: password.value, ownerPassword: password.value, permissions: { printing: 'lowResolution', modifying: false, copying: false } })
    const bytes = await pdf.save()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }))
    a.download = 'encrypted.pdf'
    a.click()
  } catch { err.value = t('pdf-split-error') }
  busy.value = false
}
</script>