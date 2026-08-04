<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🔍 {{ t('regex-visual-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('regex-visual-desc') }}</p>
    <div class="space-y-4">
      <input v-model="pattern" class="tool-input font-mono text-lg" :placeholder="t('regex-visual-placeholder')">
      <input v-model="testStr" class="tool-input font-mono" :placeholder="t('regex-visual-test')">
      <div v-if="testStr" class="flex items-center gap-3 p-3 rounded-lg" :style="{background:testMatch?'#dcfce7':'#fee2e2'}">
        <span :style="{color:testMatch?'#16a34a':'#dc2626'}">{{ testMatch?'✅ '+t('regex-visual-match'):'❌ '+t('regex-visual-no-match') }}</span>
      </div>
      
      <div v-if="parts.length" class="card">
        <p class="font-semibold mb-3" style="color:var(--text)">{{ t('regex-visual-structure') }}</p>
        <div class="space-y-1 font-mono text-sm">
          <div v-for="(p,i) in parts" :key="i" class="flex items-start gap-2 py-1 px-2 rounded" :style="{marginLeft:p.indent*20+'px',background:p.highlight?'#e0e7ff':'transparent'}">
            <span class="text-xs px-1.5 py-0.5 rounded" :style="{background:p.color+'20',color:p.color}">{{ p.type }}</span>
            <span style="color:var(--text)">{{ p.pattern }}</span>
            <span class="text-xs ml-auto" style="color:var(--text-secondary)">{{ p.desc }}</span>
          </div>
        </div>
      </div>
      
      <div v-if="examples.length" class="card">
        <p class="font-semibold mb-3" style="color:var(--text)">{{ t('regex-visual-examples') }}</p>
        <div class="space-y-1 font-mono text-xs">
          <div v-for="ex in examples" :key="ex.text" class="flex items-center gap-2 p-2 rounded" :style="{background:ex.match?'#dcfce7':'#fee2e2'}">
            <span :style="{color:ex.match?'#16a34a':'#dc2626'}">{{ ex.match?'✓':'✗' }}</span>
            <code style="color:var(--text)">{{ ex.text }}</code>
            <span v-if="ex.match" class="text-xs" style="color:var(--text-secondary)">→ {{ ex.matched }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import{ref,computed}from'vue'
import{t}from'../../i18n'
const pattern=ref('^[a-z]+\\d{2,4}$');const testStr=ref('')
const testMatch=computed(()=>{if(!testStr.value||!pattern.value)return null;try{return new RegExp(pattern.value).test(testStr.value)}catch{return null}})

const parts=computed(()=>{
  if(!pattern.value)return[]
  const result=[];let indent=0;const p=pattern.value
  const rules=[
    {re:/\^/,type:t('regex-visual-anchor'),color:'#3b82f6',desc:t('regex-cheat-line-start')},
    {re:/\$$/,type:t('regex-visual-anchor'),color:'#3b82f6',desc:t('regex-cheat-line-end')},
    {re:/\\d/,type:t('regex-visual-char-class'),color:'#8b5cf6',desc:t('regex-cheat-digit')},
    {re:/\\w/,type:t('regex-visual-char-class'),color:'#8b5cf6',desc:t('regex-cheat-word')},
    {re:/\\s/,type:t('regex-visual-char-class'),color:'#8b5cf6',desc:t('regex-cheat-space')},
    {re:/\\b/,type:t('regex-visual-anchor'),color:'#3b82f6',desc:t('regex-cheat-word-boundary')},
    {re:/\[\^?[\w-]+\]/,type:t('regex-visual-set'),color:'#ec4899',desc:t('regex-visual-set-desc')},
    {re:/\(\?:/,type:t('regex-visual-group'),color:'#f59e0b',desc:t('regex-visual-group-non'),indent:1},
    {re:/\(/,type:t('regex-visual-group'),color:'#f59e0b',desc:t('regex-visual-group-start'),indent:1},
    {re:/\)/,type:t('regex-visual-group'),color:'#f59e0b',desc:t('regex-visual-group-end'),indent:-1},
    {re:/\{\d+,?\d*\}/,type:t('regex-visual-quantifier'),color:'#22c55e',desc:t('regex-visual-repeat')},
    {re:/\+/,type:t('regex-visual-quantifier'),color:'#22c55e',desc:t('regex-visual-1-or-more')},
    {re:/\*/,type:t('regex-visual-quantifier'),color:'#22c55e',desc:t('regex-visual-0-or-more')},
    {re:/\?/,type:t('regex-visual-quantifier'),color:'#22c55e',desc:t('regex-visual-0-or-1')},
    {re:/\./,type:t('regex-visual-wildcard'),color:'#ef4444',desc:t('regex-cheat-any-char')},
    {re:/\|/,type:t('regex-visual-or'),color:'#06b6d4',desc:t('regex-visual-or')},
  ]
  
  let pos=0
  while(pos<p.length){
    let matched=false
    for(const rule of rules){
      const m=p.slice(pos).match(rule.re)
      if(m&&m.index===0){
        indent+=rule.indent||0
        if(indent<0)indent=0
        result.push({pattern:m[0],type:rule.type,desc:rule.desc,color:rule.color,indent,highlight:rule.indent>0})
        pos+=m[0].length;matched=true;break
      }
    }
    if(!matched){
      const ch=p[pos]
      result.push({pattern:ch,type:t('regex-visual-char'),desc:t('regex-visual-literal')+' \''+ch+'\'',color:'#6b7280',indent,highlight:false})
      pos++
    }
  }
  return result
})

const examples=computed(()=>{
  if(!pattern.value)return[]
  try{
    const re=new RegExp(pattern.value)
    return['hello123','abc','test4567','HELLO','12345','a','ab12','hello'].map(t=>({text:t,match:re.test(t),matched:t.match(re)?.[0]||''}))
  }catch{return[]}
})
</script>
