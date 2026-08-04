<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">📷 {{ t('qr-scanner-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('qr-scanner-desc') }}</p>
    <div class="space-y-4">
      <div class="card text-center cursor-pointer" @click="$refs.fileInput.click()" style="border:2px dashed var(--border)">
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFile">
        <p class="text-4xl mb-2">📷</p>
        <p style="color:var(--text-secondary)">{{ t('qr-scanner-select') }}</p>
      </div>
      <img v-if="preview" :src="preview" class="max-h-64 mx-auto rounded-lg">
      <div v-if="error" class="p-3 rounded-lg text-sm" style="background:#fee2e2;color:#dc2626">{{ error }}</div>
      <div v-if="results.length" class="space-y-2">
        <div v-for="(r,i) in results" :key="i" class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs mb-1" style="color:var(--text-secondary)">{{ r.type }}</p>
              <p class="font-mono text-sm break-all" style="color:var(--text)">{{ r.data }}</p>
            </div>
            <button @click="copy(r.data)" class="btn-secondary text-xs">📋</button>
          </div>
          <a v-if="isUrl(r.data)" :href="r.data" target="_blank" class="block mt-2 text-sm text-center py-1 rounded" style="color:var(--primary)">🔗 {{ t('qr-scanner-open-link') }}</a>
        </div>
      </div>
      <div v-if="!results.length&&!error&&preview" class="text-center py-8" style="color:var(--text-secondary)">
        <p>{{ t('qr-scanner-not-found') }}</p>
        <p class="text-xs mt-1">{{ t('qr-scanner-hint') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import{ref}from'vue';import{t}from'../../i18n'
const preview=ref('');const results=ref([]);const error=ref('')

function handleFile(e){
  const file=e.target.files[0];if(!file)return
  const reader=new FileReader()
  reader.onload=async(ev)=>{
    preview.value=ev.target.result
    try{
      if(!window.BarcodeDetector){error.value=t('qr-scanner-unsupported');return}
      const detector=new BarcodeDetector({formats:['qr_code','ean_13','ean_8','code_128','code_39','upc_a','upc_e']})
      const img=new Image();img.src=preview.value
      await new Promise(r=>img.onload=r)
      const barcodes=await detector.detect(img)
      results.value=barcodes.map(b=>({data:b.rawValue,type:b.format.replace(/_/g,' ').toUpperCase()}))
      if(!results.value.length)error.value=''
    }catch(e){error.value=t('qr-scanner-failed')+': '+e.message}
  }
  reader.readAsDataURL(file)
}

function isUrl(s){return/^https?:\/\//.test(s)}
function copy(v){navigator.clipboard.writeText(v);window.showToast?.(t('copied'))}
</script>
