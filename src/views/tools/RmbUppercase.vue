<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('rmb-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('rmb-desc') }}</p>
    <div class="card space-y-4">
      <div class="flex gap-3 items-center">
        <span class="text-lg" style="color:var(--text-secondary)">¥</span>
        <input v-model="input" type="number" class="tool-input flex-1 text-lg" :placeholder="t('rmb-placeholder')" step="0.01">
      </div>
      <button @click="convert" class="btn-primary w-full">{{ t('convert') }}</button>
      <div v-if="result" class="p-4 rounded-lg text-center">
        <p class="text-xl font-bold" style="color:var(--primary)">{{ result }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import{ref}from'vue'
import{t}from'../../i18n'
const input=ref('');const result=ref('')
const cnNums=['零','壹','贰','叁','肆','伍','陆','柒','捌','玖']
const cnIntRadice=['','拾','佰','仟']
const cnIntUnits=['','万','亿','兆']
const cnDecUnits=['角','分']
const cnInteger='整'
function convert(){
  const num=parseFloat(input.value);if(isNaN(num)){result.value=t('rmb-invalid');return}
  if(num===0){result.value=t('rmb-zero');return}
  let s=''
  const intNum=Math.floor(Math.abs(num));const decNum=Math.round((Math.abs(num)-intNum)*100)
  if(intNum>0){s+=toChinese(intNum)+t('rmb-yuan')}
  if(decNum===0){s+=cnInteger}else{
    const jiao=Math.floor(decNum/10);const fen=decNum%10
    if(jiao>0)s+=cnNums[jiao]+t('rmb-jiao')
    if(fen>0)s+=cnNums[fen]+t('rmb-fen')
  }
  result.value=(num<0?t('rmb-negative'):'')+s
}
function toChinese(n){
  let s='';let m='';let p=0
  const str=String(n);const len=str.length
  for(let i=0;i<len;i++){
    const num=parseInt(str[i])
    const p2=(len-i-1)%4
    if(num===0){if(p2!==0)m=t('rmb-zero-digit');else m='';continue}
    m=cnNums[num]+cnIntRadice[p2]
    if(p2===0){s+=m+cnIntUnits[(len-i-1)/4];m=''}else s+=m
  }
  return s.replace(/零+/g,t('rmb-zero-digit')).replace(/零+$/,'')
}
</script>
