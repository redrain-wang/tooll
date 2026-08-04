<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🎨 {{ t('color-extract-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('color-extract-desc') }}</p>
    <div class="space-y-4">
      <div class="card text-center cursor-pointer" @click="$refs.fileInput.click()" style="border:2px dashed var(--border)">
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFile">
        <p class="text-4xl mb-2">🖼️</p>
        <p style="color:var(--text-secondary)">{{ t('color-extract-select') }}</p>
      </div>
      
      <canvas ref="canvas" class="hidden"></canvas>
      
      <div v-if="colors.length" class="space-y-4">
        <p class="font-semibold" style="color:var(--text)">{{ t('color-extract-extracted') }}</p>
        <div class="grid grid-cols-3 md:grid-cols-5 gap-2">
          <div v-for="(c,i) in colors" :key="i" class="rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform" @click="copy(c.hex)">
            <div class="h-20" :style="{background:c.hex}"></div>
            <div class="p-2 text-center" style="background:var(--card-bg)">
              <p class="text-xs font-mono" style="color:var(--text)">{{ c.hex }}</p>
            </div>
          </div>
        </div>
        <button @click="copyPalette" class="btn-primary w-full">📋 {{ t('color-extract-copy-all') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import{ref}from'vue';import{t}from'../../i18n'
const colors=ref([]);const canvas=ref(null)

function handleFile(e){
  const file=e.target.files[0];if(!file)return
  const reader=new FileReader()
  reader.onload=(ev)=>{
    const img=new Image();img.crossOrigin='anonymous'
    img.onload=()=>extractColors(img)
    img.src=ev.target.result
  }
  reader.readAsDataURL(file)
}

function extractColors(img){
  const cv=canvas.value;const ctx=cv.getContext('2d')
  const size=100;cv.width=size;cv.height=size
  ctx.drawImage(img,0,0,size,size)
  const data=ctx.getImageData(0,0,size,size).data
  
  const colorMap={};const step=4*10
  for(let i=0;i<data.length;i+=step){
    const r=Math.round(data[i]/32)*32,g=Math.round(data[i+1]/32)*32,b=Math.round(data[i+2]/32)*32
    const key=r+','+g+','+b;colorMap[key]=(colorMap[key]||0)+1
  }
  
  colors.value=Object.entries(colorMap)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,10)
    .map(([k])=>{const[r,g,b]=k.split(',');return{hex:'#'+[r,g,b].map(v=>(+v).toString(16).padStart(2,'0')).join('')}})
}

function copyPalette(){navigator.clipboard.writeText(colors.value.map(c=>c.hex).join('\n'));window.showToast?.(t('copied'))}
</script>
