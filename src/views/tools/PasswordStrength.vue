<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('password-strength-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('password-strength-desc') }}</p>
    <div class="card space-y-4">
      <input v-model="password" type="password" class="tool-input text-lg" :placeholder="t('password-strength-placeholder')">
      <div class="flex items-center gap-3">
        <div class="flex-1 h-3 rounded-full" style="background:var(--bg)">
          <div class="h-full rounded-full transition-all" :style="{width:strength.width,background:strength.color}"></div>
        </div>
        <span class="font-medium text-sm" :style="{color:strength.textColor}">{{ strength.label }}</span>
      </div>
      <div v-if="password" class="space-y-2 text-sm">
        <div v-for="rule in rules" :key="rule.label" class="flex items-center gap-2">
          <span :style="{color:rule.pass?'#22c55e':'#ef4444'}">{{ rule.pass?'✓':'✗' }}</span>
          <span style="color:var(--text-secondary)">{{ rule.label }}</span>
        </div>
      </div>
      <div v-if="password" class="p-3 rounded-lg text-xs" style="background:var(--bg);color:var(--text-secondary)">
        <p>⏱️ {{ t('password-strength-crack') }}: {{ crackTime }}</p>
        <p>📊 {{ t('password-strength-entropy') }}: {{ entropy.toFixed(1) }} bits</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import{ref,computed}from'vue'
import{t}from'../../i18n'
const password=ref('')
const rules=computed(()=>[
  {label:t('password-strength-min8'),pass:password.value.length>=8},
  {label:t('password-strength-upper'),pass:/[A-Z]/.test(password.value)},
  {label:t('password-strength-lower'),pass:/[a-z]/.test(password.value)},
  {label:t('password-strength-digit'),pass:/\d/.test(password.value)},
  {label:t('password-strength-special'),pass:/[^A-Za-z0-9]/.test(password.value)},
])
const entropy=computed(()=>{let s=0;const p=password.value;if(/[a-z]/.test(p))s+=26;if(/[A-Z]/.test(p))s+=26;if(/\d/.test(p))s+=10;if(/[^A-Za-z0-9]/.test(p))s+=33;return p.length*Math.log2(s||1)})
const strength=computed(()=>{
  const score=rules.value.filter(r=>r.pass).length
  const levels=[
    {label:t('password-strength-very-weak'),color:'#ef4444',textColor:'#ef4444',width:'10%'},
    {label:t('password-strength-weak'),color:'#f97316',textColor:'#f97316',width:'30%'},
    {label:t('password-strength-fair'),color:'#eab308',textColor:'#eab308',width:'50%'},
    {label:t('password-strength-strong'),color:'#22c55e',textColor:'#22c55e',width:'75%'},
    {label:t('password-strength-very-strong'),color:'#16a34a',textColor:'#16a34a',width:'100%'},
  ]
  return levels[Math.min(score,4)]
})
const crackTime=computed(()=>{
  const e=entropy.value;const guessesPerSec=1e10
  const seconds=Math.pow(2,e)/guessesPerSec
  if(seconds<1)return t('password-strength-moment');if(seconds<60)return Math.floor(seconds)+' '+t('password-strength-seconds')
  if(seconds<3600)return Math.floor(seconds/60)+' '+t('password-strength-minutes');if(seconds<86400)return Math.floor(seconds/3600)+' '+t('password-strength-hours')
  if(seconds<31536000)return Math.floor(seconds/86400)+' '+t('password-strength-days');return Math.floor(seconds/31536000)+' '+t('password-strength-years')
})
</script>
