<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('char-info-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('char-info-desc') }}</p>
    <div class="space-y-4">
      <input v-model="char" class="tool-input text-center text-4xl" maxlength="2" :placeholder="t('char-placeholder')">
      <div v-if="info" class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div v-for="item in info" :key="item.label" class="card text-center">
          <p class="text-2xl font-mono font-bold" style="color:var(--primary)">{{ item.value }}</p>
          <p class="text-xs mt-1" style="color:var(--text-secondary)">{{ item.label }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import{ref,computed}from'vue';import{t}from'../../i18n'
const char=ref('')
const info=computed(()=>{
  if(!char.value||char.value.length<1)return null
  const c=char.value.charCodeAt(0)
  return[
    {label:t('char-label'),value:char.value[0]},{label:'Unicode',value:'U+'+c.toString(16).toUpperCase().padStart(4,'0')},
    {label:t('char-decimal'),value:c},{label:'HTML',value:'&#'+c+';'},
    {label:'CSS',value:'\\u'+c.toString(16).padStart(4,'0')},{label:t('char-url-encoded'),value:encodeURIComponent(char.value[0])},
    {label:t('char-category'),value:getCategory(c)},{label:t('char-bytes'),value:new TextEncoder().encode(char.value[0]).length},
  ]
})
function getCategory(c){
  if(c>=0x4e00&&c<=0x9fff)return t('char-chinese');if(c>=0x30&&c<=0x39)return t('char-digit');if(c>=0x41&&c<=0x5a)return t('char-uppercase');if(c>=0x61&&c<=0x7a)return t('char-lowercase');if(c<128)return'ASCII';return t('char-other')
}
</script>
