<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">📱 {{ t('device-info-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('device-info-desc') }}</p>
    <div class="space-y-4">
      <div class="card" v-for="cat in info" :key="cat.title">
        <h3 class="font-semibold mb-3" style="color:var(--primary)">{{ cat.title }}</h3>
        <div class="space-y-2">
          <div v-for="item in cat.items" :key="item.label" class="flex items-center justify-between py-1.5" style="border-bottom:1px solid var(--border)">
            <span class="text-sm" style="color:var(--text-secondary)">{{ item.label }}</span>
            <span class="text-sm font-mono text-right" style="color:var(--text)">{{ item.value }}</span>
          </div>
        </div>
      </div>
      <button @click="copyAll" class="btn-primary w-full">📋 {{ t('device-info-copy-all') }}</button>
    </div>
  </div>
</template>
<script setup>
import{ref,onMounted}from'vue';import{t}from'../../i18n'
const info=ref([])
onMounted(()=>{
  const ua=navigator.userAgent
  const langs=navigator.languages?.join(', ')||navigator.language
  const conn=navigator.connection||{}
  const scr=window.screen
  info.value=[
    {title:'🖥️ '+t('device-browser'),items:[
      {label:'UA',value:ua.slice(0,80)+'...'},
      {label:t('device-language'),value:langs},
      {label:'Cookies',value:navigator.cookieEnabled?t('device-enabled'):t('device-disabled')},
      {label:t('device-online'),value:navigator.onLine?t('device-yes'):t('device-no')},
      {label:'DNT',value:navigator.doNotTrack||t('device-na')},
    ]},
    {title:'💻 '+t('device-os'),items:[
      {label:t('device-platform'),value:navigator.platform},
      {label:t('device-cpu'),value:navigator.hardwareConcurrency+t('device-core')},
      {label:t('device-memory'),value:navigator.deviceMemory?navigator.deviceMemory+'GB':t('device-unknown')},
      {label:t('device-touch'),value:String(navigator.maxTouchPoints)},
    ]},
    {title:'📺 '+t('device-screen'),items:[
      {label:t('device-resolution'),value:scr.width+'×'+scr.height},
      {label:t('device-viewport'),value:scr.availWidth+'×'+scr.availHeight},
      {label:t('device-pixel-ratio'),value:window.devicePixelRatio+'x'},
      {label:t('device-color-depth'),value:scr.colorDepth+'bit'},
    ]},
    {title:'🌐 '+t('device-network'),items:[
      {label:t('device-type'),value:conn.effectiveType||t('device-unknown')},
      {label:t('device-downlink'),value:conn.downlink?conn.downlink+'Mbps':t('device-unknown')},
      {label:t('device-rtt'),value:conn.rtt?conn.rtt+'ms':t('device-unknown')},
    ]},
  ]
})
function copyAll(){
  const text=info.value.map(c=>c.title+'\n'+c.items.map(i=>i.label+': '+i.value).join('\n')).join('\n\n')
  navigator.clipboard.writeText(text);window.showToast?.(t('copied'))
}
</script>
