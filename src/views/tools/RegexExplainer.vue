<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🔍 {{ t('regex-explainer-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('regex-explainer-desc') }}</p>
    <div class="space-y-4">
      <div class="flex items-center gap-2 px-3 py-2 rounded-lg border" style="border-color:var(--border);background:var(--card-bg)">
        <span style="color:var(--text-secondary)">/</span>
        <input v-model="pattern" class="flex-1 bg-transparent border-none outline-none font-mono text-lg" :placeholder="t('regex-explainer-placeholder')" style="color:var(--text)">
        <span style="color:var(--text-secondary)">/</span>
        <input v-model="flags" class="w-16 bg-transparent border-none outline-none font-mono text-sm" placeholder="gim" style="color:var(--text)">
      </div>
      <div v-if="error" class="p-3 rounded-lg text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">{{ error }}</div>

      <div v-if="pattern && !error" class="card">
        <p class="font-semibold mb-3">{{ t('regex-explainer-summary') }}</p>
        <div class="p-3 rounded-lg font-mono text-sm leading-relaxed" style="background:var(--bg);color:var(--text)">{{ plainEnglish }}</div>
      </div>

      <div v-if="parts.length" class="card">
        <p class="font-semibold mb-3">{{ t('regex-explainer-breakdown') }}</p>
        <div class="space-y-1 font-mono text-sm">
          <div v-for="(p, i) in parts" :key="i" class="flex items-start gap-2 py-1.5 px-2 rounded" :style="{ marginLeft: (p.depth || 0) * 20 + 'px' }">
            <span class="text-xs px-1.5 py-0.5 rounded whitespace-nowrap" :style="{ background: p.color + '20', color: p.color }">{{ p.category }}</span>
            <span class="font-mono" :style="{ color: p.color }">{{ p.token }}</span>
            <span class="text-xs ml-auto flex-shrink-0" style="color:var(--text-secondary)">{{ p.desc }}</span>
          </div>
        </div>
      </div>

      <div v-if="parts.length" class="card">
        <p class="font-semibold mb-3">{{ t('regex-explainer-color-legend') }}</p>
        <div class="flex flex-wrap gap-3 text-xs">
          <span v-for="c in legend" :key="c.label" class="flex items-center gap-1">
            <span class="inline-block w-2.5 h-2.5 rounded" :style="{ background: c.color }"></span>
            <span style="color:var(--text-secondary)">{{ c.label }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'

const pattern = ref('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
const flags = ref('')
const error = ref('')

const legend = [
  { label: 'Anchor', color: '#3b82f6' },
  { label: 'Character Class', color: '#8b5cf6' },
  { label: 'Quantifier', color: '#22c55e' },
  { label: 'Group', color: '#f59e0b' },
  { label: 'Set', color: '#ec4899' },
  { label: 'Alternation', color: '#06b6d4' },
  { label: 'Escape', color: '#f97316' },
  { label: 'Literal', color: '#6b7280' },
]

const colors = {
  anchor: '#3b82f6',
  charClass: '#8b5cf6',
  quantifier: '#22c55e',
  group: '#f59e0b',
  set: '#ec4899',
  alternation: '#06b6d4',
  escape: '#f97316',
  literal: '#6b7280',
}

const parts = computed(() => {
  if (!pattern.value) return []
  error.value = ''
  try { new RegExp(pattern.value, flags.value) } catch (e) { error.value = e.message; return [] }
  const result = []
  const p = pattern.value
  let pos = 0
  let depth = 0

  const tryParse = (regex, category, desc, extractToken) => {
    const m = p.slice(pos).match(regex)
    if (m && m.index === 0) {
      const token = extractToken ? extractToken(m) : m[0]
      result.push({ token, category, desc, color: colors[category], depth })
      pos += m[0].length
      return true
    }
    return false
  }

  while (pos < p.length) {
    const ch = p[pos]

    // Anchors
    if (ch === '^') { result.push({ token: '^', category: 'anchor', desc: t('regex-explainer-start-of-string'), color: colors.anchor, depth }); pos++; continue }
    if (ch === '$') { result.push({ token: '$', category: 'anchor', desc: t('regex-explainer-end-of-string'), color: colors.anchor, depth }); pos++; continue }

    // Word boundary
    if (ch === '\\' && pos + 1 < p.length && (p[pos+1] === 'b' || p[pos+1] === 'B')) {
      const isB = p[pos+1] === 'b'
      result.push({ token: ch + p[pos+1], category: 'anchor', desc: isB ? t('regex-explainer-word-boundary') : t('regex-explainer-non-word-boundary'), color: colors.anchor, depth })
      pos += 2; continue
    }

    // Groups
    if (ch === '(') {
      let token = '('
      let desc = t('regex-explainer-capture-group')
      let category = 'group'
      if (p.slice(pos, pos + 3) === '(?:') { token = '(?:'; desc = t('regex-explainer-non-capture-group'); pos += 3 }
      else if (p.slice(pos, pos + 3) === '(?=') { token = '(?='; desc = t('regex-explainer-lookahead'); pos += 3 }
      else if (p.slice(pos, pos + 3) === '(?!') { token = '(?!'; desc = t('regex-explainer-negative-lookahead'); pos += 3 }
      else if (p.slice(pos, pos + 4) === '(?<=') { token = '(?<='; desc = t('regex-explainer-lookbehind'); pos += 4 }
      else if (p.slice(pos, pos + 4) === '(?<!') { token = '(?<!'; desc = t('regex-explainer-negative-lookbehind'); pos += 4 }
      else { pos++ }
      depth++
      result.push({ token, category, desc, color: colors.group, depth: depth - 1 })
      continue
    }
    if (ch === ')') { depth = Math.max(0, depth - 1); result.push({ token: ')', category: 'group', desc: t('regex-explainer-group-end'), color: colors.group, depth }); pos++; continue }

    // Alternation
    if (ch === '|') { result.push({ token: '|', category: 'alternation', desc: t('regex-explainer-or'), color: colors.alternation, depth }); pos++; continue }

    // Character classes [...]
    if (ch === '[') {
      let token = '['
      let i = pos + 1
      if (i < p.length && p[i] === '^') { token += '^'; i++ }
      while (i < p.length && p[i] !== ']') {
        if (p[i] === '\\') { token += p[i] + (p[i+1] || ''); i += 2 } else { token += p[i]; i++ }
      }
      if (i < p.length) { token += ']'; i++ }
      const neg = token.startsWith('[^')
      result.push({ token, category: 'set', desc: neg ? t('regex-explainer-negated-set') + ' ' + token.slice(2, -1) : t('regex-explainer-char-set') + ' ' + token.slice(1, -1), color: colors.set, depth })
      pos = i; continue
    }

    // Escaped characters
    if (ch === '\\' && pos + 1 < p.length) {
      const next = p[pos + 1]
      const escapeMap = {
        'd': t('regex-explainer-digit'),
        'D': t('regex-explainer-non-digit'),
        'w': t('regex-explainer-word-char'),
        'W': t('regex-explainer-non-word-char'),
        's': t('regex-explainer-whitespace'),
        'S': t('regex-explainer-non-whitespace'),
        'n': t('regex-explainer-newline'),
        't': t('regex-explainer-tab'),
        'r': t('regex-explainer-carriage-return'),
      }
      if (escapeMap[next]) {
        result.push({ token: '\\' + next, category: 'charClass', desc: escapeMap[next], color: colors.charClass, depth })
        pos += 2; continue
      }
      // Escaped literal (e.g. \. \* \+)
      const literalMap = { '.': '.', '*': '*', '+': '+', '?': '?', '(': '(', ')': ')', '[': '[', ']': ']', '{': '{', '}': '}', '|': '|', '\\': '\\', '^': '^', '$': '$', '/': '/' }
      if (literalMap[next]) {
        result.push({ token: '\\' + next, category: 'escape', desc: t('regex-explainer-escaped') + ' \'' + literalMap[next] + '\'', color: colors.escape, depth })
        pos += 2; continue
      }
      // \1 backreference
      if (/[1-9]/.test(next)) {
        result.push({ token: '\\' + next, category: 'group', desc: t('regex-explainer-backreference') + ' ' + next, color: colors.group, depth })
        pos += 2; continue
      }
      // Octal or hex
      result.push({ token: '\\' + next, category: 'escape', desc: t('regex-explainer-escape-code'), color: colors.escape, depth })
      pos += 2; continue
    }

    // Quantifiers
    if (ch === '*') { result.push({ token: '*', category: 'quantifier', desc: t('regex-explainer-zero-or-more'), color: colors.quantifier, depth }); pos++; continue }
    if (ch === '+') { result.push({ token: '+', category: 'quantifier', desc: t('regex-explainer-one-or-more'), color: colors.quantifier, depth }); pos++; continue }
    if (ch === '?') { result.push({ token: '?', category: 'quantifier', desc: t('regex-explainer-zero-or-one'), color: colors.quantifier, depth }); pos++; continue }
    if (ch === '{') {
      const m = p.slice(pos).match(/^\{(\d+)(?:,(\d*))?\}/)
      if (m) {
        let desc
        if (m[2] !== undefined) {
          desc = m[2] === '' ? t('regex-explainer-at-least-n', { n: m[1] }) : t('regex-explainer-between-n-m', { n: m[1], m: m[2] })
        } else {
          desc = t('regex-explainer-exactly-n', { n: m[1] })
        }
        result.push({ token: m[0], category: 'quantifier', desc, color: colors.quantifier, depth })
        pos += m[0].length; continue
      }
    }

    // Dot (any character)
    if (ch === '.') { result.push({ token: '.', category: 'charClass', desc: t('regex-explainer-any-char'), color: colors.charClass, depth }); pos++; continue }

    // Literal
    result.push({ token: ch, category: 'literal', desc: t('regex-explainer-literal') + ' \'' + ch + '\'', color: colors.literal, depth })
    pos++
  }

  return result
})

const plainEnglish = computed(() => {
  if (!parts.value.length) return ''
  const segs = parts.value.map(p => p.desc)
  // Join into readable sentences
  let text = segs.join('. ')
  text = text.replace(/\.\./g, '.').replace(/^[a-z]/, c => c.toUpperCase())
  return text + '.'
})
</script>
