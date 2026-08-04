<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">Regex Highlight</h1>
    <p class="mb-6" style="color: var(--text-secondary);">Test regex patterns with visual match highlighting</p>
    <div class="space-y-4">
      <div class="flex gap-3">
        <div class="flex-1 flex items-center gap-2 px-3 rounded-lg border" style="border-color: var(--border); background: var(--card-bg);">
          <span style="color: var(--text-secondary);">/</span>
          <input v-model="pattern" class="flex-1 bg-transparent border-none outline-none font-mono text-sm" placeholder="Enter regex pattern..." style="color: var(--text);">
          <span style="color: var(--text-secondary);">/</span>
          <input v-model="flags" class="w-16 bg-transparent border-none outline-none font-mono text-sm" placeholder="gim" style="color: var(--text);">
        </div>
      </div>
      <div class="flex gap-2">
        <label v-for="flag in availableFlags" :key="flag.value" class="flex items-center gap-1 px-3 py-1.5 rounded-lg border cursor-pointer text-sm" :style="{ borderColor: flags.includes(flag.value) ? 'var(--primary)' : 'var(--border)', background: flags.includes(flag.value) ? 'var(--primary)' : 'var(--card-bg)', color: flags.includes(flag.value) ? 'white' : 'var(--text)' }" @click="toggleFlag(flag.value)">
          <input type="checkbox" :checked="flags.includes(flag.value)" class="hidden">
          <span class="font-mono">{{ flag.value }}</span>
          <span style="color: var(--text-secondary);" :style="{ color: flags.includes(flag.value) ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)' }">{{ flag.label }}</span>
        </label>
      </div>
      <div class="card">
        <p class="text-sm font-semibold mb-2" style="color: var(--text);">Highlighted Text</p>
        <div class="p-3 rounded-lg font-mono text-sm whitespace-pre-wrap break-all min-h-[120px]" style="background: var(--bg); color: var(--text);" v-html="highlightedText"></div>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1" style="color: var(--text);">Test Text</label>
        <textarea v-model="text" class="tool-input h-48 font-mono text-sm" placeholder="Enter test text..."></textarea>
      </div>
      <div v-if="error" class="p-3 rounded-lg text-sm" style="background: rgba(239,68,68,0.1); color: #ef4444;">{{ error }}</div>
      <div v-if="matchDetails.length" class="card">
        <p class="text-sm font-semibold mb-3" style="color: var(--text);">Match Details ({{ matchDetails.length }} matches)</p>
        <div class="space-y-2">
          <div v-for="(m, i) in matchDetails" :key="i" class="p-3 rounded-lg" style="background: var(--bg);">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-xs font-medium px-2 py-0.5 rounded" :style="{ background: matchColors[i % matchColors.length], color: 'white' }">{{ i + 1 }}</span>
              <span class="font-mono text-sm" style="color: var(--text);">"{{ m.value }}"</span>
              <span class="text-xs" style="color: var(--text-secondary);">Index: {{ m.index }}</span>
              <span class="text-xs" style="color: var(--text-secondary);">Length: {{ m.length }}</span>
            </div>
            <div v-if="m.groups && m.groups.length" class="ml-8 space-y-1">
              <div v-for="(g, gi) in m.groups" :key="gi" class="flex items-center gap-2 text-xs">
                <span class="font-mono px-1.5 py-0.5 rounded" style="background: var(--card-bg); color: var(--text-secondary);">Group {{ gi + 1 }}</span>
                <span class="font-mono" style="color: var(--text);">{{ g !== undefined ? `"${g}"` : 'undefined' }}</span>
              </div>
            </div>
            <div v-if="m.namedGroups && Object.keys(m.namedGroups).length" class="ml-8 mt-1 space-y-1">
              <div v-for="(val, name) in m.namedGroups" :key="name" class="flex items-center gap-2 text-xs">
                <span class="font-mono px-1.5 py-0.5 rounded" style="background: var(--primary); color: white;">{{ name }}</span>
                <span class="font-mono" style="color: var(--text);">{{ val !== undefined ? `"${val}"` : 'undefined' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'

const pattern = ref('')
const flags = ref('g')
const text = ref('')
const error = ref('')

const availableFlags = [
  { value: 'g', label: 'Global' },
  { value: 'i', label: 'Case Insensitive' },
  { value: 'm', label: 'Multiline' },
  { value: 's', label: 'DotAll' },
  { value: 'u', label: 'Unicode' },
]

const matchColors = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#14b8a6',
]

function toggleFlag(flag) {
  if (flags.value.includes(flag)) {
    flags.value = flags.value.replace(flag, '')
  } else {
    flags.value += flag
  }
}

const regex = computed(() => {
  if (!pattern.value) return null
  try {
    error.value = ''
    return new RegExp(pattern.value, flags.value)
  } catch (e) {
    error.value = e.message
    return null
  }
})

const matchDetails = computed(() => {
  if (!regex.value || !text.value) return []
  const r = new RegExp(pattern.value, flags.value)
  const results = []
  let m
  const isGlobal = flags.value.includes('g')
  if (isGlobal) {
    while ((m = r.exec(text.value)) !== null) {
      results.push({
        value: m[0],
        index: m.index,
        length: m[0].length,
        groups: m.slice(1),
        namedGroups: m.groups || {},
      })
      if (m[0].length === 0) r.lastIndex++
    }
  } else {
    m = r.exec(text.value)
    if (m) {
      results.push({
        value: m[0],
        index: m.index,
        length: m[0].length,
        groups: m.slice(1),
        namedGroups: m.groups || {},
      })
    }
  }
  return results
})

const highlightedText = computed(() => {
  if (!regex.value || !text.value) {
    return escapeHtml(text.value || '')
  }
  const r = new RegExp(pattern.value, flags.value)
  const isGlobal = flags.value.includes('g')
  let result = ''
  let lastIndex = 0
  let m
  let colorIdx = 0
  if (isGlobal) {
    while ((m = r.exec(text.value)) !== null) {
      result += escapeHtml(text.value.slice(lastIndex, m.index))
      const color = matchColors[colorIdx % matchColors.length]
      result += `<mark style="background:${color};color:white;padding:1px 2px;border-radius:2px;">${escapeHtml(m[0])}</mark>`
      lastIndex = m.index + m[0].length
      colorIdx++
      if (m[0].length === 0) r.lastIndex++
    }
    result += escapeHtml(text.value.slice(lastIndex))
  } else {
    m = r.exec(text.value)
    if (m) {
      result += escapeHtml(text.value.slice(0, m.index))
      const color = matchColors[0]
      result += `<mark style="background:${color};color:white;padding:1px 2px;border-radius:2px;">${escapeHtml(m[0])}</mark>`
      result += escapeHtml(text.value.slice(m.index + m[0].length))
    } else {
      result = escapeHtml(text.value)
    }
  }
  return result
})

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
</script>
