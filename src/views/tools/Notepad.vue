<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('notepad') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('notepad-desc') }}</p>
    <div class="space-y-4">
      <div class="flex gap-3 flex-wrap">
        <button @click="clear" class="btn-secondary">🗑️ {{ t('notepad-clear') }}</button>
        <button @click="download" class="btn-secondary">📥 {{ t('download') }}</button>
        <button @click="copy" class="btn-secondary">📋 {{ t('copy') }}</button>
        <span class="text-sm self-center" style="color:var(--text-secondary)">{{ charCount }} {{ t('notepad-chars') }} | {{ t('notepad-auto-save') }}</span>
      </div>
      <textarea v-model="text" class="tool-input font-mono text-sm" style="min-height:500px" :placeholder="t('notepad-placeholder')" @input="save"></textarea>
    </div>
  </div>
</template>
<script setup>
import{ref,computed,onMounted}from'vue';import{t}from'../../i18n'
const text=ref('')
const charCount=computed(()=>text.value.length)
onMounted(()=>{text.value=localStorage.getItem('notepad')||''})
function save(){localStorage.setItem('notepad',text.value)}
function clear(){if(confirm(t('notepad-confirm-clear'))){text.value='';save()}}
function download(){const b=new Blob([text.value],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='note.txt';a.click()}
function copy(){navigator.clipboard.writeText(text.value);window.showToast?.(t('copied'))}
</script>
