<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('aes-encrypt') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('aes-encrypt-desc') }}</p>
    <div class="space-y-4">
      <textarea v-model="input" class="tool-input h-32 font-mono text-sm" :placeholder="t('aes-input-placeholder')"></textarea>
      <input v-model="key" class="tool-input font-mono text-sm" :placeholder="t('aes-key-placeholder')">
      <div class="flex gap-3 flex-wrap">
        <button @click="encrypt" class="btn-primary">🔒 {{ t('aes-encrypt-btn') }}</button>
        <button @click="decrypt" class="btn-primary">🔓 {{ t('aes-decrypt-btn') }}</button>
        <button @click="genKey" class="btn-secondary">🔑 {{ t('aes-gen-key') }}</button>
        <button @click="copy" class="btn-secondary">📋 {{ t('copy') }}</button>
      </div>
      <div v-if="error" class="p-3 rounded-lg text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">{{ error }}</div>
      <textarea v-model="output" class="tool-input h-32 font-mono text-sm" readonly style="background:var(--card-bg)"></textarea>
    </div>
  </div>
</template>
<script setup>
import{ref}from'vue';import{t}from'../../i18n'
const input=ref('');const output=ref('');const key=ref('');const error=ref('')
async function callBackend(action){
  try{
    const res=await fetch('/api/aes/'+action,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:action==='encrypt'?input.value:output.value,key:key.value.padEnd(32,'0').slice(0,32)})})
    const data=await res.json()
    if(data.success){error.value='';window.showToast?.('OK');return data.result}
    throw new Error(data.error||t('aes-request-failed'))
  }catch(e){throw e}
}
async function encrypt(){
  try{
    if(crypto.subtle){
      const enc=new TextEncoder()
      const k=enc.encode(key.value.padEnd(32,'0').slice(0,32))
      const cryptoKey=await crypto.subtle.importKey('raw',k,{name:'AES-GCM'},false,['encrypt'])
      const iv=crypto.getRandomValues(new Uint8Array(12))
      const encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv},cryptoKey,enc.encode(input.value))
      output.value=btoa(String.fromCharCode(...iv,...new Uint8Array(encrypted)));error.value='';window.showToast?.('OK')
    }else{
      output.value=await callBackend('encrypt')
    }
  }catch(e){error.value=e.message}
}
async function decrypt(){
  try{
    if(crypto.subtle){
      const enc=new TextEncoder();const dec=new TextDecoder()
      const k=enc.encode(key.value.padEnd(32,'0').slice(0,32))
      const cryptoKey=await crypto.subtle.importKey('raw',k,{name:'AES-GCM'},false,['decrypt'])
      const data=Uint8Array.from(atob(output.value),c=>c.charCodeAt(0))
      const iv=data.slice(0,12);const encrypted=data.slice(12)
      const decrypted=await crypto.subtle.decrypt({name:'AES-GCM',iv},cryptoKey,encrypted)
      input.value=dec.decode(decrypted);error.value='';window.showToast?.('OK')
    }else{
      input.value=await callBackend('decrypt')
    }
  }catch(e){error.value=t('aes-decrypt-failed')+': '+e.message}
}
function genKey(){key.value=Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,'0')).join('');window.showToast?.(t('aes-key-generated'))}
function copy(){navigator.clipboard.writeText(output.value);window.showToast?.(t('copied'))}
</script>
