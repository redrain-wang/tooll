<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('json-to-sql') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('json-to-sql-desc') }}</p>
    <div class="space-y-4">
      <textarea v-model="input" class="tool-input h-64 font-mono text-sm" placeholder='[{"name":"John","age":30}]'></textarea>
      <div class="flex gap-2 items-center flex-wrap">
        <input v-model="table" class="tool-input" style="width:auto;min-width:120px" placeholder="table_name">
        <label class="flex items-center gap-1 text-sm" style="color:var(--text-secondary)">
          <input type="checkbox" v-model="createTable"> CREATE TABLE
        </label>
      </div>
      <div class="flex gap-3 flex-wrap">
        <button @click="convert" class="btn-primary">✨ {{ t('generate') }}</button>
        <button @click="copy" class="btn-secondary">📋 {{ t('copy') }}</button>
      </div>
      <textarea v-model="output" class="tool-input h-64 font-mono text-sm" readonly style="background:var(--card-bg)" :placeholder="t('output')"></textarea>
    </div>
  </div>
</template>
<script setup>
import{ref}from'vue';import{t}from'../../i18n'
const input=ref('');const output=ref('');const table=ref('my_table');const createTable=ref(false)
function escapeSql(v){if(v===null||v===undefined)return'NULL';if(typeof v==='number')return v;if(typeof v==='boolean')return v?'TRUE':'FALSE';return"'"+String(v).replace(/'/g,"''")+"'"}
function inferCol(v){if(typeof v==='number')return Number.isInteger(v)?'INTEGER':'REAL';if(typeof v==='boolean')return'BOOLEAN';if(typeof v==='object')return'TEXT';return'TEXT'}
function convert(){
  try{
    const arr=JSON.parse(input.value)
    const rows=Array.isArray(arr)?arr:[arr]
    if(!rows.length){output.value='-- Empty array';return}
    const keys=Object.keys(rows[0])
    let sql=''
    if(createTable.value){
      const cols=keys.map(k=>`  "${k}" ${inferCol(rows[0][k])}`).join(',\n')
      sql+=`CREATE TABLE "${table.value}" (\n${cols}\n);\n\n`
    }
    const values=rows.map(r=>`(${keys.map(k=>escapeSql(r[k])).join(', ')})`).join(',\n')
    sql+=`INSERT INTO "${table.value}" (${keys.map(k=>'"'+k+'"').join(', ')})\nVALUES\n${values};`
    output.value=sql
  }catch(e){output.value='-- '+e.message}
}
function copy(){navigator.clipboard.writeText(output.value);window.showToast?.(t('copied'))}
</script>
