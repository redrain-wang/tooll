<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">📊 {{ t('table-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('table-desc') }}</p>
    <div class="space-y-4">
      <div class="flex gap-3 flex-wrap">
        <button @click="addCol" class="btn-secondary text-sm">+ {{ t('table-col') }}</button>
        <button @click="addRow" class="btn-secondary text-sm">+ {{ t('table-row') }}</button>
        <select v-model="format" class="tool-input w-32 text-sm">
          <option value="md">Markdown</option>
          <option value="html">HTML</option>
          <option value="csv">CSV</option>
        </select>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <tr>
            <th v-for="(col,j) in cols" :key="'h'+j" class="p-1">
              <input v-model="cols[j]" class="tool-input text-sm text-center font-bold" :placeholder="t('table-col-name')">
            </th>
            <th class="w-10"></th>
          </tr>
          <tr v-for="(row,i) in rows" :key="'r'+i">
            <td v-for="(col,j) in cols" :key="'c'+j" class="p-1">
              <input v-model="rows[i][j]" class="tool-input text-sm text-center" placeholder="-">
            </td>
            <td><button @click="rows.splice(i,1)" class="text-sm" style="color:var(--text-secondary)">✕</button></td>
          </tr>
        </table>
      </div>
      
      <button @click="generate" class="btn-primary w-full">📊 {{ t('table-generate') }}</button>
      
      <div v-if="output" class="space-y-2">
        <div class="relative">
          <pre class="card font-mono text-xs p-4 overflow-auto max-h-64 whitespace-pre-wrap" style="color:var(--text)">{{ output }}</pre>
          <button @click="copy" class="absolute top-2 right-2 btn-secondary text-xs">📋</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import{ref}from'vue';import{t}from'../../i18n'
const cols=ref(['Name','Age','City']);const rows=ref([['Alice','25','Beijing'],['Bob','30','Shanghai']])
const format=ref('md');const output=ref('')

function addCol(){cols.value.push('Col '+(cols.value.length+1));rows.value.forEach(r=>r.push(''))}
function addRow(){rows.value.push(cols.value.map(()=>''))}

function generate(){
  if(format.value==='md'){
    output.value='| '+cols.value.join(' | ')+' |\n| '+cols.value.map(()=>'---').join(' | ')+' |\n'+rows.value.map(r=>'| '+r.join(' | ')+' |').join('\n')
  }else if(format.value==='csv'){
    output.value=[cols.value.join(','),...rows.value.map(r=>r.join(','))].join('\n')
  }else{
    output.value='<table>\n<thead><tr>'+cols.value.map(c=>'<th>'+c+'</th>').join('')+'</tr></thead>\n<tbody>\n'+rows.value.map(r=>'<tr>'+r.map(c=>'<td>'+c+'</td>').join('')+'</tr>').join('\n')+'</tbody>\n</table>'
  }
  window.showToast?.('OK')
}
function copy(){navigator.clipboard.writeText(output.value);window.showToast?.(t('copied'))}
</script>
