<template>
  <div v-if="related.length" class="mt-12 pt-8 border-t" style="border-color:var(--border)">
    <h3 class="text-lg font-semibold mb-4" style="color:var(--text)">{{ t('related-tools') }}</h3>
    <div class="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
      <router-link v-for="tool in related" :key="tool.p" :to="tool.p" class="flex-shrink-0 px-3 py-2 rounded-lg text-sm no-underline" style="background:var(--card-bg);border:1px solid var(--border);color:var(--text)">
        {{ t(tool.k) }}
      </router-link>
    </div>
  </div>
</template>
<script setup>
import{computed}from'vue';import{useRoute}from'vue-router';import{t}from'../i18n';import{categories}from'../data/categories'
const route=useRoute()
const related=computed(()=>{
  const cat=categories.find(c=>c.tools.some(tool=>tool.p===route.path))
  if(!cat)return[]
  return cat.tools.filter(tool=>tool.p!==route.path).slice(0,6)
})
</script>
