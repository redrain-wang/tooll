<template>
  <div class="tool-container">
    <div class="text-center mb-6 md:mb-10">
      <h1 class="text-2xl md:text-4xl font-bold mb-2 md:mb-3" style="color:var(--text)">{{ t('title') }}</h1>
      <p class="text-base md:text-lg" style="color:var(--text-secondary)">{{ t('subtitle') }}</p>
      <p class="text-xs md:text-sm mt-1 md:mt-2" style="color:var(--text-secondary)">{{ tools.length }} {{ t('free-tools-count') }}</p>
    </div>
    <div class="max-w-lg mx-auto mb-4 md:mb-6">
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input v-model="search" @keydown.enter="saveSearch" class="tool-input" :placeholder="t('search')" style="border-radius:2rem;padding-left:2.5rem">
        <span class="hidden md:inline-flex absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border text-xs" style="border-color:var(--border);color:var(--text-secondary)">/</span>
      </div>
    </div>

    <div v-if="!search && searchHistory.length" class="max-w-lg mx-auto mb-4 flex flex-wrap gap-2">
      <button v-for="h in searchHistory" :key="h" @click="search=h" class="px-2.5 py-1 rounded-full text-xs no-underline" style="background:var(--card-bg);border:1px solid var(--border);color:var(--text-secondary)">🔍 {{ h }}</button>
      <button @click="clearSearchHistory" class="px-2.5 py-1 rounded-full text-xs" style="color:var(--text-secondary)">✕</button>
    </div>

    <div class="flex gap-2 overflow-x-auto pb-2 mb-6 md:mb-8 -mx-1 px-1">
      <button @click="catFilter=''" :class="['flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all', catFilter===''?'bg-indigo-500 text-white border-indigo-500':'border-gray-200 dark:border-gray-700']" style="color:var(--text)">{{ t('all') }}</button>
      <button v-for="cat in categories" :key="cat.key" @click="catFilter=catFilter===cat.key?'':cat.key" :class="['flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all', catFilter===cat.key?'bg-indigo-500 text-white border-indigo-500':'border-gray-200 dark:border-gray-700']" style="color:var(--text)">{{ t(cat.labelKey) }}</button>
    </div>

    <div v-if="!search && favorites.length" class="mb-6 md:mb-8">
      <div class="flex items-center justify-between">
        <h2 class="text-base md:text-lg font-semibold mb-2 md:mb-3" style="color:var(--text)">⭐ {{ t('favorites') }}</h2>
        <div class="flex gap-2 mb-2 md:mb-3">
          <button @click="exportFav" class="px-2 py-1 text-xs rounded-md" style="background:var(--card-bg);border:1px solid var(--border);color:var(--text-secondary)" :title="t('export')">📤</button>
          <button @click="$refs.importFile.click()" class="px-2 py-1 text-xs rounded-md" style="background:var(--card-bg);border:1px solid var(--border);color:var(--text-secondary)" :title="t('import')">📥</button>
          <input ref="importFile" type="file" accept=".json" class="hidden" @change="importFav">
        </div>
      </div>
      <div class="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        <router-link v-for="p in favorites.slice(0,8)" :key="p" :to="p" class="flex-shrink-0 px-3 py-2 rounded-lg text-sm no-underline" style="background:var(--card-bg);border:1px solid var(--border);color:var(--text)">{{ getTool(p) ? t(getTool(p).key) : p }}</router-link>
      </div>
    </div>

    <div v-if="!search && recent.length" class="mb-6 md:mb-8">
      <h2 class="text-base md:text-lg font-semibold mb-2 md:mb-3" style="color:var(--text)">⏱️ {{ t('recent') }}</h2>
      <div class="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        <router-link v-for="item in recent.slice(0,8)" :key="item.path" :to="item.path" class="flex-shrink-0 px-3 py-2 rounded-lg text-sm no-underline" style="background:var(--card-bg);border:1px solid var(--border);color:var(--text)">
          <span>{{ getTool(item.path) ? t(getTool(item.path).key) : item.path }}</span>
          <span class="block text-xs opacity-50">{{ item.time }}</span>
        </router-link>
      </div>
    </div>

    <div v-if="!search && popular.length" class="mb-6 md:mb-8">
      <h2 class="text-base md:text-lg font-semibold mb-2 md:mb-3" style="color:var(--text)">🔥 {{ t('popular') }}</h2>
      <div class="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        <router-link v-for="p in popular.slice(0,8)" :key="p" :to="p" class="flex-shrink-0 px-3 py-2 rounded-lg text-sm no-underline" style="background:var(--card-bg);border:1px solid var(--border);color:var(--text)">{{ getTool(p) ? t(getTool(p).key) : p }}</router-link>
      </div>
    </div>

    <div v-if="!search && recent.length === 0" class="mb-8 text-center py-8" style="color:var(--text-secondary);">
      <p class="text-lg">{{ t('no-recent') }}</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      <div v-for="tool in filtered" :key="tool.path" class="card group no-underline cursor-pointer hover:-translate-y-0.5 relative">
        <router-link :to="tool.path" class="flex items-start gap-3 no-underline">
          <span class="text-lg md:text-xl">{{ tool.icon }}</span>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-sm truncate" style="color:var(--text)"><span v-html="highlight(t(tool.key))"></span></h3>
            <p class="text-xs mt-0.5 line-clamp-2" style="color:var(--text-secondary)"><span v-html="highlight(t(tool.descKey))"></span></p>
          </div>
        </router-link>
        <button @click.prevent="toggleFav(tool.path)" class="absolute top-2 right-2 text-sm" :title="isFav(tool.path)?t('unfavorite'):t('favorite')">
          {{ isFav(tool.path) ? '⭐' : '☆' }}
        </button>
      </div>
    </div>

    <div v-if="search && !filtered.length" class="text-center py-16" style="color:var(--text-secondary)">
      <p class="text-lg">{{ t('noResults') }}</p>
    </div>
  </div>
