<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('image-info-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('image-info-desc') }}</p>
    <div class="space-y-4">
      <div class="card text-center" @click="$refs.fileInput.click()" style="cursor:pointer">
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFile">
        <p style="color:var(--text-secondary)">📷 {{ t('image-info-select') }}</p>
      </div>
      <div v-if="info" class="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div v-for="item in info" :key="item.label" class="card text-center">
          <p class="text-lg font-mono font-bold" style="color:var(--primary)">{{ item.value }}</p>
          <p class="text-xs mt-1" style="color:var(--text-secondary)">{{ item.label }}</p>
        </div>
      </div>
      <img v-if="preview" :src="preview" class="max-h-64 mx-auto rounded-lg">
    </div>
  </div>
</template>
<script setup>
import{ref}from'vue';import{t}from'../../i18n'
const info=ref(null);const preview=ref('')
function handleFile(e){
  const file=e.target.files[0];if(!file)return
  preview.value=URL.createObjectURL(file)
  const img=new Image();img.src=preview.value
  img.onload=()=>{
    const ext=file.name.split('.').pop().toUpperCase()
    info.value=[
      {label:t('image-info-filename'),value:file.name},{label:t('image-info-format'),value:ext},
      {label:t('image-info-size'),value:(file.size/1024).toFixed(1)+'KB'},{label:t('image-info-width'),value:img.width+'px'},
      {label:t('image-info-height'),value:img.height+'px'},{label:t('image-info-ratio'),value:(img.width/img.height).toFixed(2)},
    ]
  }
}
</script>
