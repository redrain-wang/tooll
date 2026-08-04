<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🏦 {{ t('password-vault-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('password-vault-desc') }}</p>
    
    <div v-if="!unlocked" class="card max-w-md mx-auto space-y-4">
      <p class="text-sm" style="color:var(--text-secondary)">{{ vaultExists?t('password-vault-unlock'):t('password-vault-create-hint') }}</p>
      <input v-model="masterPass" type="password" class="tool-input" :placeholder="t('password-vault-master')">
      <button @click="unlock" class="btn-primary w-full">{{ vaultExists?'🔓 '+t('password-vault-unlock-btn'):'🔐 '+t('password-vault-create-btn') }}</button>
      <p v-if="vaultError" class="text-xs" style="color:#ef4444">{{ vaultError }}</p>
    </div>
    
    <div v-else class="space-y-4">
      <div class="card">
        <div class="flex gap-3 items-center">
          <input v-model="newEntry.name" class="tool-input flex-1" :placeholder="t('password-vault-site')">
          <input v-model="newEntry.username" class="tool-input flex-1" :placeholder="t('password-vault-username')">
          <input v-model="newEntry.password" type="password" class="tool-input flex-1" :placeholder="t('password-vault-pwd')">
          <button @click="addEntry" class="btn-primary">➕</button>
        </div>
      </div>
      
      <div v-for="(entry,i) in entries" :key="i" class="card">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <p class="font-semibold text-sm" style="color:var(--text)">{{ entry.name }}</p>
            <p class="text-xs font-mono" style="color:var(--text-secondary)">{{ entry.username }}</p>
          </div>
          <div class="flex gap-2">
            <button @click="copy(entry.password)" class="btn-secondary text-xs">🔑 {{ t('password-vault-copy-pwd') }}</button>
            <button @click="entries.splice(i,1);saveVault()" class="text-sm" style="color:var(--text-secondary)">✕</button>
          </div>
        </div>
      </div>
      
      <button @click="lock" class="btn-secondary w-full">🔒 {{ t('password-vault-lock') }}</button>
    </div>
  </div>
</template>

<script setup>
import{ref}from'vue';import{t}from'../../i18n'
import CryptoJS from 'crypto-js'
const masterPass=ref('');const unlocked=ref(false);const entries=ref([]);const vaultError=ref('')
const currentPass=ref('')
const newEntry=ref({name:'',username:'',password:''})
const vaultExists=ref(!!localStorage.getItem('vault_data'))

async function unlock(){
  vaultError.value=''
  if(!masterPass.value){ vaultError.value=t('password-vault-enter-master'); return }
  currentPass.value=masterPass.value
  if(!vaultExists.value){
    localStorage.setItem('vault_data', CryptoJS.AES.encrypt(JSON.stringify([]), masterPass.value).toString())
    localStorage.setItem('vault_version', '1')
    entries.value=[];unlocked.value=true;masterPass.value=''
    vaultExists.value=true
    return
  }
  try{
    const txt=CryptoJS.AES.decrypt(localStorage.getItem('vault_data'), masterPass.value).toString(CryptoJS.enc.Utf8)
    entries.value=JSON.parse(txt)
    unlocked.value=true;masterPass.value=''
  }catch{vaultError.value=t('password-vault-wrong-master');currentPass.value=''}
}

function saveVault(){
  if(!currentPass.value)return
  localStorage.setItem('vault_data', CryptoJS.AES.encrypt(JSON.stringify(entries.value), currentPass.value).toString())
}

function addEntry(){
  if(!newEntry.value.name)return
  entries.value.push({...newEntry.value})
  saveVault();newEntry.value={name:'',username:'',password:''}
}

function lock(){unlocked.value=false;entries.value=[];masterPass.value='';currentPass.value=''}
function copy(v){navigator.clipboard.writeText(v);window.showToast?.(t('copied'))}
</script>
