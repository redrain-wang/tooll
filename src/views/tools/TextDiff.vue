<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('text-diff') }}</h1>
    <p class="mb-6" style="color: var(--text-secondary);">{{ t('text-diff-desc') }}</p>
    <div class="grid md:grid-cols-2 gap-4 mb-4">
      <div><p class="text-sm font-medium mb-2" style="color:var(--text-secondary)">{{ t('original-text') }}</p>
        <textarea v-model="text1" class="tool-input font-mono text-sm" style="min-height:200px" placeholder=""></textarea></div>
      <div><p class="text-sm font-medium mb-2" style="color:var(--text-secondary)">{{ t('modified-text') }}</p>
        <textarea v-model="text2" class="tool-input font-mono text-sm" style="min-height:200px" placeholder=""></textarea></div>
    </div>
    <button @click="compare" class="btn-primary mb-4">{{ t('compare-diff') }}</button>
    <div v-if="diffResult.length" class="card">
      <p class="text-sm font-medium mb-3">{{ t('diff-result') }}</p>
      <div class="font-mono text-sm whitespace-pre-wrap">
        <div v-for="(line,i) in diffResult" :key="i" :class="['px-3 py-1 -mx-3',line.type==='added'?'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300':line.type==='removed'?'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300':'']">
          <span class="inline-block w-6 text-center">{{ line.type==='added'?'+':line.type==='removed'?'-':' ' }}</span>{{ line.text }}
        </div>
      </div>
      <div class="mt-4 flex gap-4 text-sm" style="color:var(--text-secondary)">
        <span>➕ {{ t('added') }}: {{ stats.added }}</span>
        <span>➖ {{ t('removed') }}: {{ stats.removed }}</span>
        <span>unchanged: {{ stats.same }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { t } from '../../i18n'
const text1 = ref(''); const text2 = ref(''); const diffResult = ref([]); const stats = ref({added:0,removed:0,same:0})
function compare() {
  const l1=text1.value.split(/\r?\n/), l2=text2.value.split(/\r?\n/), r=[]; let a=0,rm=0,s=0
  for(let i=0;i<Math.max(l1.length,l2.length);i++){
    if(l1[i]===undefined){r.push({text:l2[i],type:'added'});a++}
    else if(l2[i]===undefined){r.push({text:l1[i],type:'removed'});rm++}
    else if(l1[i]===l2[i]){r.push({text:l1[i],type:'same'});s++}
    else{r.push({text:l1[i],type:'removed'});r.push({text:l2[i],type:'added'});rm++;a++}
  }
  diffResult.value=r; stats.value={added:a,removed:rm,same:s}
}
</script>
