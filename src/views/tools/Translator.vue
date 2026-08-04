<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🌐 {{ t('translator-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('translator-desc') }}</p>
    <div class="space-y-4">
      <div class="flex gap-3 items-center flex-wrap">
        <select v-model="fromLang" class="tool-input w-32"><option v-for="l in langs" :key="l.code" :value="l.code">{{ l.name }}</option></select>
        <button @click="swap" class="btn-secondary">⇄</button>
        <select v-model="toLang" class="tool-input w-32"><option v-for="l in langs" :key="l.code" :value="l.code">{{ l.name }}</option></select>
      </div>
      <textarea v-model="sourceText" class="tool-input h-40 font-mono text-sm" :placeholder="t('translator-placeholder')"></textarea>
      <button @click="translate" :disabled="translating||!sourceText.trim()" class="btn-primary w-full">{{ translating?t('translator-translating'):t('translator-btn') }}</button>
      <div v-if="error" class="p-3 rounded text-sm" style="background:#fee2e2;color:#dc2626">{{ error }}</div>
      <textarea v-model="resultText" class="tool-input h-40 font-mono text-sm" readonly style="background:var(--card-bg)"></textarea>
      <button @click="copyResult" class="btn-secondary w-full" :disabled="!resultText">📋 {{ t('translator-copy-result') }}</button>
    </div>
  </div>
</template>
<script setup>
import{ref}from'vue';import{t,locale}from'../../i18n'
const fromLang=ref(locale.value==='zh'?'zh':'en')
const toLang=ref(locale.value==='zh'?'en':'zh')
const sourceText=ref('');const resultText=ref('');const translating=ref(false);const error=ref('')
const langs=[{code:'zh',name:'中文'},{code:'en',name:'English'},{code:'ja',name:'日本語'},{code:'ko',name:'한국어'},{code:'fr',name:'Français'},{code:'de',name:'Deutsch'},{code:'es',name:'Español'},{code:'ru',name:'Русский'},{code:'it',name:'Italiano'},{code:'pt',name:'Português'},{code:'ar',name:'العربية'},{code:'th',name:'ไทย'},{code:'vi',name:'Tiếng Việt'},{code:'id',name:'Bahasa Indonesia'}]
async function translate(){error.value='';translating.value=true
  try{
    const res=await fetch('/api/translate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({q:sourceText.value,source:fromLang.value,target:toLang.value})})
    const data=await res.json()
    if(data.translatedText){resultText.value=data.translatedText}else{error.value=t('translator-failed')+': '+(data.error||t('translator-unknown-error'))}
  }catch(e){error.value=t('translator-network-error')+': '+e.message}
  translating.value=false}
function swap(){[fromLang.value,toLang.value]=[toLang.value,fromLang.value];if(sourceText.value&&resultText.value){const tmp=sourceText.value;sourceText.value=resultText.value;resultText.value=tmp}}
function copyResult(){navigator.clipboard.writeText(resultText.value);window.showToast?.(t('copied'))}
</script>
