<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🔐 {{ t('rsa-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('rsa-desc') }}</p>
    <div class="space-y-4">
      <div class="flex gap-3 items-center flex-wrap">
        <select v-model="keySize" class="tool-input w-36">
          <option :value="1024">1024{{ t('rsa-bit') }}</option>
          <option :value="2048">2048{{ t('rsa-bit-rec') }}</option>
          <option :value="4096">4096{{ t('rsa-bit') }}</option>
        </select>
        <button @click="generate" class="btn-primary" :disabled="generating">
          {{ generating?'⏳ '+t('rsa-generating'):'🔑 '+t('rsa-generate') }}
        </button>
      </div>
      
      <div v-if="keys" class="space-y-4">
        <div class="card">
          <div class="flex items-center justify-between mb-2">
            <p class="font-semibold text-sm" style="color:#22c55e">🔓 {{ t('rsa-public') }}</p>
            <button @click="copy(keys.public)" class="btn-secondary text-xs">📋</button>
          </div>
          <pre class="text-xs font-mono p-3 rounded overflow-auto max-h-40" style="background:var(--bg);color:var(--text)">{{ keys.public }}</pre>
        </div>
        <div class="card">
          <div class="flex items-center justify-between mb-2">
            <p class="font-semibold text-sm" style="color:#ef4444">🔒 {{ t('rsa-private') }}</p>
            <button @click="copy(keys.private)" class="btn-secondary text-xs">📋</button>
          </div>
          <pre class="text-xs font-mono p-3 rounded overflow-auto max-h-40" style="background:var(--bg);color:var(--text)">{{ keys.private }}</pre>
        </div>
        <p class="text-xs" style="color:var(--text-secondary)">⚠️ {{ t('rsa-warning') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import{ref}from'vue';import{t}from'../../i18n'
const keySize=ref(2048);const keys=ref(null);const generating=ref(false)

async function generate(){
  generating.value=true;keys.value=null
  try{
    const res=await fetch('/api/rsa/generate',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({keySize:keySize.value})
    })
    const data=await res.json()
    if(data.public && data.private){
      keys.value=data
      window.showToast?.(t('rsa-generated'))
    }else{
      window.showToast?.(t('rsa-failed')+': '+data.error)
    }
  }catch(e){window.showToast?.(t('rsa-failed')+': '+e.message)}
  generating.value=false
}

function copy(v){navigator.clipboard.writeText(v);window.showToast?.(t('copied'))}
</script>
