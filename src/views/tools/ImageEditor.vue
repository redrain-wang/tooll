<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🖼️ {{ t('image-editor-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('image-editor-desc') }}</p>
    <div class="space-y-4">
      <div class="card text-center cursor-pointer" @click="$refs.fileInput.click()" v-if="!img" style="border:2px dashed var(--border)">
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="loadImage">
        <p class="text-4xl mb-2">📷</p>
        <p style="color:var(--text-secondary)">{{ t('image-editor-select') }}</p>
      </div>
      <div v-else class="space-y-4">
        <canvas ref="canvas" class="mx-auto max-w-full" style="max-height:500px;box-shadow:var(--shadow)"></canvas>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="card">
            <p class="font-medium mb-3">✂️ {{ t('image-editor-crop') }}</p>
            <div class="flex gap-2 flex-wrap">
              <button @click="setCrop(1,1)" class="btn-secondary text-sm">1:1</button>
              <button @click="setCrop(16,9)" class="btn-secondary text-sm">16:9</button>
              <button @click="setCrop(4,3)" class="btn-secondary text-sm">4:3</button>
              <button @click="setCrop(3,4)" class="btn-secondary text-sm">3:4</button>
              <button @click="applyCrop" class="btn-primary text-sm" v-if="cropping">{{ t('image-editor-apply-crop') }}</button>
              <button @click="cancelCrop" class="btn-secondary text-sm" v-if="cropping">{{ t('image-editor-cancel') }}</button>
            </div>
          </div>
          <div class="card">
            <p class="font-medium mb-3">🔄 {{ t('image-editor-rotate') }}</p>
            <div class="flex gap-2 flex-wrap">
              <button @click="rotate(-90)" class="btn-secondary text-sm">↶ {{ t('image-editor-left') }}</button>
              <button @click="rotate(90)" class="btn-secondary text-sm">↷ {{ t('image-editor-right') }}</button>
              <button @click="flipX" class="btn-secondary text-sm">↔ {{ t('image-editor-flip-h') }}</button>
              <button @click="flipY" class="btn-secondary text-sm">↕ {{ t('image-editor-flip-v') }}</button>
            </div>
          </div>
          <div class="card">
            <p class="font-medium mb-3">☀️ {{ t('image-editor-adjust') }}</p>
            <div class="space-y-2">
              <label class="flex items-center gap-2"><span class="text-xs w-16">{{ t('image-editor-brightness') }}</span><input type="range" v-model.number="brightness" min="-100" max="100" class="flex-1" @input="render"><span class="text-xs w-12">{{ brightness }}</span></label>
              <label class="flex items-center gap-2"><span class="text-xs w-16">{{ t('image-editor-contrast') }}</span><input type="range" v-model.number="contrast" min="-100" max="100" class="flex-1" @input="render"><span class="text-xs w-12">{{ contrast }}</span></label>
              <label class="flex items-center gap-2"><span class="text-xs w-16">{{ t('image-editor-saturation') }}</span><input type="range" v-model.number="saturate" min="0" max="200" class="flex-1" @input="render"><span class="text-xs w-12">{{ saturate }}%</span></label>
              <label class="flex items-center gap-2"><span class="text-xs w-16">{{ t('image-editor-blur') }}</span><input type="range" v-model.number="blur" min="0" max="10" class="flex-1" @input="render"><span class="text-xs w-12">{{ blur }}px</span></label>
            </div>
          </div>
          <div class="card">
            <p class="font-medium mb-3">🎨 {{ t('image-editor-filters') }}</p>
            <div class="flex gap-2 flex-wrap">
              <button v-for="f in filters" :key="f" @click="filter=f" :class="['text-sm',filter===f?'btn-primary':'btn-secondary']">{{ f }}</button>
            </div>
          </div>
        </div>
        <div class="flex gap-3">
          <button @click="reset" class="btn-secondary flex-1">↺ {{ t('reset') }}</button>
          <button @click="download" class="btn-primary flex-1">💾 {{ t('download') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import{ref,onMounted}from'vue';import{t}from'../../i18n'
const img=ref(null);const canvas=ref(null);const ctx=ref(null)
const cropping=ref(false);const cropRect=ref({x:0,y:0,w:0,h:0});const startPos=ref(null)
const brightness=ref(0);const contrast=ref(0);const saturate=ref(100);const blur=ref(0)
const filter=ref('none');const filters=['none','grayscale','sepia','invert','blur(2px)','brightness(1.5)']
let rotation=0;let scaleX=1;let scaleY=1
function loadImage(e){const file=e.target.files[0];if(!file)return
  const url=URL.createObjectURL(file);img.value=new Image();img.value.src=url
  img.value.onload=()=>{onMounted(()=>{initCanvas()});rotation=0;scaleX=1;scaleY=1;resetFilters();cropping.value=false}}
function initCanvas(){const cv=canvas.value;ctx.value=cv.getContext('2d')
  const maxW=800,maxH=500;let {width,height}=img.value
  if(width>maxW||height>maxH){const ratio=Math.min(maxW/width,maxH/height);width*=ratio;height*=ratio}
  cv.width=width;cv.height=height;render()}
function render(){if(!ctx.value||!img.value)return
  const cv=canvas.value;const c=ctx.value
  c.save();c.clearRect(0,0,cv.width,cv.height)
  c.translate(cv.width/2,cv.height/2);c.rotate(rotation*Math.PI/180);c.scale(scaleX,scaleY)
  c.filter=`brightness(${100+brightness.value}%) contrast(${100+contrast.value}%) saturate(${saturate.value}%) blur(${blur.value}px) ${filter.value!=='none'?filter.value:''}`
  c.drawImage(img.value,-img.value.width/2,-img.value.height/2)
  if(cropping.value){c.restore();c.strokeStyle='#3b82f6';c.lineWidth=2;c.setLineDash([5,5]);c.strokeRect(cropRect.value.x,cropRect.value.y,cropRect.value.w,cropRect.value.h);c.setLineDash([])}else c.restore()}
function setCrop(w,h){cropping.value=true;const cv=canvas.value
  const size=Math.min(cv.width,cv.height)*0.8;cropRect.value={x:(cv.width-size)/2,y:(cv.height-size)/2,w:size*h/w,h:size}}
function applyCrop(){const c=ctx.value;const cr=cropRect.value
  const data=c.getImageData(cr.x,cr.y,cr.w,cr.h);img.value=new Image()
  const temp=document.createElement('canvas');temp.width=cr.w;temp.height=cr.h;temp.getContext('2d').putImageData(data,0,0)
  img.value.src=temp.toDataURL();img.value.onload=()=>{rotation=0;scaleX=1;scaleY=1;cropping.value=false;initCanvas()}}
function cancelCrop(){cropping.value=false}
function rotate(deg){rotation=(rotation+deg)%360;render()}
function flipX(){scaleX*=-1;render()}
function flipY(){scaleY*=-1;render()}
function resetFilters(){brightness.value=0;contrast.value=0;saturate.value=100;blur.value=0;filter.value='none';render()}
function reset(){rotation=0;scaleX=1;scaleY=1;resetFilters();cropping.value=false}
function download(){const a=document.createElement('a');a.href=canvas.value.toDataURL('image/png');a.download='edited.png';a.click()}
</script>
