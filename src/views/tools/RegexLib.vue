<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('regex-lib-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('regex-lib-desc') }}</p>
    <div class="grid md:grid-cols-2 gap-4">
      <div v-for="r in regexes" :key="r.name" class="card cursor-pointer hover:-translate-y-0.5 transition-all" @click="copy(r.pattern)">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-semibold text-sm" style="color:var(--text)">{{ r.name }}</h3>
          <span class="text-xs" style="color:var(--primary)">📋 {{ t('regex-lib-click-copy') }}</span>
        </div>
        <code class="text-xs font-mono p-2 rounded block" style="background:var(--bg);color:var(--primary)">{{ r.pattern }}</code>
        <p class="text-xs mt-2" style="color:var(--text-secondary)">{{ r.desc }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import{computed}from'vue'
import{t}from'../../i18n'
const regexes=computed(()=>[
  {name:t('regex-lib-phone-cn'),pattern:'^1[3-9]\\d{9}$',desc:t('regex-lib-phone-desc')},
  {name:t('regex-lib-id-card'),pattern:'^[1-9]\\d{5}(18|19|20)\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])\\d{3}[\\dXx]$',desc:t('regex-lib-id-card-desc')},
  {name:t('regex-lib-email'),pattern:'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',desc:t('regex-lib-email-desc')},
  {name:t('regex-lib-url'),pattern:'https?:\/\/[\\w-]+(\\.[\\w-]+)+([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?',desc:t('regex-lib-url')},
  {name:t('regex-lib-ipv4'),pattern:'^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$',desc:t('regex-lib-ipv4')},
  {name:t('regex-lib-date'),pattern:'^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$',desc:t('regex-lib-date')},
  {name:t('regex-lib-time-24h'),pattern:'^([01]\\d|2[0-3]):[0-5]\\d$',desc:t('regex-lib-time-24h')},
  {name:t('regex-lib-css-color'),pattern:'^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$',desc:t('regex-lib-css-color')},
  {name:t('regex-lib-chinese'),pattern:'[\\u4e00-\\u9fa5]',desc:t('regex-lib-chinese-desc')},
  {name:t('regex-lib-plate'),pattern:'^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤川青藏琼宁][A-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$',desc:t('regex-lib-plate-desc')},
])
function copy(v){navigator.clipboard.writeText(v);window.showToast?.(t('copied'))}
</script>
