<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('random-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('random-desc') }}</p>
    <div class="card space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div><label class="text-sm block mb-1" style="color:var(--text-secondary)">{{ t('random-min') }}</label><input v-model.number="min" type="number" class="tool-input"></div>
        <div><label class="text-sm block mb-1" style="color:var(--text-secondary)">{{ t('random-max') }}</label><input v-model.number="max" type="number" class="tool-input"></div>
      </div>
      <div><label class="text-sm block mb-1" style="color:var(--text-secondary)">{{ t('random-quantity') }}</label><input v-model.number="count" type="number" min="1" max="100" class="tool-input w-32"></div>
      <label class="flex items-center gap-2 text-sm"><input type="checkbox" v-model="unique" class="rounded"> {{ t('random-no-dup') }}</label>
      <button @click="generate" class="btn-primary w-full">🎲 {{ t('random-gen') }}</button>
      <div v-if="results.length" class="p-4 rounded-lg" style="background:var(--bg)">
        <div class="flex flex-wrap gap-2">
          <span v-for="(n,i) in results" :key="i" class="px-3 py-1.5 rounded-lg font-mono text-sm cursor-pointer hover:opacity-80" style="background:var(--card-bg);color:var(--primary);border:1px solid var(--border)" @click="copyOne(n)">{{ n }}</span>
        </div>
        <button @click="copyAll" class="btn-secondary w-full mt-3">📋 {{ t('copy-all') }}</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import{ref}from'vue'
import{t}from'../../i18n'
const min=ref(1);const max=ref(100);const count=ref(10);const unique=ref(false);const results=ref([])
function generate(){
  const s=new Set();results.value=[]
  while(results.value.length<count.value){
    const n=Math.floor(Math.random()*(max.value-min.value+1))+min.value
    if(unique.value&&s.has(n))continue;s.add(n);results.value.push(n)
  }
  window.showToast?.('OK')
}
function copyOne(n){navigator.clipboard.writeText(String(n));window.showToast?.(t('copied'))}
function copyAll(){navigator.clipboard.writeText(results.value.join('\n'));window.showToast?.(t('copied'))}
</script>
