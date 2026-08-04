<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('sql-formatter') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('sql-formatter-desc') }}</p>
    <div class="space-y-4">
      <textarea v-model="input" class="tool-input h-64 font-mono text-sm" :placeholder="t('sql-formatter-placeholder')"></textarea>
      <div class="flex gap-3 flex-wrap">
        <button @click="format(2)" class="btn-primary">✨ {{ t('format') }}</button>
        <button @click="format(0)" class="btn-secondary">📦 {{ t('compress') }}</button>
        <button @click="copy" class="btn-secondary">📋 {{ t('copy') }}</button>
      </div>
      <textarea v-model="output" class="tool-input h-64 font-mono text-sm" readonly style="background:var(--card-bg)" :placeholder="t('output')"></textarea>
    </div>
  </div>
</template>
<script setup>
import{ref}from'vue';import{t}from'../../i18n'
const input=ref('');const output=ref('')
const keywords=['SELECT','FROM','WHERE','AND','OR','ORDER BY','GROUP BY','HAVING','LIMIT','OFFSET','INSERT INTO','VALUES','UPDATE','SET','DELETE FROM','CREATE TABLE','ALTER TABLE','DROP TABLE','JOIN','LEFT JOIN','RIGHT JOIN','INNER JOIN','OUTER JOIN','ON','AS','IN','NOT','NULL','IS','LIKE','BETWEEN','EXISTS','COUNT','SUM','AVG','MIN','MAX','DISTINCT','UNION','ALL','CASE','WHEN','THEN','ELSE','END']
function format(indent){
  let sql=input.value.trim()
  if(!sql){output.value='';return}
  if(indent===0){output.value=sql.replace(/\s+/g,' ').replace(/\s*([(),])\s*/g,'$1').trim();return}
  keywords.forEach(kw=>{
    const re=new RegExp('\\b'+kw.replace(/ /g,'\\s+')+'\\b','gi')
    sql=sql.replace(re,'\n'+kw)
  })
  sql=sql.replace(/,/g,',\n  ').replace(/^\n/,'').replace(/\n{3,}/g,'\n\n')
  output.value=sql.split('\n').map(l=>l.trim()).filter(Boolean).join('\n')
}
function copy(){navigator.clipboard.writeText(output.value);window.showToast?.(t('copied'))}
</script>
