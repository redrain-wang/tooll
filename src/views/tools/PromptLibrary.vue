<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('prompt-title') }}</h1>
    <p class="mb-6" style="color: var(--text-secondary);">{{ t('prompt-desc') }}</p>
    <div class="grid md:grid-cols-3 gap-4">
      <div class="space-y-2">
        <div class="flex items-center gap-2 mb-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input v-model="search" class="tool-input text-sm" :placeholder="t('search')">
        </div>
        <div class="flex flex-wrap gap-2 mb-3">
          <button v-for="cat in categories" :key="cat" @click="selectedCat = cat" :class="['text-xs px-3 py-1 rounded-full transition-colors', selectedCat === cat ? 'bg-indigo-500 text-white' : '']" :style="selectedCat !== cat ? {background:'var(--card-bg)',color:'var(--text)',border:'1px solid var(--border)'} : {}">
            {{ cat }}
          </button>
        </div>
        <div class="space-y-1 max-h-96 overflow-y-auto">
          <button v-for="(p, i) in filteredPrompts" :key="i" @click="selected = p" :class="['w-full text-left p-3 rounded-lg text-sm transition-colors', selected === p ? 'ring-2 ring-indigo-500' : '']" :style="{background: selected === p ? 'var(--primary)' : 'var(--card-bg)', color: selected === p ? 'white' : 'var(--text)', border: '1px solid var(--border)'}">
            <span class="font-medium">{{ p.title }}</span>
            <span class="block text-xs mt-0.5 opacity-70">{{ p.cat }}</span>
          </button>
        </div>
      </div>
      <div class="md:col-span-2 card space-y-4">
        <div v-if="selected" class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-lg" style="color: var(--text);">{{ selected.title }}</h3>
            <div class="flex gap-2">
              <button @click="copyPrompt" class="btn-primary text-xs">📋 {{ t('copy') }}</button>
              <button @click="copyTemplate" class="btn-secondary text-xs">📝 {{ t('prompt-copy-template') }}</button>
            </div>
          </div>
          <p class="text-sm" style="color: var(--text-secondary);">{{ selected.desc }}</p>
          <div v-if="selected.vars && selected.vars.length">
            <label class="text-sm font-medium block mb-2" style="color: var(--text-secondary);">{{ t('prompt-vars') }}</label>
            <div class="space-y-2">
              <div v-for="v in selected.vars" :key="v.key" class="flex items-center gap-2">
                <label class="text-sm w-24" style="color: var(--text-secondary);">{{ v.label }}</label>
                <input v-model="vars[v.key]" class="tool-input flex-1" :placeholder="v.placeholder || ''">
              </div>
            </div>
          </div>
          <div>
            <label class="text-sm font-medium block mb-2" style="color: var(--text-secondary);">{{ t('prompt-result') }}</label>
            <div class="p-4 rounded-lg text-sm whitespace-pre-wrap font-mono" style="background: var(--bg); color: var(--text); min-height: 100px;">{{ filledPrompt }}</div>
          </div>
        </div>
        <div v-else class="text-center py-16" style="color: var(--text-secondary);">
          <p class="text-lg">{{ t('prompt-select') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'

const search = ref('')
const selectedCat = ref('All')
const selected = ref(null)
const vars = ref({})

const prompts = [
  { title: 'Code Review', cat: 'Programming', desc: 'Review code for bugs, performance, and style issues.', template: 'Please review the following code and identify:\n1. Bugs or potential errors\n2. Performance issues\n3. Code style improvements\n\nCode:\n{code}', vars: [{ key: 'code', label: 'Code', placeholder: 'Paste your code...' }] },
  { title: 'Bug Fix Helper', cat: 'Programming', desc: 'Help debug and fix code issues.', template: 'I have the following bug in my code:\n\nError: {error}\n\nCode:\n{code}\n\nPlease help me understand the cause and provide a fix.', vars: [{ key: 'error', label: 'Error', placeholder: 'Error message' }, { key: 'code', label: 'Code', placeholder: 'Relevant code' }] },
  { title: 'API Design', cat: 'Programming', desc: 'Design RESTful API endpoints.', template: 'Design a RESTful API for {project}.\n\nInclude:\n- Endpoint paths and methods\n- Request/response formats\n- Authentication approach\n- Error handling', vars: [{ key: 'project', label: 'Project', placeholder: 'e.g., user management system' }] },
  { title: 'SQL Query', cat: 'Programming', desc: 'Generate SQL queries from natural language.', template: 'Write a SQL query for the following:\n\n{description}\n\nTable schema:\n{schema}', vars: [{ key: 'description', label: 'Description', placeholder: 'What you want to query' }, { key: 'schema', label: 'Schema', placeholder: 'Table structure' }] },
  { title: 'Blog Post', cat: 'Writing', desc: 'Write a blog post on any topic.', template: 'Write a blog post about {topic}.\n\nTarget audience: {audience}\nTone: {tone}\nLength: {length}', vars: [{ key: 'topic', label: 'Topic', placeholder: 'Blog topic' }, { key: 'audience', label: 'Audience', placeholder: 'e.g., developers' }, { key: 'tone', label: 'Tone', placeholder: 'e.g., professional' }, { key: 'length', label: 'Length', placeholder: 'e.g., 1000 words' }] },
  { title: 'Email Draft', cat: 'Writing', desc: 'Draft professional emails.', template: 'Draft a professional email:\n\nTo: {to}\nPurpose: {purpose}\nTone: {tone}\nKey points: {points}', vars: [{ key: 'to', label: 'To', placeholder: 'Recipient' }, { key: 'purpose', label: 'Purpose', placeholder: 'Email purpose' }, { key: 'tone', label: 'Tone', placeholder: 'e.g., formal' }, { key: 'points', label: 'Key Points', placeholder: 'Main points to cover' }] },
  { title: 'Summary', cat: 'Writing', desc: 'Summarize long text or articles.', template: 'Summarize the following text in {length}:\n\n{text}', vars: [{ key: 'length', label: 'Length', placeholder: 'e.g., 3 sentences' }, { key: 'text', label: 'Text', placeholder: 'Text to summarize' }] },
  { title: 'Translation', cat: 'Language', desc: 'Translate text between languages.', template: 'Translate the following from {from} to {to}:\n\n{text}', vars: [{ key: 'from', label: 'From', placeholder: 'Source language' }, { key: 'to', label: 'To', placeholder: 'Target language' }, { key: 'text', label: 'Text', placeholder: 'Text to translate' }] },
  { title: 'Grammar Check', cat: 'Language', desc: 'Check and fix grammar errors.', template: 'Check the grammar and fix any errors in the following text:\n\n{text}', vars: [{ key: 'text', label: 'Text', placeholder: 'Text to check' }] },
  { title: 'Explain Concept', cat: 'Learning', desc: 'Explain complex concepts simply.', template: 'Explain {concept} in simple terms that a {level} can understand.\n\nUse examples if possible.', vars: [{ key: 'concept', label: 'Concept', placeholder: 'What to explain' }, { key: 'level', label: 'Level', placeholder: 'e.g., 10 year old, beginner developer' }] },
  { title: 'Flashcards', cat: 'Learning', desc: 'Generate study flashcards.', template: 'Generate flashcards for {topic}.', vars: [{ key: 'topic', label: 'Topic', placeholder: 'Study topic' }] },
  { title: 'Product Description', cat: 'Marketing', desc: 'Write compelling product descriptions.', template: 'Write a product description for:\n\nProduct: {product}\nFeatures: {features}\nTarget audience: {audience}\nTone: {tone}', vars: [{ key: 'product', label: 'Product', placeholder: 'Product name' }, { key: 'features', label: 'Features', placeholder: 'Key features' }, { key: 'audience', label: 'Audience', placeholder: 'Target customers' }, { key: 'tone', label: 'Tone', placeholder: 'e.g., professional, casual' }] },
  { title: 'Social Media Post', cat: 'Marketing', desc: 'Create engaging social media content.', template: 'Create a {platform} post about {topic}.\n\nGoal: {goal}\nTone: {tone}\nInclude hashtags: yes/no', vars: [{ key: 'platform', label: 'Platform', placeholder: 'e.g., Twitter, LinkedIn' }, { key: 'topic', label: 'Topic', placeholder: 'Post topic' }, { key: 'goal', label: 'Goal', placeholder: 'e.g., engagement, sales' }, { key: 'tone', label: 'Tone', placeholder: 'e.g., friendly, professional' }] },
]

const categories = computed(() => ['All', ...new Set(prompts.map(p => p.cat))])

const filteredPrompts = computed(() => {
  return prompts.filter(p => {
    const matchCat = selectedCat.value === 'All' || p.cat === selectedCat.value
    const matchSearch = !search.value || p.title.toLowerCase().includes(search.value.toLowerCase())
    return matchCat && matchSearch
  })
})

const filledPrompt = computed(() => {
  if (!selected.value) return ''
  let result = selected.value.template
  for (const [key, val] of Object.entries(vars.value)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), val || `[${key}]`)
  }
  return result
})

function copyPrompt() {
  navigator.clipboard.writeText(filledPrompt.value)
  window.showToast?.(t('copied'))
}

function copyTemplate() {
  if (!selected.value) return
  navigator.clipboard.writeText(selected.value.template)
  window.showToast?.(t('copied'))
}
</script>
