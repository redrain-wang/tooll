<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('text-compare') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('text-compare-desc') }}</p>
    <div class="space-y-4">
      <div class="flex gap-3 items-center flex-wrap">
        <button @click="swap" class="btn-secondary text-sm">🔄 {{ t('text-compare-swap') }}</button>
        <label class="flex items-center gap-2 text-sm"><input type="checkbox" v-model="ignoreSpace" class="rounded"> {{ t('text-compare-ignore-ws') }}</label>
        <label class="flex items-center gap-2 text-sm"><input type="checkbox" v-model="ignoreCase" class="rounded"> {{ t('ignore-case') }}</label>
        <button @click="clearAll" class="btn-secondary text-sm">🗑️ {{ t('text-compare-clear') }}</button>
      </div>
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <p class="text-sm font-medium mb-2" style="color:var(--text-secondary)">📝 {{ t('text-compare-original') }}</p>
          <textarea v-model="text1" class="tool-input font-mono text-sm" style="min-height:250px" :placeholder="t('text-compare-original-ph')"></textarea>
        </div>
        <div>
          <p class="text-sm font-medium mb-2" style="color:var(--text-secondary)">📝 {{ t('text-compare-modified') }}</p>
          <textarea v-model="text2" class="tool-input font-mono text-sm" style="min-height:250px" :placeholder="t('text-compare-modified-ph')"></textarea>
        </div>
      </div>
      <button @click="compare" class="btn-primary w-full py-3">🔍 {{ t('text-compare-btn') }}</button>
      
      <div v-if="result" class="card">
        <div class="flex items-center justify-between mb-4">
          <p class="font-semibold" style="color:var(--text)">{{ t('text-compare-result') }}</p>
          <div class="flex gap-3 text-sm">
            <span class="flex items-center gap-1"><span class="inline-block w-3 h-3 rounded" style="background:#22c55e"></span> {{ t('text-compare-added') }} {{ result.added }}</span>
            <span class="flex items-center gap-1"><span class="inline-block w-3 h-3 rounded" style="background:#ef4444"></span> {{ t('text-compare-deleted') }} {{ result.removed }}</span>
            <span class="flex items-center gap-1"><span class="inline-block w-3 h-3 rounded" style="background:var(--border)"></span> {{ t('text-compare-unchanged') }} {{ result.same }}</span>
          </div>
        </div>
        
        <!-- Unified view -->
        <div class="rounded-lg overflow-hidden border" style="border-color:var(--border)">
          <div class="flex border-b" style="border-color:var(--border)">
            <button @click="view='unified'" :class="['flex-1 py-2 text-sm font-medium border-b-2 transition-colors',view==='unified'?'border-indigo-500':'border-transparent']" :style="{color:view==='unified'?'var(--primary)':'var(--text-secondary)'}">{{ t('text-compare-unified') }}</button>
            <button @click="view='split'" :class="['flex-1 py-2 text-sm font-medium border-b-2 transition-colors',view==='split'?'border-indigo-500':'border-transparent']" :style="{color:view==='split'?'var(--primary)':'var(--text-secondary)'}">{{ t('text-compare-side') }}</button>
          </div>
          
          <!-- Unified -->
          <div v-if="view==='unified'" class="font-mono text-xs max-h-96 overflow-auto">
            <div v-for="(line,i) in result.lines" :key="i" class="flex" :style="{background:line.type==='added'?'#dcfce7':line.type==='removed'?'#fee2e2':'transparent'}">
              <span class="w-8 text-right pr-2 py-0.5 select-none" :style="{color:'var(--text-secondary)',opacity:0.5}">{{ line.lineNum||'' }}</span>
              <span class="w-6 text-center py-0.5 font-bold" :style="{color:line.type==='added'?'#16a34a':line.type==='removed'?'#dc2626':'transparent'}">{{ line.type==='added'?'+':line.type==='removed'?'-':' ' }}</span>
              <span class="flex-1 py-0.5 pr-4 whitespace-pre-wrap break-all" style="color:var(--text)">{{ line.text }}</span>
            </div>
          </div>
          
          <!-- Split -->
          <div v-if="view==='split'" class="grid grid-cols-2 max-h-96 overflow-auto">
            <div class="border-r" style="border-color:var(--border)">
              <div v-for="(line,i) in result.left" :key="'l'+i" class="font-mono text-xs flex" :style="{background:line.type==='removed'?'#fee2e2':'transparent'}">
                <span class="w-8 text-right pr-2 py-0.5 select-none" :style="{color:'var(--text-secondary)',opacity:0.5}">{{ line.num }}</span>
                <span class="flex-1 py-0.5 pr-2 whitespace-pre-wrap break-all" style="color:var(--text)">{{ line.text }}</span>
              </div>
            </div>
            <div>
              <div v-for="(line,i) in result.right" :key="'r'+i" class="font-mono text-xs flex" :style="{background:line.type==='added'?'#dcfce7':'transparent'}">
                <span class="w-8 text-right pr-2 py-0.5 select-none" :style="{color:'var(--text-secondary)',opacity:0.5}">{{ line.num }}</span>
                <span class="flex-1 py-0.5 pr-2 whitespace-pre-wrap break-all" style="color:var(--text)">{{ line.text }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <button @click="copyDiff" class="btn-secondary w-full mt-3">📋 {{ t('text-compare-copy') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import{ref}from'vue';import{t}from'../../i18n'

const text1=ref('');const text2=ref('')
const ignoreSpace=ref(false);const ignoreCase=ref(false)
const result=ref(null);const view=ref('unified')

function normalize(s){
  let r=s
  if(ignoreCase.value)r=r.toLowerCase()
  if(ignoreSpace.value)r=r.replace(/\s+/g,' ')
  return r.trim()
}

function lcs(a,b){
  const m=a.length,n=b.length
  const dp=Array.from({length:m+1},()=>Array(n+1).fill(0))
  for(let i=1;i<=m;i++)for(let j=1;j<=n;j++){
    if(normalize(a[i-1])===normalize(b[j-1]))dp[i][j]=dp[i-1][j-1]+1
    else dp[i][j]=Math.max(dp[i-1][j],dp[i][j-1])
  }
  const result=[];let i=m,j=n
  while(i>0&&j>0){
    if(normalize(a[i-1])===normalize(b[j-1])){result.unshift({type:'same',text:a[i-1],lineNum:i});i--;j--}
    else if(dp[i-1][j]>=dp[i][j]){result.unshift({type:'removed',text:a[i-1],lineNum:i});i--}
    else{result.unshift({type:'added',text:b[j-1],lineNum:j});j--}
  }
  while(i>0){result.unshift({type:'removed',text:a[i-1],lineNum:i});i--}
  while(j>0){result.unshift({type:'added',text:b[j-1],lineNum:j});j--}
  return result
}

function compare(){
  if(!text1.value&&!text2.value)return
  const lines1=text1.value.split(/\r?\n/)
  const lines2=text2.value.split(/\r?\n/)
  const diff=lcs(lines1,lines2)
  
  let added=0,removed=0,same=0
  diff.forEach(l=>{if(l.type==='added')added++;else if(l.type==='removed')removed++;else same++})
  
  // Build split views
  const left=[],right=[]
  let ln1=0,ln2=0
  diff.forEach(l=>{
    if(l.type==='same'){ln1++;ln2++;left.push({num:ln1,text:l.text,type:'same'});right.push({num:ln2,text:l.text,type:'same'})}
    else if(l.type==='removed'){ln1++;left.push({num:ln1,text:l.text,type:'removed'});right.push({num:'',text:'',type:'empty'})}
    else{ln2++;left.push({num:'',text:'',type:'empty'});right.push({num:ln2,text:l.text,type:'added'})}
  })
  
  result.value={lines:diff,added,removed,same,left,right}
  window.showToast?.('OK')
}

function swap(){[text1.value,text2.value]=[text2.value,text1.value]}
function clearAll(){text1.value='';text2.value='';result.value=null}
function copyDiff(){
  if(!result.value)return
  const diffText=result.value.lines.map(l=>{
    if(l.type==='removed')return '- '+l.text
    if(l.type==='added')return '+ '+l.text
    return '  '+l.text
  }).join('\n')
  navigator.clipboard.writeText(diffText);window.showToast?.(t('copied'))
}
</script>
