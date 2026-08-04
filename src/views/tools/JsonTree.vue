<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">📊 {{ t('json-tree-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('json-tree-desc') }}</p>
    <div class="space-y-4">
      <textarea v-model="input" class="tool-input h-40 font-mono text-sm" :placeholder="t('json-tree-placeholder')"></textarea>
      <button @click="parse" class="btn-primary w-full">📊 {{ t('json-tree-visualize') }}</button>
      <div v-if="error" class="p-3 rounded-lg text-sm" style="background:#fee2e2;color:#dc2626">{{ error }}</div>
      <div v-if="tree" class="card overflow-auto max-h-[500px]">
        <TreeNode :node="tree" :depth="0"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import{ref}from'vue'
import TreeNode from '../../components/TreeNode.vue'
import{t}from'../../i18n'
const input=ref('');const tree=ref(null);const error=ref('')
function parse(){
  error.value='';tree.value=null
  try{tree.value=JSON.parse(input.value)}
  catch(e){error.value=t('json-tree-parse-failed')+': '+e.message}
}
</script>
