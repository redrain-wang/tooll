<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">📱 {{ t('batch-qr') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('batch-qr-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <textarea v-model="text" rows="8" class="tool-input w-full" :placeholder="t('batch-qr-hint')"></textarea>

      <div v-if="items.length" class="pt-3 border-t grid grid-cols-3 gap-3" style="border-color:var(--border)">
        <div v-for="item in items" :key="item" class="card p-2 text-center">
          <img :src="qrUrl(item)" class="w-full rounded mb-1" style="border:1px solid var(--border)">
          <div class="text-xs truncate mb-1" style="color:var(--text-secondary)">{{ item }}</div>
          <a :href="qrUrl(item)" download="qrcode.png" class="btn-primary btn-sm">{{ t('download') }}</a>
        </div>
      </div>
      <div v-else class="text-sm" style="color:var(--text-secondary)">{{ t('batch-qr-empty') }}</div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'

const text = ref('')
const items = computed(() => text.value.split('\n').map(s => s.trim()).filter(Boolean))
function qrUrl(s) { return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(s)}` }
</script>