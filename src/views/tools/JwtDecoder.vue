<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('jwt-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('jwt-desc') }}</p>
    <div class="space-y-4">
      <textarea v-model="input" class="tool-input h-32 font-mono text-sm" :placeholder="t('jwt-placeholder')"></textarea>
      <button @click="decode" class="btn-primary">{{ t('jwt-parse') }}</button>
      <div v-if="error" class="p-3 rounded-lg text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">{{ error }}</div>
      <div v-if="parts.length" class="grid md:grid-cols-3 gap-4">
        <div v-for="(p,i) in parts" :key="i" class="card">
          <p class="text-sm font-semibold mb-2" :style="{color:['#ef4444','#3b82f6','#22c55e'][i]}">{{ ['Header','Payload','Signature'][i] }}</p>
          <pre class="text-xs font-mono whitespace-pre-wrap break-all" style="color:var(--text)">{{ p }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import{ref}from'vue'
import{t}from'../../i18n'
const input=ref('');const parts=ref([]);const error=ref('')
function decode(){
  error.value='';parts.value=[]
  try{
    const segs=input.value.trim().split('.')
    if(segs.length<2){error.value='Invalid JWT';return}
    parts.value=[
      JSON.stringify(JSON.parse(atob(segs[0].replace(/-/g,'+').replace(/_/g,'/'))),null,2),
      JSON.stringify(JSON.parse(atob(segs[1].replace(/-/g,'+').replace(/_/g,'/'))),null,2),
      segs[2]||''
    ]
    window.showToast?.('OK')
  }catch(e){error.value=e.message}
}
</script>