</template>
<script setup>
import{ref,computed,onMounted}from'vue';import{t,locale}from'../i18n';import{categories,homeTools}from'../data/tools'
const search=ref('');const catFilter=ref('');const recent=ref([]);const favorites=ref([]);const searchHistory=ref([])
onMounted(()=>{
  try{recent.value=JSON.parse(localStorage.getItem('toolbox_recent')||'[]')}catch{}
  try{favorites.value=JSON.parse(localStorage.getItem('toolbox_favorites')||'[]')}catch{}
  try{searchHistory.value=JSON.parse(localStorage.getItem('toolbox_search_history')||'[]')}catch{}
})
function saveSearch(){
  const q=search.value.trim()
  if(!q)return
  searchHistory.value=[q,...searchHistory.value.filter(x=>x!==q)].slice(0,8)
  localStorage.setItem('toolbox_search_history',JSON.stringify(searchHistory.value))
}
function clearSearchHistory(){
  searchHistory.value=[]
  localStorage.setItem('toolbox_search_history','[]')
}
function isFav(p){return favorites.value.includes(p)}
function toggleFav(p){
  if(isFav(p)){favorites.value=favorites.value.filter(x=>x!==p)}
  else{favorites.value=[p,...favorites.value].slice(0,20)}
  localStorage.setItem('toolbox_favorites',JSON.stringify(favorites.value))
}
function highlight(text){
  if(!search.value)return text
  const q=search.value.trim()
  if(!q)return text
  const words=q.split(/\s+/).filter(Boolean).map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'))
  if(!words.length)return text
  try{
    const regex=new RegExp('('+words.join('|')+')','gi')
    return text.replace(regex,'<mark class="hl">$1</mark>')
  }catch{return text}
}
function exportFav(){
  const blob=new Blob([JSON.stringify(favorites.value,null,2)],{type:'application/json'})
  const a=document.createElement('a')
  a.href=URL.createObjectURL(blob)
  a.download='toolbox-favorites.json'
  a.click()
  URL.revokeObjectURL(a.href)
  window.showToast?.(t('exported'))
}
function importFav(e){
  const file=e.target.files[0]
  if(!file)return
  const reader=new FileReader()
  reader.onload=()=>{
    try{
      const data=JSON.parse(reader.result)
      if(Array.isArray(data)){
        favorites.value=data.filter(p=>typeof p==='string'&&p.startsWith('/')).slice(0,50)
        localStorage.setItem('toolbox_favorites',JSON.stringify(favorites.value))
        window.showToast?.(t('imported'))
      }
    }catch{}
  }
  reader.readAsText(file)
  e.target.value=''
}
const tools=homeTools
const filtered=computed(()=>{
  let list=tools
  if(catFilter.value){list=list.filter(tool=>tool.cat===catFilter.value)}
  if(!search.value)return list
  const q=search.value.toLowerCase()
  return list.filter(tool=>tool.key.includes(q)||t(tool.descKey).includes(q)||tool.path.includes(q))
})
const popular=computed(()=>{
  try{
    const counts=JSON.parse(localStorage.getItem('toolbox_counts')||'{}')
    return Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([p])=>p).filter(p=>getTool(p))
  }catch{return[]}
})
function getTool(p){return tools.find(tool=>tool.path===p)}
</script>