<template>
  <div id="app" class="min-h-screen flex">
    <aside class="sidebar">
      <div class="p-3 space-y-1">
        <router-link to="/" class="sidebar-link" :class="{active:route.path==='/'||showMobileNav===false}">
          🏠 {{ t('home') }}
        </router-link>
        <div v-for="cat in categories" :key="cat.key">
          <div class="flex items-center">
            <router-link :to="'/category/'+cat.key" class="sidebar-cat flex-1">
              <span>{{ cat.icon }} {{ t(cat.labelKey) }}</span>
            </router-link>
            <button @click="toggle(cat.key)" class="sidebar-cat" style="width:auto;padding:8px">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="transition-transform" :style="{transform:open[cat.key]?'rotate(90deg)':''}"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
          <div v-show="open[cat.key]" class="ml-2 space-y-0.5">
            <router-link v-for="tool in cat.tools" :key="tool.p" :to="tool.p" class="sidebar-item" :class="{active:route.path===tool.p}">
              {{ t(tool.k) }}
            </router-link>
          </div>
        </div>
      </div>
    </aside>

    <div class="flex-1 flex flex-col min-h-screen">
      <header class="top-bar">
        <div class="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <button @click="showMobileNav=true" class="md:hidden p-2" style="color:var(--text-secondary)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <router-link to="/" class="logo">🧰 <span class="hidden sm:inline">ToolBox</span></router-link>
          </div>
          <div class="flex items-center gap-2">
            <button v-if="route.name!=='Home'" @click="shareTool" class="icon-btn" :title="t('share')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            </button>
            <button @click="toggleLang" class="lang-btn">{{ locale==='zh'?'EN':'中' }}</button>
            <button @click="cycleTheme" class="icon-btn" :title="t('theme-'+themeMode)">
              <svg v-if="themeMode==='dark'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/></svg>
              <svg v-else-if="themeMode==='light'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            </button>
          </div>
        </div>
      </header>

      <!-- Mobile nav -->
      <div v-if="showMobileNav" class="mobile-overlay" @click="showMobileNav=false">
        <div class="mobile-panel" @click.stop>
          <div class="p-4">
            <div class="flex items-center justify-between mb-4">
              <span class="font-bold" style="color:var(--text)">{{ t('tool-categories') }}</span>
              <button @click="showMobileNav=false" style="color:var(--text-secondary)">✕</button>
            </div>
            <router-link to="/" class="mobile-link" @click="showMobileNav=false">🏠 {{ t('home') }}</router-link>
            <div v-for="cat in categories" :key="cat.key" class="mb-3">
              <router-link :to="'/category/'+cat.key" class="mobile-link font-semibold" @click="showMobileNav=false">{{ cat.icon }} {{ t(cat.labelKey) }}</router-link>
              <router-link v-for="tool in cat.tools" :key="tool.p" :to="tool.p" class="mobile-link" @click="showMobileNav=false">{{ t(tool.k) }}</router-link>
            </div>
          </div>
        </div>
      </div>

      <div v-if="route.name!=='Home'" class="breadcrumb">
        <div class="max-w-5xl mx-auto flex items-center gap-2 text-sm" style="color:var(--text-secondary)">
          <router-link to="/" class="hover:underline" style="color:var(--primary)">🏠 {{ t('home') }}</router-link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity:0.5"><polyline points="9 18 15 12 9 6"/></svg>
          <template v-if="route.name==='Category'">
            <span>{{ t('tool-categories') }}</span>
          </template>
          <template v-else-if="currentCategory">
            <router-link :to="'/category/'+currentCategory.key" class="hover:underline" style="color:var(--primary)">{{ t(currentCategory.labelKey) }}</router-link>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity:0.5"><polyline points="9 18 15 12 9 6"/></svg>
            <span>{{ toolTitle }}</span>
          </template>
          <span v-else>{{ toolTitle }}</span>
        </div>
      </div>

      <main class="flex-1 pb-16 md:pb-0">
        <router-view :key="route.fullPath" />
        <ToolUsage v-if="route.name&&route.name!=='Home'&&route.name!=='Category'&&route.name!=='NotFound'" />
        <RelatedTools v-if="route.name&&route.name!=='Home'&&route.name!=='Category'&&route.name!=='NotFound'" />
      </main>

      <footer class="footer hidden md:block">
        <p>{{ t('footer1') }} · 108 tools</p>
        <div class="flex justify-center gap-6 mt-2">
          <router-link to="/" class="hover:underline" style="color:var(--text-secondary)">{{ t('home') }}</router-link>
          <a href="https://github.com" target="_blank" rel="noopener" class="hover:underline" style="color:var(--text-secondary)">GitHub</a>
        </div>
      </footer>
    </div>

    

    <div id="toast" class="toast"></div>
    <button v-if="showBackTop" @click="scrollToTop" class="back-to-top" title="Back to top">↑</button>
  </div>
</template>

<script setup>
import{ref,reactive,computed,onMounted,watch}from'vue'
import{useRoute}from'vue-router'
import{t,locale,setLocale}from'./i18n'
import{categories}from'./data/categories'
import RelatedTools from'./components/RelatedTools.vue'
import ToolUsage from'./components/ToolUsage.vue'

const route=useRoute()
const isDark=ref(false)
const themeMode=ref('system')
const showMobileNav=ref(false)
const showBackTop=ref(false)
const open=reactive({})
categories.forEach(c=>open[c.key]=false)

const toolTitle=computed(()=>{
  const n=route.name
  if(!n||n==='Home')return''
  return t(n.toLowerCase().replace(/([A-Z])/g,m=>'-'+m.toLowerCase()).replace(/^-/,''))
})

