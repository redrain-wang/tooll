<template>
  <div v-if="usage" class="mt-4 p-4 rounded-lg" style="background:var(--card-bg);border:1px solid var(--border)">
    <h3 class="text-sm font-semibold mb-2" style="color:var(--text)">{{ t('how-to-use') }}</h3>
    <p class="text-sm leading-relaxed" style="color:var(--text-secondary)">{{ usage }}</p>
  </div>
</template>
<script setup>
import{computed}from'vue';import{useRoute}from'vue-router';import{t}from'../i18n'
const route=useRoute()
const usage=computed(()=>{
  const name=route.name
  if(!name)return null
  const key=name.toLowerCase().replace(/([A-Z])/g,m=>'-'+m.toLowerCase()).replace(/^-/,'')
  const val=t(key+'-usage')
  return val.includes('-usage')?null:val
})
</script>
