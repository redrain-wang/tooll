<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('ua-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('ua-desc') }}</p>
    <div class="space-y-4">
      <textarea v-model="input" class="tool-input h-24 font-mono text-sm" :placeholder="defaultUA"></textarea>
      <button @click="parse" class="btn-primary">{{ t('ua-parse') }}</button>
      <div v-if="info" class="card space-y-3">
        <div v-for="item in info" :key="item.label" class="flex items-center gap-3 py-2" style="border-bottom:1px solid var(--border)">
          <span class="text-sm font-medium w-24" style="color:var(--text-secondary)">{{ item.label }}</span>
          <span class="text-sm" style="color:var(--text)">{{ item.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import{ref}from'vue';import{t}from'../../i18n'
const input=ref('');const info=ref(null)
const defaultUA=navigator.userAgent
function parse(){
  const ua=input.value||defaultUA;info.value=[]
  const browser=[
    {name:'Edge',re:/Edge\/(\d+)/},{name:'Chrome',re:/Chrome\/(\d+)/},
    {name:'Firefox',re:/Firefox\/(\d+)/},{name:'Safari',re:/Version\/(\d+).*Safari/}
  ]
  for(const b of browser){const m=ua.match(b.re);if(m){info.value.push({label:t('ua-browser'),value:b.name+' '+m[1]});break}}
  const os=[
    {name:'Windows',re:/Windows NT ([\d.]+)/},{name:'macOS',re:/Mac OS X ([\d._]+)/},
    {name:'Linux',re:/Linux/},{name:'Android',re:/Android ([\d.]+)/},{name:'iOS',re:/iPhone OS ([\d_]+)/}
  ]
  for(const o of os){const m=ua.match(o.re);if(m){info.value.push({label:t('ua-os'),value:m?o.name+' '+m[1]:o.name});break}}
  const mobile=ua.match(/Mobile|Android|iPhone/);info.value.push({label:t('ua-device'),value:mobile?t('ua-mobile'):t('ua-desktop')})
  info.value.push({label:'UA',value:ua.slice(0,100)+'...'})
}
parse()
</script>
