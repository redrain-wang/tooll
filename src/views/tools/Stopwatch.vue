<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('stopwatch-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('stopwatch-desc') }}</p>
    <div class="card space-y-4 text-center">
      <p class="text-6xl font-mono font-bold" style="color:var(--primary)">{{ display }}</p>
      <div class="flex gap-3 justify-center">
        <button v-if="!running" @click="start" class="btn-primary px-8">▶ {{ t('stopwatch-start') }}</button>
        <button v-else @click="lap" class="btn-primary">{{ t('stopwatch-lap') }}</button>
        <button v-if="running" @click="pause" class="btn-secondary">{{ t('stopwatch-pause') }}</button>
        <button v-if="!running && elapsed>0" @click="resume" class="btn-primary">{{ t('stopwatch-resume') }}</button>
        <button v-if="elapsed>0" @click="reset" class="btn-secondary">{{ t('stopwatch-reset') }}</button>
      </div>
      <div v-if="laps.length" class="max-h-64 overflow-auto text-left">
        <div v-for="(l,i) in laps" :key="i" class="flex items-center gap-3 py-2 text-sm" style="border-bottom:1px solid var(--border)">
          <span style="color:var(--text-secondary)">#{{ i+1 }}</span>
          <span class="font-mono" style="color:var(--text)">{{ l }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import{ref,computed,onUnmounted}from'vue';import{t}from'../../i18n'
const running=ref(false);const elapsed=ref(0);const laps=ref([]);let timer=null;let startTime=0;let savedTime=0
const display=computed(()=>{const ms=elapsed.value;const m=Math.floor(ms/60000);const s=Math.floor((ms%60000)/1000);const cs=Math.floor((ms%1000)/10);return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')+'.'+String(cs).padStart(2,'0')})
function start(){running.value=true;startTime=Date.now();timer=setInterval(()=>{elapsed.value=savedTime+(Date.now()-startTime)},10)}
function pause(){running.value=false;savedTime=elapsed.value;clearInterval(timer)}
function resume(){start()}
function lap(){laps.value.unshift(display.value)}
function reset(){running.value=false;clearInterval(timer);elapsed.value=0;savedTime=0;laps.value=[]}
onUnmounted(()=>clearInterval(timer))
</script>
