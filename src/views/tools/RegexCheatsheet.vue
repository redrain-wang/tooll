<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('regex-cheat-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('regex-cheat-desc') }}</p>
    <div class="grid md:grid-cols-2 gap-4">
      <div v-for="cat in cheatsheet" :key="cat.title" class="card">
        <h3 class="font-semibold mb-3" style="color:var(--primary)">{{ cat.title }}</h3>
        <div class="space-y-1.5">
          <div v-for="item in cat.items" :key="item.pattern" class="flex items-center gap-3 text-sm">
            <code class="px-2 py-0.5 rounded text-xs font-mono" style="background:var(--bg);color:var(--primary)">{{ item.pattern }}</code>
            <span style="color:var(--text-secondary)">{{ item.desc }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import{t}from'../../i18n'
const cheatsheet=[
  {title:t('regex-cheat-char-match'),items:[{pattern:'.',desc:t('regex-cheat-any-char')},{pattern:'\\d',desc:t('regex-cheat-digit')},{pattern:'\\w',desc:t('regex-cheat-word')},{pattern:'\\s',desc:t('regex-cheat-space')},{pattern:'[abc]',desc:t('regex-cheat-charset')},{pattern:'[^abc]',desc:t('regex-cheat-negate')}]},
  {title:t('regex-cheat-quantifier'),items:[{pattern:'*',desc:t('regex-cheat-0-or-more')},{pattern:'+',desc:t('regex-cheat-1-or-more')},{pattern:'?',desc:t('regex-cheat-0-or-1')},{pattern:'{n}',desc:t('regex-cheat-exact-n')},{pattern:'{n,m}',desc:t('regex-cheat-n-to-m')}]},
  {title:t('regex-cheat-position'),items:[{pattern:'^',desc:t('regex-cheat-line-start')},{pattern:'$',desc:t('regex-cheat-line-end')},{pattern:'\\b',desc:t('regex-cheat-word-boundary')}]},
  {title:t('regex-cheat-group'),items:[{pattern:'(abc)',desc:t('regex-cheat-capture')},{pattern:'(?:abc)',desc:t('regex-cheat-non-capture')},{pattern:'(?=abc)',desc:t('regex-cheat-lookahead')},{pattern:'(?!abc)',desc:t('regex-cheat-negative-lookahead')}]},
  {title:t('regex-cheat-examples'),items:[{pattern:'^[\\u4e00-\\u9fa5]+$',desc:t('regex-cheat-chinese')},{pattern:'^[a-zA-Z0-9]+$',desc:t('regex-cheat-alphanumeric')},{pattern:'^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$',desc:t('regex-cheat-ip')},{pattern:'^1[3-9]\\d{9}$',desc:t('regex-cheat-phone')}]},
]
</script>
