<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">⏳ {{ t('countdown-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('countdown-desc') }}</p>
    <div class="card space-y-4 text-center">
      <div v-if="!running" class="space-y-4">
        <div class="flex gap-4 justify-center">
          <div><label class="text-sm block mb-1" style="color:var(--text-secondary)">{{ t('countdown-hour') }}</label><input v-model.number="hh" type="number" min="0" max="23" class="tool-input w-20 text-center text-2xl font-mono"></div>
          <div><label class="text-sm block mb-1" style="color:var(--text-secondary)">{{ t('countdown-min') }}</label><input v-model.number="mm" type="number" min="0" max="59" class="tool-input w-20 text-center text-2xl font-mono"></div>
          <div><label class="text-sm block mb-1" style="color:var(--text-secondary)">{{ t('countdown-sec') }}</label><input v-model.number="ss" type="number" min="0" max="59" class="tool-input w-20 text-center text-2xl font-mono"></div>
        </div>
        <div class="flex gap-3 justify-center flex-wrap">
          <button @click="preset(60)" class="btn-secondary text-sm">1{{ t('countdown-minute') }}</button>
          <button @click="preset(300)" class="btn-secondary text-sm">5{{ t('countdown-minute') }}</button>
          <button @click="preset(600)" class="btn-secondary text-sm">10{{ t('countdown-minute') }}</button>
          <button @click="preset(1800)" class="btn-secondary text-sm">30{{ t('countdown-minute') }}</button>
        </div>
        <button @click="start" class="btn-primary w-full py-3 text-lg">▶ {{ t('countdown-start') }}</button>
      </div>
      <div v-else class="space-y-4">
        <p class="text-6xl font-mono font-bold" style="color:var(--primary)">{{ display }}</p>
        <div class="flex gap-3 justify-center">
          <button @click="togglePause" class="btn-secondary">{{ paused?t('countdown-resume'):t('countdown-pause') }}</button>
          <button @click="stop" class="btn-secondary">{{ t('countdown-stop') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import{ref,computed,onUnmounted}from'vue';import{t}from'../../i18n'
const hh=ref(0);const mm=ref(5);const ss=ref(0);const running=ref(false);const paused=ref(false);const remaining=ref(0)
let timer=null
const display=computed(()=>{const h=Math.floor(remaining.value/3600);const m=Math.floor((remaining.value%3600)/60);const s=remaining.value%60;return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')})
function preset(total){hh.value=0;mm.value=Math.floor(total/60);ss.value=total%60}
function start(){remaining.value=hh.value*3600+mm.value*60+ss.value;if(remaining.value<=0)return;running.value=true;paused.value=false;tick()}
function tick(){timer=setInterval(()=>{if(!paused.value){remaining.value--;if(remaining.value<=0){stop();alert(t('countdown-timeup'))}}},1000)}
function togglePause(){paused.value=!paused.value}
function stop(){clearInterval(timer);running.value=false;paused.value=false;remaining.value=0}
onUnmounted(()=>clearInterval(timer))
</script>
