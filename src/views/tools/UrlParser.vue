<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('url-parser-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('url-parser-desc') }}</p>
    <div class="space-y-4">
      <input v-model="url" class="tool-input" :placeholder="t('url-parser-placeholder')" @input="parse">
      <div v-if="parts" class="card space-y-3">
        <div v-for="item in parts" :key="item.label" class="flex items-center gap-3 py-2" style="border-bottom:1px solid var(--border)">
          <span class="text-sm font-medium w-24" style="color:var(--text-secondary)">{{ item.label }}</span>
          <code class="text-sm font-mono break-all" style="color:var(--text)">{{ item.value }}</code>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import{ref}from'vue';import{t}from'../../i18n'
const url=ref('https://example.com:8080/path/page?name=test&id=123#section');const parts=ref(null)
function parse(){
  try{
    const u=new URL(url.value)
    parts.value=[
      {label:t('url-parser-protocol'),value:u.protocol},{label:t('url-parser-hostname'),value:u.hostname},
      {label:t('url-parser-port'),value:u.port||t('url-parser-default')},{label:t('url-parser-path'),value:u.pathname},
      {label:t('url-parser-query'),value:u.search||t('url-parser-none')},{label:t('url-parser-hash'),value:u.hash||t('url-parser-none')},
      {label:t('url-parser-origin'),value:u.origin},
    ]
  }catch(e){parts.value=null}
}
parse()
</script>
