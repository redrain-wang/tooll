<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('css-to-tailwind') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('css-to-tailwind-desc') }}</p>
    <div class="space-y-4">
      <textarea v-model="input" class="tool-input h-64 font-mono text-sm" placeholder=".card {&#10;  padding: 1rem;&#10;  border-radius: 0.5rem;&#10;  background: white;&#10;  box-shadow: 0 1px 3px rgba(0,0,0,0.1);&#10;}"></textarea>
      <div class="flex gap-3 flex-wrap">
        <button @click="convert" class="btn-primary">✨ {{ t('convert') }}</button>
        <button @click="copy" class="btn-secondary">📋 {{ t('copy') }}</button>
      </div>
      <textarea v-model="output" class="tool-input h-64 font-mono text-sm" readonly style="background:var(--card-bg)" :placeholder="t('output')"></textarea>
    </div>
  </div>
</template>
<script setup>
import{ref}from'vue';import{t}from'../../i18n'
const input=ref('');const output=ref('')
const map={
  'padding':'p','padding-top':'pt','padding-right':'pr','padding-bottom':'pb','padding-left':'pl',
  'margin':'m','margin-top':'mt','margin-right':'mr','margin-bottom':'mb','margin-left':'ml',
  'border-radius':'rounded','border-radius-lg':'rounded-lg','border-radius-xl':'rounded-xl','border-radius-2xl':'rounded-2xl','border-radius-full':'rounded-full',
  'border':'border','border-top':'border-t','border-right':'border-r','border-bottom':'border-b','border-left':'border-l',
  'display-flex':'flex','display-grid':'grid','display-block':'block','display-inline':'inline','display-inline-block':'inline-block','display-none':'hidden',
  'flex-direction-row':'flex-row','flex-direction-column':'flex-col',
  'flex-wrap':'flex-wrap','flex-nowrap':'flex-nowrap',
  'justify-center':'justify-center','justify-between':'justify-between','justify-end':'justify-end','justify-start':'justify-start',
  'justify-items-center':'justify-items-center','justify-items-end':'justify-items-end','justify-items-start':'justify-items-start',
  'align-center':'items-center','align-end':'items-end','align-start':'items-start','align-stretch':'items-stretch',
  'text-center':'text-center','text-left':'text-left','text-right':'text-right',
  'font-bold':'font-bold','font-semibold':'font-semibold','font-medium':'font-medium','font-normal':'font-normal','font-light':'font-light',
  'overflow-hidden':'overflow-hidden','overflow-auto':'overflow-auto','overflow-scroll':'overflow-scroll','overflow-x-auto':'overflow-x-auto','overflow-y-auto':'overflow-y-auto',
  'position-relative':'relative','position-absolute':'absolute','position-fixed':'fixed','position-sticky':'sticky',
  'w-full':'w-full','w-auto':'w-auto','h-full':'h-full','h-auto':'h-auto',
  'max-w-full':'max-w-full','max-w-screen':'max-w-screen','max-w-none':'max-w-none',
  'min-w-0':'min-w-0','min-h-0':'min-h-0',
  'gap-0':'gap-0','gap-1':'gap-1','gap-2':'gap-2','gap-3':'gap-3','gap-4':'gap-4','gap-6':'gap-6','gap-8':'gap-8',
  'shadow':'shadow','shadow-lg':'shadow-lg','shadow-xl':'shadow-xl','shadow-2xl':'shadow-2xl','shadow-sm':'shadow-sm',
  'opacity-0':'opacity-0','opacity-25':'opacity-25','opacity-50':'opacity-50','opacity-75':'opacity-75','opacity-100':'opacity-100',
  'transition':'transition','transition-all':'transition-all','transition-colors':'transition-colors','transition-transform':'transition-transform',
  'cursor-pointer':'cursor-pointer','cursor-default':'cursor-default','cursor-not-allowed':'cursor-not-allowed',
  'select-none':'select-none','select-all':'select-all','select-text':'select-text',
  'truncate':'truncate','line-through':'line-through','underline':'underline','no-underline':'no-underline',
  'italic':'italic','uppercase':'uppercase','lowercase':'lowercase','capitalize':'capitalize',
  'whitespace-normal':'whitespace-normal','whitespace-nowrap':'whitespace-nowrap','whitespace-pre':'whitespace-pre','whitespace-pre-line':'whitespace-pre-line','whitespace-pre-wrap':'whitespace-pre-wrap',
  'break-normal':'break-normal','break-words':'break-words','break-all':'break-all','break-keep':'break-keep',
}
const sizeMap={
  '0':'0','0.5':'0.5','1':'1','1.5':'1.5','2':'2','2.5':'2.5','3':'3','3.5':'3.5','4':'4','5':'5','6':'6','7':'7','8':'8','9':'9','10':'10','11':'11','12':'12','14':'14','16':'16','20':'20','24':'24','28':'28','32':'32','36':'36','40':'40','44':'44','48':'48','52':'52','56':'56','60':'60','64':'64','72':'72','80':'80','96':'96',
}
function parseCssValue(v){return v.replace(/;$/,'').trim()}
function convertCssProp(prop,val){
  const p=prop.trim().toLowerCase();const v=parseCssValue(val)
  if(p==='display'){const d=v.toLowerCase();return map['display-'+d]||d}
  if(p==='flex-direction')return map['flex-direction-'+v.toLowerCase()]||'flex-'+v
  if(p==='justify-content')return map['justify-'+v.toLowerCase()]||'justify-'+v
  if(p==='align-items')return map['align-'+v.toLowerCase()]||'items-'+v
  if(p==='text-align')return map['text-'+v.toLowerCase()]||'text-'+v
  if(p==='font-weight'){
    const fw={'100':'font-thin','200':'font-extralight','300':'font-light','400':'font-normal','500':'font-medium','600':'font-semibold','700':'font-bold','800':'font-extrabold','900':'font-black'}
    return fw[v]||map[v]||v
  }
  if(p==='overflow')return map['overflow-'+v.toLowerCase()]||'overflow-'+v
  if(p==='position')return map['position-'+v.toLowerCase()]||v
  if(p==='width'){if(v==='100%')return'w-full';if(v==='auto')return'w-auto';return'w-'+v}
  if(p==='height'){if(v==='100%')return'h-full';if(v==='auto')return'h-auto';return'h-'+v}
  if(p==='max-width')return'max-w-'+v
  if(p==='min-width')return'min-w-'+v
  if(p==='cursor')return'cursor-'+v
  if(p==='user-select')return'select-'+v
  if(p==='text-decoration')return v==='none'?'no-underline':v
  if(p==='text-transform')return map[v.toLowerCase()]||v
  if(p==='white-space')return map['whitespace-'+v.toLowerCase()]||v
  if(p==='word-break')return map['break-'+v.toLowerCase()]||v
  if(p==='opacity')return'opacity-'+v
  if(p==='transition')return'transition'
  if(p==='box-shadow'){
    if(v==='none')return' shadow-none'
    if(v.includes('0 1px 3px'))return'shadow'
    if(v.includes('0 4px 6px'))return'shadow-md'
    if(v.includes('0 10px 15px'))return'shadow-lg'
    if(v.includes('0 20px 25px'))return'shadow-xl'
    return'shadow'
  }
  if(p==='border-radius'){
    if(v==='9999px')return'rounded-full'
    if(v.endsWith('px')){
      const px=parseFloat(v)
      if(px<=4)return'rounded'
      if(px<=8)return'rounded-lg'
      if(px<=12)return'rounded-xl'
      if(px<=16)return'rounded-2xl'
      return'rounded-3xl'
    }
    return'rounded'
  }
  if(['padding','margin','padding-top','padding-right','padding-bottom','padding-left','margin-top','margin-right','margin-bottom','margin-left'].includes(p)){
    const prefix=map[p]
    if(v==='0')return prefix+'-0'
    if(v==='auto')return prefix+'-auto'
    const px=parseFloat(v)
    if(px<=4) return prefix+'-1'
    if(px<=8) return prefix+'-2'
    if(px<=12) return prefix+'-3'
    if(px<=16) return prefix+'-4'
    if(px<=20) return prefix+'-5'
    if(px<=24) return prefix+'-6'
    if(px<=32) return prefix+'-8'
    if(px<=40) return prefix+'-10'
    if(px<=48) return prefix+'-12'
    if(px<=64) return prefix+'-16'
    return prefix+'-'+px/4
  }
  if(p==='gap'){
    const px=parseFloat(v)
    if(px<=4) return'gap-1'
    if(px<=8) return'gap-2'
    if(px<=12) return'gap-3'
    if(px<=16) return'gap-4'
    if(px<=24) return'gap-6'
    if(px<=32) return'gap-8'
    return'gap-'+px/4
  }
  return null
}
function convert(){
  const css=input.value
  const blocks=[];let i=0
  while(i<css.length){
    if(css[i]==='{'){
      let depth=1;let j=i+1
      while(j<css.length&&depth>0){if(css[j]==='{')depth++;if(css[j]==='}')depth--;j++}
      const selector=css.slice(0,i).trim().split('\n').pop().trim()
      const body=css.slice(i+1,j-1)
      blocks.push({selector,body});i=j
    }else i++
  }
  const results=blocks.map(({selector,body})=>{
    const classes=[]
    const lines=body.split(';').map(l=>l.trim()).filter(Boolean)
    lines.forEach(line=>{
      const colon=line.indexOf(':')
      if(colon===-1)return
      const prop=line.slice(0,colon).trim()
      const val=line.slice(colon+1).trim()
      const tw=convertCssProp(prop,val)
      if(tw)classes.push(tw)
    })
    return`<!-- ${selector} -->\nclass="${classes.join(' ')}"`
  })
  output.value=results.join('\n\n')
}
function copy(){navigator.clipboard.writeText(output.value);window.showToast?.(t('copied'))}
</script>