const currentCategory=computed(()=>{
  if(route.name==='Category')return null
  return categories.find(c=>c.tools.some(t=>t.p===route.path))
})

function applyTheme(){
  if(themeMode.value==='system'){
    isDark.value=window.matchMedia('(prefers-color-scheme:dark)').matches
  }else{
    isDark.value=themeMode.value==='dark'
  }
  document.documentElement.classList.toggle('dark',isDark.value)
}

onMounted(()=>{
  const saved=localStorage.getItem('themeMode')
  themeMode.value=saved||'system'
  applyTheme()
  document.documentElement.lang=locale.value
  window.matchMedia('(prefers-color-scheme:dark)').addEventListener('change',()=>{
    if(themeMode.value==='system')applyTheme()
  })
  window.addEventListener('scroll',()=>{showBackTop.value=window.scrollY>300})
})

watch(()=>route.path,p=>{
  showMobileNav.value=false
  if(p==='/')return
  try{
    let r=JSON.parse(localStorage.getItem('toolbox_recent')||'[]')
    const now=new Date()
    const timeStr=now.toLocaleDateString(locale.value==='zh'?'zh-CN':'en-US',{month:'short',day:'numeric'})
    r=[{path:p,time:timeStr},...r.filter(x=>x.path!==p)].slice(0,20)
    localStorage.setItem('toolbox_recent',JSON.stringify(r))
  }catch{}
  try{
    let c=JSON.parse(localStorage.getItem('toolbox_counts')||'{}')
    c[p]=(c[p]||0)+1
    localStorage.setItem('toolbox_counts',JSON.stringify(c))
  }catch{}
},{immediate:true})

function cycleTheme(){
  const modes=['light','dark','system']
  const i=modes.indexOf(themeMode.value)
  themeMode.value=modes[(i+1)%3]
  localStorage.setItem('themeMode',themeMode.value)
  applyTheme()
}
function toggleLang(){setLocale(locale.value==='zh'?'en':'zh')}
function shareTool(){navigator.share?navigator.share({title:document.title,url:window.location.href}):navigator.clipboard.writeText(window.location.href).then(()=>window.showToast?.(t('copied')))}
function toggle(k){open[k]=!open[k]}
function scrollToTop(){window.scrollTo({top:0,behavior:'smooth'})}

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    if(showMobileNav.value){showMobileNav.value=false;return}
    if(route.path!=='/')router.push('/')
  }
  if(e.key==='/'&&!e.ctrlKey&&!e.metaKey){
    const el=document.querySelector('input[type="text"],input:not([type]),textarea')
    if(el&&document.activeElement!==el){e.preventDefault();el.focus()}
  }
})

window.showToast=(msg)=>{const el=document.getElementById('toast');if(!el)return;el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2000)}
</script>

<style>
.sidebar{width:224px;flex-shrink:0;border-right:1px solid var(--border);background:var(--card-bg);position:sticky;top:56px;height:calc(100vh - 56px);overflow-y:auto;display:none}
@media(min-width:768px){.sidebar{display:block}}
.sidebar-link{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:8px;font-size:14px;text-decoration:none;color:var(--text);transition:all .2s}
.sidebar-link:hover,.sidebar-link.active{background:var(--primary);color:white}
.sidebar-cat{width:100%;display:flex;align-items:center;justify-content:space-between;padding:8px 12px;border-radius:8px;font-size:14px;color:var(--text);background:none;border:none;cursor:pointer;text-align:left}
.sidebar-cat:hover{background:var(--bg)}
.sidebar-item{display:block;padding:4px 12px;border-radius:6px;font-size:12px;text-decoration:none;color:var(--text-secondary);transition:all .2s}
.sidebar-item:hover,.sidebar-item.active{color:var(--primary);background:var(--bg)}
@media(max-width:767px){
  .sidebar-item{padding:8px 16px;font-size:14px}
  .mobile-link{padding:10px 16px;font-size:14px}
}
.top-bar{position:sticky;top:0;z-index:50;border-bottom:1px solid var(--border);background:var(--card-bg)}
.logo{display:flex;align-items:center;gap:8px;font-size:18px;font-weight:700;text-decoration:none;color:var(--primary)}
.icon-btn{padding:8px;border-radius:8px;color:var(--text-secondary);background:none;border:none;cursor:pointer}
.lang-btn{padding:4px 10px;border-radius:8px;font-size:12px;font-weight:500;background:var(--border);color:var(--text-secondary);border:none;cursor:pointer}
.breadcrumb{border-bottom:1px solid var(--border);background:var(--card-bg);padding:10px 20px;font-size:13px;display:none}
@media(min-width:768px){.breadcrumb{display:block}}
.footer{border-top:1px solid var(--border);padding:16px;text-align:center;font-size:12px;color:var(--text-secondary)}
.mobile-overlay{position:fixed;inset:0;z-index:50;background:rgba(0,0,0,.5)}
.mobile-panel{position:absolute;left:0;top:0;bottom:0;width:280px;overflow-y:auto;background:var(--card-bg);padding:16px;padding-top:calc(16px + env(safe-area-inset-top))}
.mobile-link{display:block;padding:10px 16px;border-radius:8px;font-size:14px;text-decoration:none;color:var(--text)}
.mobile-link:active{background:var(--bg)}

.toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(100px);background:#1e293b;color:white;padding:12px 24px;border-radius:8px;font-size:14px;z-index:9999;opacity:0;transition:all .3s;pointer-events:none}
.toast.show{transform:translateX(-50%) translateY(0);opacity:1}
.back-to-top{position:fixed;bottom:2rem;right:2rem;width:40px;height:40px;border-radius:50%;background:var(--primary);color:white;border:none;font-size:18px;cursor:pointer;z-index:40;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.2);transition:all .3s}
.back-to-top:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,.3)}
</style>
