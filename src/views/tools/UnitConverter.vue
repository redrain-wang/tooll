<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('unit-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('unit-desc') }}</p>
    <div class="space-y-4">
      <select v-model="category" class="tool-input w-48">
        <option value="length">{{ t('unit-length') }}</option>
        <option value="weight">{{ t('unit-weight') }}</option>
        <option value="temperature">{{ t('unit-temperature') }}</option>
        <option value="data">{{ t('unit-data') }}</option>
        <option value="area">{{ t('unit-area') }}</option>
      </select>
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="text-sm block mb-1" style="color:var(--text-secondary)">{{ t('unit-from') }}</label>
          <input v-model.number="fromVal" class="tool-input" @input="convert('from')">
          <select v-model="fromUnit" class="tool-input mt-2" @input="convert('from')">
            <option v-for="u in units[category]" :key="u.key" :value="u.key">{{ u.i18nKey?t(u.i18nKey):u.name }}</option>
          </select>
        </div>
        <div>
          <label class="text-sm block mb-1" style="color:var(--text-secondary)">{{ t('unit-to') }}</label>
          <input v-model.number="toVal" class="tool-input" @input="convert('to')">
          <select v-model="toUnit" class="tool-input mt-2" @input="convert('from')">
            <option v-for="u in units[category]" :key="u.key" :value="u.key">{{ u.i18nKey?t(u.i18nKey):u.name }}</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import{ref,watch}from'vue'
import{t}from'../../i18n'
const category=ref('length');const fromVal=ref(1);const toVal=ref(0);const fromUnit=ref('m');const toUnit=ref('km')
const units={
  length:[{key:'mm',i18nKey:'unit-mm',rate:0.001},{key:'cm',i18nKey:'unit-cm',rate:0.01},{key:'m',i18nKey:'unit-m',rate:1},{key:'km',i18nKey:'unit-km',rate:1000},{key:'in',i18nKey:'unit-inch',rate:0.0254},{key:'ft',i18nKey:'unit-ft',rate:0.3048},{key:'yd',i18nKey:'unit-yd',rate:0.9144},{key:'mi',i18nKey:'unit-mile',rate:1609.344}],
  weight:[{key:'mg',i18nKey:'unit-mg',rate:0.000001},{key:'g',i18nKey:'unit-g',rate:0.001},{key:'kg',i18nKey:'unit-kg',rate:1},{key:'t',i18nKey:'unit-ton',rate:1000},{key:'oz',i18nKey:'unit-oz',rate:0.0283495},{key:'lb',i18nKey:'unit-lb',rate:0.453592}],
  temperature:[{key:'c',i18nKey:'unit-celsius'},{key:'f',i18nKey:'unit-fahrenheit'},{key:'k',i18nKey:'unit-kelvin'}],
  data:[{key:'b',i18nKey:'unit-byte',rate:1},{key:'kb',name:'KB',rate:1024},{key:'mb',name:'MB',rate:1048576},{key:'gb',name:'GB',rate:1073741824},{key:'tb',name:'TB',rate:1099511627776}],
  area:[{key:'mm2',i18nKey:'unit-sqmm',rate:0.000001},{key:'cm2',i18nKey:'unit-sqcm',rate:0.0001},{key:'m2',i18nKey:'unit-sqm',rate:1},{key:'km2',i18nKey:'unit-sqkm',rate:1000000},{key:'ha',i18nKey:'unit-hectare',rate:10000},{key:'acre',i18nKey:'unit-acre',rate:4046.86}],
}
function convert(dir){
  if(category.value==='temperature'){
    let celsius
    if(fromUnit.value==='c')celsius=fromVal.value
    else if(fromUnit.value==='f')celsius=(fromVal.value-32)*5/9
    else celsius=fromVal.value-273.15
    if(toUnit.value==='c')toVal.value=celsius
    else if(toUnit.value==='f')toVal.value=celsius*9/5+32
    else toVal.value=celsius+273.15
  }else{
    const u=units[category.value]
    const base=fromVal.value*u.find(x=>x.key===fromUnit.value).rate
    toVal.value=+(base/u.find(x=>x.key===toUnit.value).rate).toPrecision(6)
  }
}
watch(category,()=>{fromUnit.value=units[category.value][0].key;toUnit.value=units[category.value][2]?.key||units[category.value][1].key;fromVal.value=1;convert('from')})
</script>
