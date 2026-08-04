<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🌐 {{ t('speed-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('speed-desc') }}</p>
    <div class="card text-center space-y-6">
      <div v-if="!testing&&!result">
        <button @click="startTest" class="btn-primary px-10 py-4 text-lg">🚀 {{ t('speed-start') }}</button>
      </div>
      <div v-if="testing" class="space-y-4">
        <div class="text-6xl font-bold" style="color:var(--primary)">{{ currentSpeed }}</div>
        <p style="color:var(--text-secondary)">{{ t('speed-testing') }}</p>
        <div class="w-full h-2 rounded-full" style="background:var(--bg)">
          <div class="h-full rounded-full transition-all" style="background:var(--primary)" :style="{width:progress+'%'}"></div>
        </div>
      </div>
      <div v-if="result" class="space-y-4">
        <div class="text-6xl font-bold" style="color:var(--primary)">{{ result.speed }} Mbps</div>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div class="p-3 rounded-lg" style="background:var(--bg)">
            <p style="color:var(--text-secondary)">{{ t('speed-size') }}</p>
            <p class="font-bold" style="color:var(--text)">{{ result.size }}</p>
          </div>
          <div class="p-3 rounded-lg" style="background:var(--bg)">
            <p style="color:var(--text-secondary)">{{ t('speed-time') }}</p>
            <p class="font-bold" style="color:var(--text)">{{ result.time }}</p>
          </div>
        </div>
        <div class="p-3 rounded-lg text-left text-xs" style="background:var(--bg);color:var(--text-secondary)">
          <p>💡 {{ t('speed-note') }}</p>
        </div>
        <button @click="startTest" class="btn-secondary w-full">🔄 {{ t('speed-retest') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import{ref}from'vue';import{t}from'../../i18n'
const testing=ref(false);const result=ref(null);const currentSpeed=ref('0.00');const progress=ref(0)

async function startTest(){
  testing.value=true;result.value=null;progress.value=0
  const testSize=5*1024*1024 // 5MB
  const urls=['https://speed.cloudflare.com/__down?bytes='+testSize]
  
  try{
    const start=Date.now()
    const resp=await fetch(urls[0]+'?'+Date.now())
    const reader=resp.body.getReader()
    let received=0
    
    while(true){
      const{done,value}=await reader.read()
      if(done)break
      received+=value.length
      progress.value=Math.min(99,received/testSize*100)
      const elapsed=(Date.now()-start)/1000
      const speed=(received*8/elapsed/1000000).toFixed(2)
      currentSpeed.value=speed
    }
    
    const elapsed=(Date.now()-start)/1000
    const speedMbps=(received*8/elapsed/1000000).toFixed(2)
    result.value={speed:speedMbps,size:(received/1048576).toFixed(1)+'MB',time:elapsed.toFixed(1)+t('speed-seconds')}
    progress.value=100
  }catch(e){currentSpeed.value=t('speed-error')}
  testing.value=false
}
</script>
