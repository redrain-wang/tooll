<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('morse-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('morse-desc') }}</p>
    <div class="space-y-4">
      <textarea v-model="input" class="tool-input h-32 font-mono text-sm" :placeholder="t('morse-placeholder')"></textarea>
      <div class="flex gap-3">
        <button @click="toMorse" class="btn-primary">{{ t('morse-to-morse') }}</button>
        <button @click="fromMorse" class="btn-primary">{{ t('morse-to-text') }}</button>
        <button @click="copy" class="btn-secondary">📋 {{ t('copy') }}</button>
      </div>
      <textarea v-model="output" class="tool-input h-32 font-mono text-sm" readonly style="background:var(--card-bg)"></textarea>
    </div>
  </div>
</template>
<script setup>
import{ref}from'vue';import{t}from'../../i18n'
const input=ref('');const output=ref('')
const map={A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..','0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.'}
const rev=Object.fromEntries(Object.entries(map).map(([k,v])=>[v,k]))
function toMorse(){output.value=input.value.toUpperCase().split('').map(c=>c===' '?'/':map[c]||c).join(' ')}
function fromMorse(){output.value=input.value.split(' ').map(c=>c==='/'?' ':rev[c]||c).join('')}
function copy(){navigator.clipboard.writeText(output.value);window.showToast?.(t('copied'))}
</script>
