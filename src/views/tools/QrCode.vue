<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('qrcode') }}</h1>
    <p class="mb-6" style="color: var(--text-secondary);">{{ t('qrcode-desc') }}</p>
    <div class="space-y-4">
      <input v-model="text" class="tool-input" :placeholder="t('qrcode-placeholder')" @input="generate">
      <div v-if="qrUrl" class="card flex flex-col items-center gap-4">
        <img :src="qrUrl" :width="size" :height="size" alt="QR Code" class="rounded-lg" />
        <div class="flex gap-3">
          <a :href="qrUrl" download="qrcode.png" class="btn-primary text-decoration-none text-sm">📥 {{ t('download-qr') }}</a>
          <button @click="copyUrl" class="btn-secondary text-sm">📋 {{ t('copy-link') }}</button>
        </div>
      </div>
      <div v-if="!text" class="card text-center" style="color: var(--text-secondary);">
        <p class="text-sm">{{ t('qr-hint') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { t } from '../../i18n'
const text = ref(''); const size = ref(300); const qrUrl = ref('')
function generate() { if (!text.value) { qrUrl.value = ''; return }; qrUrl.value = `https://api.qrserver.com/v1/create-qr-code/?size=${size.value}x${size.value}&data=${encodeURIComponent(text.value)}` }
function copyUrl() { navigator.clipboard.writeText(text.value); window.showToast?.(t('copied')) }
</script>
