<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('text-stats') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('text-stats-desc') }}</p>
    <div class="space-y-4">
      <textarea v-model="text" class="tool-input h-40 font-mono text-sm" :placeholder="t('text-stats-placeholder')"></textarea>
      <button @click="analyze" class="btn-primary">{{ t('text-stats-analyze') }}</button>
      <div v-if="result" class="space-y-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div class="card text-center"><p class="text-xl font-bold" style="color:var(--primary)">{{ result.chars }}</p><p class="text-xs" style="color:var(--text-secondary)">{{ t('text-stats-total') }}</p></div>
          <div class="card text-center"><p class="text-xl font-bold" style="color:var(--primary)">{{ result.words }}</p><p class="text-xs" style="color:var(--text-secondary)">{{ t('text-stats-words') }}</p></div>
          <div class="card text-center"><p class="text-xl font-bold" style="color:var(--primary)">{{ result.lines }}</p><p class="text-xs" style="color:var(--text-secondary)">{{ t('lines') }}</p></div>
          <div class="card text-center"><p class="text-xl font-bold" style="color:var(--primary)">{{ result.sentences }}</p><p class="text-xs" style="color:var(--text-secondary)">{{ t('text-stats-sentences') }}</p></div>
        </div>
        <div class="card"><h3 class="font-semibold mb-3">{{ t('text-stats-freq') }}</h3>
          <div class="flex flex-wrap gap-1.5">
            <div v-for="(count,char) in result.freq" :key="char" class="px-2 py-1 rounded text-xs font-mono" :style="{background:'var(--bg)',color:'var(--text)',opacity:Math.min(1,count/result.maxFreq*2)}" :title="char+': '+count+t('text-stats-times')">{{ char }}({{ count }})</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import{ref}from'vue'
import{t}from'../../i18n'
const text=ref('');const result=ref(null)
function analyze(){
  const txt=text.value;const freq={}
  for(const c of txt){freq[c]=(freq[c]||0)+1}
  const maxFreq=Math.max(...Object.values(freq))
  result.value={chars:txt.length,words:txt.trim()?txt.trim().split(/\s+/).length:0,lines:txt?txt.split(/\r?\n/).length:0,sentences:(txt.match(/[.!?。！？]+/g)||[]).length,freq,maxFreq}
}
</script>
