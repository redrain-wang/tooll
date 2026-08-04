<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🏷️ {{ t('meta-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('meta-desc') }}</p>
    <div class="space-y-4">
      <div class="grid md:grid-cols-2 gap-4">
        <div class="card"><p class="font-medium mb-3">{{ t('meta-basic') }}</p>
          <input v-model="title" class="tool-input mb-2" :placeholder="t('meta-page-title')">
          <textarea v-model="description" class="tool-input mb-2 h-20" :placeholder="t('meta-page-desc')"></textarea>
          <input v-model="url" class="tool-input mb-2" :placeholder="t('meta-canonical')">
          <input v-model="keywords" class="tool-input mb-2" :placeholder="t('meta-keywords')">
          <input v-model="author" class="tool-input mb-2" :placeholder="t('meta-author')">
          <select v-model="robots" class="tool-input"><option value="index, follow">{{ t('meta-index-follow') }}</option><option value="noindex, follow">{{ t('meta-noindex-follow') }}</option><option value="index, nofollow">{{ t('meta-index-nofollow') }}</option><option value="noindex, nofollow">{{ t('meta-noindex-nofollow') }}</option></select>
        </div>
        <div class="card"><p class="font-medium mb-3">Open Graph (Facebook/LinkedIn)</p>
          <input v-model="ogTitle" class="tool-input mb-2" placeholder="og:title">
          <textarea v-model="ogDesc" class="tool-input mb-2 h-20" placeholder="og:description"></textarea>
          <input v-model="ogImage" class="tool-input mb-2" placeholder="og:image URL (1200x630)">
          <input v-model="ogUrl" class="tool-input mb-2" placeholder="og:url">
          <select v-model="ogType" class="tool-input"><option value="website">{{ t('meta-type-website') }}</option><option value="article">{{ t('meta-type-article') }}</option><option value="product">{{ t('meta-type-product') }}</option></select>
        </div>
        <div class="card"><p class="font-medium mb-3">Twitter Card</p>
          <select v-model="twitterCard" class="tool-input mb-2"><option value="summary_large_image">{{ t('meta-card-summary') }}</option><option value="summary">{{ t('meta-card-summary-large') }}</option></select>
          <input v-model="twitterSite" class="tool-input mb-2" placeholder="twitter:site (@username)">
          <input v-model="twitterCreator" class="tool-input mb-2" placeholder="twitter:creator (@username)">
        </div>
        <div class="card"><p class="font-medium mb-3">{{ t('meta-jsonld') }}</p>
          <select v-model="schemaType" class="tool-input mb-2"><option value="WebSite">WebSite</option><option value="Article">Article</option><option value="Product">Product</option><option value="Organization">Organization</option></select>
          <input v-model="schemaName" class="tool-input mb-2" :placeholder="t('meta-name')">
          <input v-model="schemaImage" class="tool-input mb-2" :placeholder="t('meta-image-url')">
        </div>
      </div>
      <button @click="generate" class="btn-primary w-full">🎯 {{ t('meta-generate-btn') }}</button>
      <div v-if="output" class="card">
        <div class="flex items-center justify-between mb-3"><p class="font-medium">{{ t('meta-generated-code') }}</p><button @click="copy" class="btn-secondary text-sm">📋 {{ t('copy') }}</button></div>
        <pre class="font-mono text-xs overflow-auto max-h-96" style="color:var(--text)">{{ output }}</pre>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import{t}from'../../i18n'
const title = ref(''); const description = ref(''); const url = ref(''); const keywords = ref(''); const author = ref(''); const robots = ref('index, follow')
const ogTitle = ref(''); const ogDesc = ref(''); const ogImage = ref(''); const ogUrl = ref(''); const ogType = ref('website')
const twitterCard = ref('summary_large_image'); const twitterSite = ref(''); const twitterCreator = ref('')
const schemaType = ref('WebSite'); const schemaName = ref(''); const schemaImage = ref('')
const output = ref('')

function escapeHtml(s) { return s.replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>').replace(/"/g,'"') }

function generate() {
  let html = '<!-- Basic SEO -->\n<title>' + escapeHtml(title.value) + '</title>\n'
  if(description.value) html += '<meta name="description" content="' + escapeHtml(description.value) + '">\n'
  if(keywords.value) html += '<meta name="keywords" content="' + escapeHtml(keywords.value) + '">\n'
  if(author.value) html += '<meta name="author" content="' + escapeHtml(author.value) + '">\n'
  html += '<meta name="robots" content="' + robots.value + '">\n'
  if(url.value) html += '<link rel="canonical" href="' + escapeHtml(url.value) + '">\n'
  html += '\n<!-- Open Graph -->\n'
  html += '<meta property="og:title" content="' + escapeHtml(ogTitle.value||title.value) + '">\n'
  html += '<meta property="og:description" content="' + escapeHtml(ogDesc.value||description.value) + '">\n'
  if(ogImage.value) html += '<meta property="og:image" content="' + escapeHtml(ogImage.value) + '">\n'
  if(ogUrl.value) html += '<meta property="og:url" content="' + escapeHtml(ogUrl.value) + '">\n'
  html += '<meta property="og:type" content="' + ogType.value + '">\n'
  html += '\n<!-- Twitter Card -->\n'
  html += '<meta name="twitter:card" content="' + twitterCard.value + '">\n'
  if(twitterSite.value) html += '<meta name="twitter:site" content="' + escapeHtml(twitterSite.value) + '">\n'
  if(twitterCreator.value) html += '<meta name="twitter:creator" content="' + escapeHtml(twitterCreator.value) + '">\n'
  html += '\n<!-- JSON-LD -->\n' + '<' + 'script type="application/ld+json">\n'
  const ld = { '@context': 'https://schema.org', '@type': schemaType.value, name: schemaName.value||title.value }
  if(schemaImage.value) ld.image = schemaImage.value
  if(schemaType.value === 'WebSite' && url.value) ld.url = url.value
  html += JSON.stringify(ld, null, 2) + '\n' + '<' + '/' + 'script>'
  output.value = html; window.showToast?.(t('meta-generated'))
}

function copy() { navigator.clipboard.writeText(output.value); window.showToast?.(t('copied')) }
</script>