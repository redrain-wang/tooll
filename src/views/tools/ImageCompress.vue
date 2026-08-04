<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🖼️ {{ t('image-compress-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('image-compress-desc') }}</p>
    <div class="space-y-4">
      <div class="card text-center cursor-pointer" @click="$refs.fileInput.click()" style="border:2px dashed var(--border)">
        <input ref="fileInput" type="file" accept="image/*" multiple class="hidden" @change="handleFiles">
        <p class="text-4xl mb-2">📁</p>
        <p style="color:var(--text-secondary)">{{ t('image-compress-drop') }}</p>
      </div>
      
      <div v-if="images.length" class="space-y-3">
        <div v-for="(img,i) in images" :key="i" class="card">
          <div class="flex items-center gap-4">
            <img :src="img.preview" class="w-16 h-16 object-cover rounded-lg">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate" style="color:var(--text)">{{ img.name }}</p>
              <p class="text-xs" style="color:var(--text-secondary)">
                {{ img.originalSize }} → <span :style="{color:img.saved>0?'#22c55e':'var(--text-secondary)'}">{{ img.compressedSize }}</span>
                <span v-if="img.saved>0" class="ml-1 px-1.5 py-0.5 rounded text-xs" style="background:#dcfce7;color:#16a34a">-{{ img.saved }}%</span>
              </p>
            </div>
            <button @click="images.splice(i,1)" class="text-sm" style="color:var(--text-secondary)">✕</button>
          </div>
          <div class="mt-3 flex items-center gap-3">
            <label class="text-xs" style="color:var(--text-secondary)">{{ t('image-compress-quality') }}</label>
            <input type="range" v-model.number="img.quality" min="10" max="100" step="5" class="flex-1" @change="compress(i)">
            <span class="text-xs font-mono w-8" style="color:var(--primary)">{{ img.quality }}%</span>
          </div>
          <div class="mt-2 flex gap-2">
            <button @click="downloadImg(img)" class="btn-secondary text-xs flex-1">💾 {{ t('image-compress-download') }}</button>
          </div>
        </div>
        <button @click="downloadAll" class="btn-primary w-full">📦 {{ t('image-compress-batch') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import{ref}from'vue';import{t}from'../../i18n'
const images=ref([])

function handleFiles(e){
  Array.from(e.target.files).forEach(file=>{
    const reader=new FileReader()
    reader.onload=(ev)=>{
      images.value.push({
        name:file.name,preview:ev.target.result,data:ev.target.result,
        originalSize:formatSize(file.size),compressedSize:'-',saved:0,quality:80,blob:null
      })
    }
    reader.readAsDataURL(file)
  })
}

function formatSize(b){return b>1048576?(b/1048576).toFixed(1)+'MB':(b/1024).toFixed(1)+'KB'}

async function compress(i){
  const img=images.value[i]
  const canvas=document.createElement('canvas')
  const ctx=canvas.getContext('2d')
  const el=new Image()
  el.onload=()=>{
    canvas.width=el.width;canvas.height=el.height
    ctx.drawImage(el,0,0)
    canvas.toBlob(blob=>{
      img.blob=blob;img.compressedSize=formatSize(blob.size)
      img.saved=Math.round((1-blob.size/(el.width*el.height*0.5))*100)
    },'image/jpeg',img.quality/100)
  }
  el.src=img.data
}

function downloadImg(img){
  if(!img.blob)compress(images.value.indexOf(img))
  const a=document.createElement('a');a.href=URL.createObjectURL(img.blob);a.download='compressed_'+img.name;a.click()
}

function downloadAll(){
  images.value.forEach((img,i)=>setTimeout(()=>downloadImg(img),i*200))
}
</script>
