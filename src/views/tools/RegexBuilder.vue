<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🔧 {{ t('regex-builder-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('regex-builder-desc') }}</p>
    <div class="space-y-4">
      <div class="card">
        <p class="font-medium mb-3">{{ t('regex-builder-area') }}</p>
        <div class="flex flex-wrap gap-2 mb-3">
          <button v-for="b in blocks" :key="b.id" @click="addBlock(b)" class="btn-secondary text-xs px-3">{{ b.label }}</button>
        </div>
        <div class="space-y-2">
          <div v-for="(block, i) in pattern" :key="i" class="flex items-center gap-2 p-2 rounded" style="background:var(--bg)">
            <select v-model="block.type" class="tool-input text-sm" style="width:140px"><option v-for="b in blocks" :key="b.id" :value="b.id">{{ b.label }}</option></select>
            <input v-if="block.needsValue" v-model="block.value" class="tool-input text-sm font-mono flex-1" :placeholder="block.placeholder">
            <select v-if="block.needsQuantifier" v-model="block.quantifier" class="tool-input text-sm" style="width:120px"><option value="">{{ t('regex-builder-none') }}</option><option value="*">* (0+)</option><option value="+">+ (1+)</option><option value="?">? (0/1)</option><option value="{n}">{n}</option><option value="{n,}">{n,}</option><option value="{n,m}">{n,m}</option></select>
            <button @click="pattern.splice(i,1)" class="text-sm" style="color:var(--text-secondary)">✕</button>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="flex items-center justify-between mb-3"><p class="font-medium">{{ t('regex-builder-generated') }}</p><button @click="copyRegex" class="btn-secondary text-sm">📋</button></div>
        <code class="font-mono text-lg px-3 py-2 rounded block break-all" style="background:var(--bg);color:var(--primary)">{{ regex }}</code>
        <div class="mt-3"><label class="text-sm" style="color:var(--text-secondary)">{{ t('regex-builder-test-str') }}</label><input v-model="testStr" class="tool-input w-full mt-1 font-mono" :placeholder="t('regex-builder-test-placeholder')"></div>
        <div v-if="testStr" class="mt-3 p-3 rounded" :style="{background:matched?'#dcfce7':'#fee2e2'}">
          <p class="font-medium" :style="{color:matched?'#16a34a':'#dc2626'}">{{ matched ? '✅ '+t('regex-builder-match') : '❌ '+t('regex-builder-no-match') }}</p>
          <p v-if="matched" class="text-sm mt-1 font-mono">{{ t('regex-builder-match-content') }}: {{ matchResult }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import{t}from'../../i18n'
const blocks = computed(()=>[
  {id:'char',label:t('regex-builder-char'),needsValue:true,placeholder:'a',needsQuantifier:true},
  {id:'range',label:t('regex-builder-char-range'),needsValue:true,placeholder:'a-z',needsQuantifier:true},
  {id:'digit',label:t('regex-builder-digit'),needsValue:false,needsQuantifier:true},
  {id:'word',label:t('regex-builder-single'),needsValue:false,needsQuantifier:true},
  {id:'space',label:t('regex-builder-whitespace'),needsValue:false,needsQuantifier:true},
  {id:'any',label:t('regex-builder-any'),needsValue:false,needsQuantifier:true},
  {id:'start',label:t('regex-builder-line-start'),needsValue:false,needsQuantifier:false},
  {id:'end',label:t('regex-builder-line-end'),needsValue:false,needsQuantifier:false},
  {id:'group',label:t('regex-builder-capture'),needsValue:true,placeholder:t('regex-builder-subexpr'),needsQuantifier:true},
  {id:'lookahead',label:t('regex-builder-lookahead'),needsValue:true,placeholder:'pattern',needsQuantifier:false},
])
const pattern = ref([{type:'start',value:'',quantifier:''}]); const testStr = ref('')
const regex = computed(() => { try { let s = ''; pattern.value.forEach(b => { const map={char:v=>v,range:v=>'['+v+']',digit:'\\d',word:'\\w',space:'\\s',any:'.',start:'^',end:'$',group:v=>'('+v+')',lookahead:v=>'(?='+v+')'}; let p = map[b.type]?(typeof map[b.type]==='function'?map[b.type](b.value):map[b.type]):''; if(b.quantifier)p+=b.quantifier; s+=p }); return new RegExp(s) } catch { return null } })
const matched = computed(() => regex.value ? regex.value.test(testStr.value) : false)
const matchResult = computed(() => { if(!regex.value) return ''; const m = testStr.value.match(regex.value); return m?m[0]:'' })
function addBlock(b) { pattern.value.push({...b,value:'',quantifier:''}) }
function copyRegex() { navigator.clipboard.writeText(regex.value?.source||''); window.showToast?.(t('copied')) }
</script>
