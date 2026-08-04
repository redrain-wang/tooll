<template>
  <div class="tree-node">
    <div class="node-row" @click="toggle" :style="{paddingLeft:depth*16+'px'}">
      <span v-if="hasChildren" class="toggle" :class="{open}">{{ open?'▾':'▸' }}</span>
      <span v-else class="toggle">•</span>
      <span class="key" v-if="label!==undefined" :style="{color:keyColor}">{{ label }}</span>
      <span v-if="!hasChildren" class="value" :style="{color:valueColor}">{{ displayValue }}</span>
      <span class="type-badge" v-if="hasChildren">{{ typeLabel }}</span>
    </div>
    <div v-if="open&&hasChildren">
      <TreeNode v-for="(child,i) in children" :key="i" :node="child.value" :label="child.key" :depth="depth+1"/>
    </div>
  </div>
</template>

<script setup>
import{ref,computed}from'vue'
const props=defineProps({node:{},label:{default:undefined},depth:{default:0}})
const open=ref(props.depth<2)

const hasChildren=computed(()=>props.node&&typeof props.node==='object'&&!Array.isArray(props.node)&&props.node!==null||Array.isArray(props.node))
const children=computed(()=>{
  if(Array.isArray(props.node))return props.node.map((v,i)=>({key:i,value:v}))
  if(props.node&&typeof props.node==='object')return Object.entries(props.node).map(([k,v])=>({key:k,value:v}))
  return[]
})
const typeLabel=computed(()=>{
  if(Array.isArray(props.node))return`Array[${props.node.length}]`
  if(typeof props.node==='object'&&props.node!==null)return`Object{${Object.keys(props.node).length}}`
  return''
})
const displayValue=computed(()=>{
  const v=props.node
  if(v===null)return'null';if(typeof v==='undefined')return'undefined'
  if(typeof v==='string')return`"${v.length>50?v.slice(0,50)+'...':v}"`
  return String(v)
})
const keyColor=computed(()=>typeof props.label==='number'?'#94a3b8':'#6366f1')
const valueColor=computed(()=>{
  const v=props.node;if(v===null)return'#94a3b8';if(typeof v==='boolean')return'#f59e0b'
  if(typeof v==='number')return'#22c55e';if(typeof v==='string')return'#3b82f6'
  return'#6b7280'
})
function toggle(){open.value=!open.value}
</script>

<style scoped>
.tree-node{font-family:monospace;font-size:13px}
.node-row{display:flex;align-items:center;gap:6px;padding:2px 0;cursor:pointer;border-radius:4px}
.node-row:hover{background:var(--bg)}
.toggle{width:16px;text-align:center;user-select:none;color:var(--text-secondary)}
.key{font-weight:500}
.type-badge{font-size:10px;padding:1px 6px;border-radius:4px;background:var(--bg);color:var(--text-secondary)}
.value{word-break:break-all}
</style>
