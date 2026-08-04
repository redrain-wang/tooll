<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🎯 {{ t('favicon-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('favicon-desc') }}</p>
    <div class="space-y-4">
      <div class="card text-center cursor-pointer" @click="$refs.fileInput.click()" v-if="!files.length" style="border:2px dashed var(--border)">
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFiles">
        <p class="text-4xl mb-2">📁</p>
        <p style="color:var(--text-secondary)">{{ t('favicon-hint') }}</p>
      </div>
      <div v-else class="space-y-4">
        <div class="grid grid-cols-3 md:grid-cols-5 gap-3">
          <div v-for="s in sizes" :key="s" class="card text-center">
            <canvas ref="canvases" class="mx-auto" :width="s" :height="s" style="border:1px solid var(--border)"></canvas>
            <p class="text-xs mt-1">{{ s }}×{{ s }}</p>
          </div>
        </div>
        <button @click="generateIco" class="btn-primary w-full" :disabled="generating">{{ generating?t('favicon-generating'):'📦 '+t('favicon-generate') }}</button>
        <button @click="downloadAll" class="btn-secondary w-full">📥 {{ t('favicon-download-all') }}</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import{ref,nextTick}from'vue'
import{t}from'../../i18n'
const files=ref([]);const canvases=ref([]);const generating=ref(false)
const sizes=[16,32,48,64,128,180,192,256,512]
async function handleFiles(e){files.value=Array.from(e.target.files).slice(0,5);await nextTick();drawAll()}
async function drawAll(){for(let i=0;i<files.value.length;i++){const file=files.value[i];const img=new Image();img.src=URL.createObjectURL(file);await new Promise(r=>img.onload=r)
  for(const s of sizes){const cv=canvases.value.find(c=>c.width===s);if(cv){const ctx=cv.getContext('2d');ctx.drawImage(img,0,0,s,s)}}}}
async function generateIco(){generating.value=true
  const cv=canvases.value.find(c=>c.width===32);const ctx=cv.getContext('2d')
  const imgData=ctx.getImageData(0,0,32,32);const bytes=new Uint8Array(22+imgData.data.length)
  const dv=new DataView(bytes.buffer);dv.setUint16(0,0,true);dv.setUint16(2,1,true);dv.setUint16(4,1,true)
  dv.setUint8(6,32);dv.setUint8(7,32);dv.setUint8(8,0);dv.setUint8(9,0);dv.setUint16(10,1,true);dv.setUint16(12,32,true)
  dv.setUint32(14,32*32*4,true);dv.setUint32(18,22,true)
  bytes.set(imgData.data,22)
  const blob=new Blob([bytes],{type:'image/x-icon'});const url=URL.createObjectURL(blob)
  const a=document.createElement('a');a.href=url;a.download='favicon.ico';a.click();generating.value=false}
function downloadAll(){canvases.value.forEach((cv,i)=>{cv.toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=`icon-${cv.width}.png`;a.click()})})}
</script>
