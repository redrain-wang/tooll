<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">🪪 {{ t('id-card-parser') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('id-card-parser-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <input v-model.trim="id" @input="parse" class="tool-input w-full font-mono" placeholder="输入18位身份证号码" maxlength="18">

      <div v-if="error" class="text-sm text-red-500">{{ error }}</div>

      <div v-if="info.birth" class="pt-3 border-t grid grid-cols-2 gap-3" style="border-color:var(--border)">
        <div class="card p-3">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('birth-date') }}</div>
          <div class="font-medium" style="color:var(--text)">{{ info.birth }}</div>
        </div>
        <div class="card p-3">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('gender') }}</div>
          <div class="font-medium" style="color:var(--text)">{{ info.gender }}</div>
        </div>
        <div class="card p-3">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('age') }}</div>
          <div class="font-medium" style="color:var(--text)">{{ info.age }}</div>
        </div>
        <div class="card p-3">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('zodiac') }} / {{ t('constellation') }}</div>
          <div class="font-medium" style="color:var(--text)">{{ info.zodiac }} / {{ info.constellation }}</div>
        </div>
        <div class="card p-3 col-span-2">
          <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('birth-place') }}</div>
          <div class="font-medium" style="color:var(--text)">{{ info.region }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { t } from '../../i18n'

const id = ref('')
const error = ref('')
const info = reactive({})

const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
const checks = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']

const regions = {
  11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古',
  21: '辽宁', 22: '吉林', 23: '黑龙江',
  31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东',
  41: '河南', 42: '湖北', 43: '湖南', 44: '广东', 45: '广西', 46: '海南',
  50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏',
  61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆',
  71: '台湾', 81: '香港', 82: '澳门',
}

const zodiacs = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
const constellations = ['摩羯座', '水瓶座', '双鱼座', '白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座']

function constellation(month, day) {
  const idx = [10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  const edge = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 23, 22]
  return constellations[day < edge[month - 1] ? idx[month - 1] : month % 12]
}

function parse() {
  error.value = ''
  const s = id.value
  if (s.length < 18) { Object.keys(info).forEach(k => delete info[k]); return }
  if (!/^\d{17}[\dXx]$/.test(s)) { error.value = t('id-card-invalid'); return }
  const sum = s.slice(0, 17).split('').reduce((acc, c, i) => acc + (+c) * weights[i], 0)
  if (checks[sum % 11] !== s[17].toUpperCase()) { error.value = t('id-card-invalid'); return }
  const year = +s.slice(6, 10), month = +s.slice(10, 12), day = +s.slice(12, 14)
  const birth = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const gender = +s[16] % 2 === 1 ? t('male') : t('female')
  const age = new Date().getFullYear() - year - (new Date().getMonth() + 1 < month || (new Date().getMonth() + 1 === month && new Date().getDate() < day) ? 1 : 0)
  const zodiac = zodiacs[(year - 4) % 12]
  const region = regions[+s.slice(0, 2)] || '—'
  info.birth = birth; info.gender = gender; info.age = age; info.zodiac = zodiac
  info.constellation = constellation(month, day); info.region = region
}
</script>