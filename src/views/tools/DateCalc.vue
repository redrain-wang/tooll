<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('date-calc-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('date-calc-desc') }}</p>
    <div class="card space-y-4">
      <div class="grid md:grid-cols-2 gap-4">
        <div><label class="text-sm block mb-1" style="color:var(--text-secondary)">{{ t('date-calc-start') }}</label><input v-model="d1" type="date" class="tool-input"></div>
        <div><label class="text-sm block mb-1" style="color:var(--text-secondary)">{{ t('date-calc-end') }}</label><input v-model="d2" type="date" class="tool-input"></div>
      </div>
      <div class="flex gap-3">
        <button @click="calc" class="btn-primary">{{ t('date-calc-btn') }}</button>
        <button @click="addDays" class="btn-secondary">{{ t('date-calc-plus-days') }}</button>
      </div>
      <input v-model.number="days" type="number" class="tool-input w-32" :placeholder="t('date-calc-days')">
      <div v-if="result" class="p-4 rounded-lg" style="background:var(--bg)">
        <div class="space-y-2 text-sm">
          <p><strong>{{ t('date-calc-diff-days') }}:</strong> <span style="color:var(--primary)">{{ result.diff }}</span></p>
          <p><strong>{{ t('date-calc-diff-weeks') }}:</strong> {{ result.weeks }}</p>
          <p><strong>{{ t('date-calc-add-days') }}:</strong> {{ result.added }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import{ref}from'vue';import{t}from'../../i18n'
const d1=ref(new Date().toISOString().slice(0,10));const d2=ref('');const days=ref(7);const result=ref(null)
function calc(){
  const a=new Date(d1.value),b=new Date(d2.value)
  const diff=Math.ceil((b-a)/(1000*60*60*24))
  const added=new Date(a);added.setDate(added.getDate()+days.value)
  result.value={diff,days:diff,weeks:(diff/7).toFixed(1),added:added.toISOString().slice(0,10)}
}
function addDays(){
  const a=new Date(d1.value);a.setDate(a.getDate()+days.value)
  d2.value=a.toISOString().slice(0,10);calc()
}
calc()
</script>
