<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">📋 {{ t('clipboard-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('clipboard-desc') }}</p>
    <div class="space-y-4">
      <textarea v-model="newText" class="tool-input h-24 font-mono text-sm" :placeholder="t('clipboard-placeholder')"></textarea>
      <button @click="addClip" class="btn-primary w-full">➕ {{ t('clipboard-save') }}</button>
      <div v-if="clips.length" class="space-y-2">
        <div v-for="(clip,i) in clips" :key="i" class="card">
          <div class="flex items-start justify-between gap-2">
            <p class="text-sm font-mono break-all flex-1" style="color:var(--text)">{{ clip.text.slice(0,200) }}{{ clip.text.length>200?'...':'' }}</p>
            <div class="flex gap-1 flex-shrink-0">
              <button @click="copyClip(clip)" class="btn-secondary text-xs">📋</button>
              <button @click="clips.splice(i,1);save()" class="text-sm" style="color:var(--text-secondary)">✕</button>
            </div>
          </div>
          <p class="text-xs mt-1" style="color:var(--text-secondary)">{{ clip.time }}</p>
        </div>
        <button @click="clips=[];save()" class="btn-secondary w-full">🗑️ {{ t('clipboard-clear-all') }}</button>
      </div>
      <p v-else class="text-center py-8" style="color:var(--text-secondary)">{{ t('clipboard-empty') }}</p>
    </div>
  </div>
</template>
<script setup>
import{ref,onMounted}from'vue';import{t}from'../../i18n'
const clips=ref([]);const newText=ref('')
onMounted(()=>{try{clips.value=JSON.parse(localStorage.getItem('toolbox_clips')||'[]')}catch{}})
function save(){localStorage.setItem('toolbox_clips',JSON.stringify(clips.value.slice(0,50)))}
function addClip(){
  if(!newText.value.trim())return
  clips.value.unshift({text:newText.value.trim(),time:new Date().toLocaleString()})
  save();newText.value='';window.showToast?.(t('clipboard-saved'))
}
function copyClip(clip){navigator.clipboard.writeText(clip.text);window.showToast?.(t('copied'))}
</script>
