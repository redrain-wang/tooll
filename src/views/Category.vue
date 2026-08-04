<template>
  <div class="tool-container">
    <div class="mb-6">
      <div class="flex items-center gap-3 mb-2">
        <span class="text-3xl">{{ category?.icon }}</span>
        <h1 class="text-2xl md:text-3xl font-bold" style="color: var(--text);">{{ t(category?.labelKey || '') }}</h1>
      </div>
      <p class="text-sm" style="color: var(--text-secondary);">{{ filteredTools.length }} {{ t('free-tools-count') }}</p>
    </div>

    <div class="max-w-lg mb-6">
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input v-model="search" class="tool-input" :placeholder="t('search')" style="border-radius:2rem;padding-left:2.5rem">
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <router-link v-for="tool in filteredTools" :key="tool.p" :to="tool.p" class="card group no-underline cursor-pointer hover:-translate-y-0.5">
        <div class="flex items-start gap-3">
          <span class="text-xl">{{ getToolIcon(tool.p) }}</span>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-sm truncate" style="color: var(--text);">{{ t(tool.k) }}</h3>
            <p class="text-xs mt-0.5" style="color: var(--text-secondary);">{{ t(tool.k + '-desc') }}</p>
          </div>
        </div>
      </router-link>
    </div>

    <div v-if="!filteredTools.length" class="text-center py-16" style="color: var(--text-secondary);">
      <p class="text-lg">{{ t('noResults') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { t } from '../i18n'
import { categories } from '../data/categories'

const route = useRoute()
const search = ref('')

const category = computed(() => {
  const key = route.params.key
  return categories.find(c => c.key === key)
})

const allTools = computed(() => category.value?.tools || [])

const filteredTools = computed(() => {
  if (!search.value) return allTools.value
  const q = search.value.toLowerCase()
  return allTools.value.filter(tool => {
    const name = t(tool.k).toLowerCase()
    const desc = t(tool.k + '-desc').toLowerCase()
    return name.includes(q) || desc.includes(q) || tool.p.includes(q)
  })
})

const iconMap = {
  '/json-formatter': '{ }', '/markdown': '📄', '/md-to-html': '🔄', '/word-counter': '📝',
  '/text-stats': '📊', '/text-dedup': '📋', '/text-sort': '🔤', '/text-reverse': '🔃',
  '/case-converter': '🔠', '/text-replace': '🔄', '/notepad': '📒', '/text-ascii': '💻',
  '/text-diff': '📊', '/text-compare': '🔍', '/text-to-slug': '🔗', '/text-handwriting': '✍️',
  '/md-table': '📊', '/text-cipher': '🔒',
  '/base64': '🔐', '/url-encoder': '🌐', '/html-escape': '🏷️', '/hash-generator': '#️⃣',
  '/json-to-csv': '📊', '/jwt-decoder': '🎫', '/xml-formatter': '📋', '/css-minify': '🎨',
  '/js-minify': '⚡', '/html-formatter': '📋', '/regex-tester': '🔍', '/regex-cheatsheet': '📖',
  '/regex-lib': '📚', '/regex-visual': '🔎', '/regex-builder': '🔧', '/regex-explainer': '📖',
  '/regex-highlight': '🔍', '/json-tree': '🌳', '/table-generator': '📊', '/code-formatter': '🎨',
  '/svg-editor': '🎨', '/json-schema-gen': '📋', '/json-excel': '📊', '/css-animation': '✨',
  '/css-grid': '🔲', '/css-unit': '📐', '/html-preview': '👁️', '/jsonp-generator': '📋',
  '/api-tester': '🔌', '/prompt-library': '🤖',
  '/aes-encrypt': '🔒', '/rsa-generator': '🔐', '/password-generator': '🔑',
  '/password-strength': '🛡️', '/password-batch': '🔑', '/password-vault': '🏦',
  '/qr-code': '📱', '/qr-beautify': '🎨', '/barcode': '📊', '/uuid-generator': '🆔',
  '/random-number': '🎲', '/cron-generator': '⏰', '/lorem-ipsum': '📝', '/lorem-image': '🖼️',
  '/gradient-generator': '🌈', '/favicon-gen': '🎯',
  '/timestamp': '⏱️', '/timestamp-enhanced': '⏱️', '/number-base': '🔢', '/morse-code': '📡',
  '/unit-converter': '📐', '/rmb-uppercase': '💰', '/number-chinese': '🔢', '/translator': '🌐',
  '/image-format': '🔄', '/image-to-svg': '🖼️', '/svg-export': '📤',
  '/color-converter': '🎨', '/color-palette': '🎨', '/hex-rgb': '🎨', '/color-extract': '🖼️',
  '/color-blind': '👁️', '/color-contrast': '♿', '/color-picker': '🎨', '/color-mixer': '🎨',
  '/color-harmony': '🎭',
  '/image-compress': '🖼️', '/image-base64': '📷', '/image-info': '📷', '/qr-scanner': '📷',
  '/char-info': '🔤', '/device-info': '📱', '/clipboard': '📋', '/speed-test': '🌐',
  '/image-editor': '🖼️', '/image-crop': '✂️', '/meta-tag-gen': '🏷️', '/text-to-speech': '🔊',
  '/countdown': '⏳', '/stopwatch': '⏱️', '/pomodoro': '🍅', '/date-calc': '📅',
  '/user-agent': '🌐', '/url-parser': '🔗',
}

function getToolIcon(path) { return iconMap[path] || '🔧' }
</script>
