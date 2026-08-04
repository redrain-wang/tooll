<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🍅 {{ t('pomodoro-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('pomodoro-desc') }}</p>
    <div class="card space-y-6 text-center">
      <div class="flex gap-3 justify-center">
        <button v-for="s in modes" :key="s.key" @click="setMode(s)" :class="['px-4 py-2 rounded-lg text-sm transition-all']" :style="{background:mode===s.key?'var(--primary)':'var(--bg)',color:mode===s.key?'white':'var(--text)'}">{{ s.label }}</button>
      </div>
      <p class="text-7xl font-mono font-bold" style="color:var(--primary)">{{ display }}</p>
      <div class="flex gap-3 justify-center">
        <button v-if="!running" @click="start" class="btn-primary px-10 py-3 text-lg">▶ {{ t('pomodoro-start') }}</button>
        <button v-else @click="pause" class="btn-secondary px-10 py-3 text-lg">⏸ {{ t('pomodoro-pause') }}</button>
        <button @click="resetTimer" class="btn-secondary px-6 py-3">↺ {{ t('pomodoro-reset') }}</button>
      </div>
      <p class="text-sm" style="color:var(--text-secondary)">{{ t('pomodoro-count') }} {{ completed }}</p>
    </div>
  </div>
</template>
<script setup>
import{ref,computed,onUnmounted}from'vue';import{t}from'../../i18n'
const modes=computed(()=>[{key:'work',label:'🍅 '+t('pomodoro-work'),min:25},{key:'short',label:'☕ '+t('pomodoro-short-break'),min:5},{key:'long',label:'🌙 '+t('pomodoro-long-break'),min:15}])
const mode=ref('work');const remaining=ref(25*60);const running=ref(false);const completed=ref(0);let timer=null
const display=computed(()=>{const m=Math.floor(remaining.value/60);const s=remaining.value%60;return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')})
function setMode(m){mode.value=m.key;remaining.value=m.min*60;running.value=false;clearInterval(timer)}
function start(){running.value=true;timer=setInterval(()=>{if(--remaining.value<=0){clearInterval(timer);running.value=false;if(mode.value==='work'){completed.value++;setMode(modes.value[1])}else{setMode(modes.value[0])}}},1000)}
function pause(){running.value=false;clearInterval(timer)}
function resetTimer(){running.value=false;clearInterval(timer);const m=modes.value.find(x=>x.key===mode.value);remaining.value=m?m.min*60:25*60}
onUnmounted(()=>clearInterval(timer))
</script>
