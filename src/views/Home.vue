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
import{ref,computed,onMounted}from'vue';import{t,locale}from'../i18n';import{categories}from'../data/categories'
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
const tools=[
  {path:'/json-formatter',icon:'{ }',key:'json-formatter',descKey:'json-formatter-desc',cat:'text'},
  {path:'/markdown',icon:'📄',key:'markdown',descKey:'markdown-desc',cat:'text'},
  {path:'/md-to-html',icon:'🔄',key:'md-to-html',descKey:'md-to-html-desc',cat:'text'},
  {path:'/word-counter',icon:'📝',key:'word-counter',descKey:'word-counter-desc',cat:'text'},
  {path:'/text-stats',icon:'📊',key:'text-stats',descKey:'text-stats-desc',cat:'text'},
  {path:'/text-dedup',icon:'📋',key:'text-dedup',descKey:'text-dedup-desc',cat:'text'},
  {path:'/text-sort',icon:'🔤',key:'text-sort',descKey:'text-sort-desc',cat:'text'},
  {path:'/text-reverse',icon:'🔃',key:'text-reverse',descKey:'text-reverse-desc',cat:'text'},
  {path:'/case-converter',icon:'🔠',key:'case-converter',descKey:'case-converter-desc',cat:'text'},
  {path:'/text-replace',icon:'🔄',key:'text-replace',descKey:'text-replace-desc',cat:'text'},
  {path:'/notepad',icon:'📒',key:'notepad',descKey:'notepad-desc',cat:'text'},
  {path:'/text-ascii',icon:'💻',key:'text-ascii',descKey:'text-ascii-desc',cat:'text'},
  {path:'/text-diff',icon:'📊',key:'text-diff',descKey:'text-diff-desc',cat:'text'},
  {path:'/text-compare',icon:'🔍',key:'text-compare',descKey:'text-compare-desc',cat:'text'},
  {path:'/text-to-slug',icon:'🔗',key:'text-to-slug',descKey:'text-to-slug-desc',cat:'text'},
  {path:'/text-handwriting',icon:'✍️',key:'text-handwriting',descKey:'text-handwriting-desc',cat:'text'},
  {path:'/md-table',icon:'📊',key:'md-table',descKey:'md-table-desc',cat:'text'},
  {path:'/text-cipher',icon:'🔒',key:'text-cipher',descKey:'text-cipher-desc',cat:'text'},
  {path:'/base64',icon:'🔐',key:'base64',descKey:'base64-desc',cat:'dev'},
  {path:'/url-encoder',icon:'🌐',key:'url-encoder',descKey:'url-encoder-desc',cat:'dev'},
  {path:'/html-escape',icon:'🏷️',key:'html-escape',descKey:'html-escape-desc',cat:'dev'},
  {path:'/hash-generator',icon:'#️⃣',key:'hash-generator',descKey:'hash-generator-desc',cat:'dev'},
  {path:'/json-to-csv',icon:'📊',key:'json-to-csv',descKey:'json-to-csv-desc',cat:'dev'},
  {path:'/jwt-decoder',icon:'🎫',key:'jwt-decoder',descKey:'jwt-decoder-desc',cat:'dev'},
  {path:'/xml-formatter',icon:'📋',key:'xml-formatter',descKey:'xml-formatter-desc',cat:'dev'},
  {path:'/json-tree',icon:'🌳',key:'json-tree',descKey:'json-tree-desc',cat:'dev'},
  {path:'/table-generator',icon:'📊',key:'table-generator',descKey:'table-generator-desc',cat:'dev'},
  {path:'/code-formatter',icon:'🎨',key:'code-formatter',descKey:'code-formatter-desc',cat:'dev'},
  {path:'/json-schema-gen',icon:'📋',key:'json-schema-gen',descKey:'json-schema-gen-desc',cat:'dev'},
  {path:'/json-excel',icon:'📊',key:'json-excel',descKey:'json-excel-desc',cat:'dev'},
  {path:'/jsonp-generator',icon:'📋',key:'jsonp-generator',descKey:'jsonp-generator-desc',cat:'dev'},
  {path:'/api-tester',icon:'🔌',key:'api-tester',descKey:'api-tester-desc',cat:'dev'},
  {path:'/prompt-library',icon:'🤖',key:'prompt-library',descKey:'prompt-library-desc',cat:'dev'},
  {path:'/json-to-ts',icon:'💻',key:'json-to-ts',descKey:'json-to-ts-desc',cat:'dev'},
  {path:'/json-to-sql',icon:'💻',key:'json-to-sql',descKey:'json-to-sql-desc',cat:'dev'},
  {path:'/csv-to-json',icon:'💻',key:'csv-to-json',descKey:'csv-to-json-desc',cat:'dev'},
  {path:'/css-minify',icon:'🎨',key:'css-minify',descKey:'css-minify-desc',cat:'frontend'},
  {path:'/js-minify',icon:'⚡',key:'js-minify',descKey:'js-minify-desc',cat:'frontend'},
  {path:'/html-formatter',icon:'📋',key:'html-formatter',descKey:'html-formatter-desc',cat:'frontend'},
  {path:'/css-animation',icon:'✨',key:'css-anim',descKey:'css-anim-desc',cat:'frontend'},
  {path:'/css-grid',icon:'🔲',key:'css-grid',descKey:'css-grid-desc',cat:'frontend'},
  {path:'/css-unit',icon:'📐',key:'css-unit',descKey:'css-unit-desc',cat:'frontend'},
  {path:'/html-preview',icon:'👁️',key:'html-preview',descKey:'html-preview-desc',cat:'frontend'},
  {path:'/svg-editor',icon:'🎨',key:'svg-editor',descKey:'svg-editor-desc',cat:'frontend'},
  {path:'/css-to-tailwind',icon:'🎨',key:'css-to-tailwind',descKey:'css-to-tailwind-desc',cat:'frontend'},
  {path:'/regex-tester',icon:'🔍',key:'regex-tester',descKey:'regex-tester-desc',cat:'regex'},
  {path:'/regex-cheatsheet',icon:'📖',key:'regex-cheatsheet',descKey:'regex-cheatsheet-desc',cat:'regex'},
  {path:'/regex-lib',icon:'📚',key:'regex-lib',descKey:'regex-lib-desc',cat:'regex'},
  {path:'/regex-visual',icon:'🔎',key:'regex-visual',descKey:'regex-visual-desc',cat:'regex'},
  {path:'/regex-builder',icon:'🔧',key:'regex-builder',descKey:'regex-builder-desc',cat:'regex'},
  {path:'/regex-explainer',icon:'🔍',key:'regex-explainer',descKey:'regex-explainer-desc',cat:'regex'},
  {path:'/regex-highlight',icon:'🔍',key:'regex-highlight',descKey:'regex-highlight-desc',cat:'regex'},
  {path:'/aes-encrypt',icon:'🔒',key:'aes-encrypt',descKey:'aes-encrypt-desc',cat:'crypto'},
  {path:'/rsa-generator',icon:'🔐',key:'rsa-generator',descKey:'rsa-generator-desc',cat:'crypto'},
  {path:'/password-generator',icon:'🔑',key:'password-generator',descKey:'password-generator-desc',cat:'crypto'},
  {path:'/password-strength',icon:'🛡️',key:'password-strength',descKey:'password-strength-desc',cat:'crypto'},
  {path:'/password-batch',icon:'🔑',key:'batch-pwd',descKey:'batch-pwd-desc',cat:'crypto'},
  {path:'/password-vault',icon:'🏦',key:'password-vault',descKey:'password-vault-desc',cat:'crypto'},
  {path:'/qr-code',icon:'📱',key:'qrcode',descKey:'qrcode-desc',cat:'gen'},
  {path:'/qr-beautify',icon:'🎨',key:'qr-beautify',descKey:'qr-beautify-desc',cat:'gen'},
  {path:'/barcode',icon:'📊',key:'barcode',descKey:'barcode-desc',cat:'gen'},
  {path:'/uuid-generator',icon:'🆔',key:'uuid-generator',descKey:'uuid-generator-desc',cat:'gen'},
  {path:'/random-number',icon:'🎲',key:'random-number',descKey:'random-number-desc',cat:'gen'},
  {path:'/cron-generator',icon:'⏰',key:'cron-generator',descKey:'cron-generator-desc',cat:'gen'},
  {path:'/lorem-ipsum',icon:'📝',key:'lorem-ipsum',descKey:'lorem-ipsum-desc',cat:'gen'},
  {path:'/lorem-image',icon:'🖼️',key:'lorem-image',descKey:'lorem-image-desc',cat:'gen'},
  {path:'/gradient-generator',icon:'🌈',key:'gradient-generator',descKey:'gradient-generator-desc',cat:'gen'},
  {path:'/favicon-gen',icon:'🎯',key:'favicon-gen',descKey:'favicon-gen-desc',cat:'gen'},
  {path:'/emoji-picker',icon:'🎲',key:'emoji-picker',descKey:'emoji-picker-desc',cat:'gen'},
  {path:'/timestamp',icon:'⏱️',key:'timestamp',descKey:'timestamp-desc',cat:'convert'},
  {path:'/timestamp-enhanced',icon:'⏱️',key:'timestamp-enhanced',descKey:'timestamp-enhanced-desc',cat:'convert'},
  {path:'/number-base',icon:'🔢',key:'number-base',descKey:'number-base-desc',cat:'convert'},
  {path:'/morse-code',icon:'📡',key:'morse-code',descKey:'morse-code-desc',cat:'convert'},
  {path:'/unit-converter',icon:'📐',key:'unit-converter',descKey:'unit-converter-desc',cat:'convert'},
  {path:'/rmb-uppercase',icon:'💰',key:'rmb-uppercase',descKey:'rmb-uppercase-desc',cat:'convert'},
  {path:'/number-chinese',icon:'🔢',key:'number-chinese',descKey:'number-chinese-desc',cat:'convert'},
  {path:'/translator',icon:'🌐',key:'translator',descKey:'translator-desc',cat:'convert'},
  {path:'/image-format',icon:'🔄',key:'image-format',descKey:'image-format-desc',cat:'convert'},
  {path:'/image-to-svg',icon:'🖼️',key:'image-to-svg',descKey:'image-to-svg-desc',cat:'convert'},
  {path:'/svg-export',icon:'📤',key:'svg-export',descKey:'svg-export-desc',cat:'convert'},
  {path:'/color-converter',icon:'🎨',key:'color-converter',descKey:'color-converter-desc',cat:'color'},
  {path:'/color-palette',icon:'🎨',key:'color-palette',descKey:'color-palette-desc',cat:'color'},
  {path:'/hex-rgb',icon:'🎨',key:'hex-rgb',descKey:'hex-rgb-desc',cat:'color'},
  {path:'/color-extract',icon:'🖼️',key:'color-extract',descKey:'color-extract-desc',cat:'color'},
  {path:'/color-blind',icon:'👁️',key:'color-blind',descKey:'color-blind-desc',cat:'color'},
  {path:'/color-contrast',icon:'♿',key:'color-contrast',descKey:'color-contrast-desc',cat:'color'},
  {path:'/color-picker',icon:'🎨',key:'color-picker',descKey:'color-picker-desc',cat:'color'},
  {path:'/color-mixer',icon:'🎨',key:'color-mixer',descKey:'color-mixer-desc',cat:'color'},
  {path:'/color-harmony',icon:'🎭',key:'color-harmony',descKey:'color-harmony-desc',cat:'color'},
  {path:'/image-compress',icon:'🖼️',key:'image-compress',descKey:'image-compress-desc',cat:'util'},
  {path:'/image-base64',icon:'📷',key:'image-base64',descKey:'image-base64-desc',cat:'util'},
  {path:'/image-info',icon:'📷',key:'image-info',descKey:'image-info-desc',cat:'util'},
  {path:'/qr-scanner',icon:'📷',key:'qr-scanner',descKey:'qr-scanner-desc',cat:'util'},
  {path:'/char-info',icon:'🔤',key:'char-info',descKey:'char-info-desc',cat:'util'},
  {path:'/device-info',icon:'📱',key:'device-info',descKey:'device-info-desc',cat:'util'},
  {path:'/clipboard',icon:'📋',key:'clipboard',descKey:'clipboard-desc',cat:'util'},
  {path:'/speed-test',icon:'🌐',key:'speed-test',descKey:'speed-test-desc',cat:'util'},
  {path:'/image-editor',icon:'🖼️',key:'image-editor',descKey:'image-editor-desc',cat:'util'},
  {path:'/image-crop',icon:'✂️',key:'image-crop',descKey:'image-crop-desc',cat:'util'},
  {path:'/meta-tag-gen',icon:'🏷️',key:'meta-tag-gen',descKey:'meta-tag-gen-desc',cat:'util'},
  {path:'/text-to-speech',icon:'🔊',key:'text-to-speech',descKey:'text-to-speech-desc',cat:'util'},
  {path:'/user-agent',icon:'🌐',key:'user-agent',descKey:'user-agent-desc',cat:'util'},
  {path:'/url-parser',icon:'🔗',key:'url-parser',descKey:'url-parser-desc',cat:'util'},
  {path:'/sql-formatter',icon:'🧰',key:'sql-formatter',descKey:'sql-formatter-desc',cat:'util'},
  {path:'/countdown',icon:'⏳',key:'countdown',descKey:'countdown-desc',cat:'time'},
  {path:'/stopwatch',icon:'⏱️',key:'stopwatch',descKey:'stopwatch-desc',cat:'time'},
  {path:'/pomodoro',icon:'🍅',key:'pomodoro',descKey:'pomodoro-desc',cat:'time'},
  {path:'/date-calc',icon:'📅',key:'date-calc',descKey:'date-calc-desc',cat:'time'},
]
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