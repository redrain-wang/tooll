<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">💘 {{ t('zodiac-match') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('zodiac-match-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-sm font-medium" style="color:var(--text-secondary)">{{ t('person-a') }}</label>
          <select v-model="a" class="tool-input w-full mt-1">
            <option v-for="z in zodiacs" :key="z" :value="z">{{ z }}</option>
          </select>
        </div>
        <div>
          <label class="text-sm font-medium" style="color:var(--text-secondary)">{{ t('person-b') }}</label>
          <select v-model="b" class="tool-input w-full mt-1">
            <option v-for="z in zodiacs" :key="z" :value="z">{{ z }}</option>
          </select>
        </div>
      </div>

      <div v-if="score != null" class="pt-3 border-t text-center" style="border-color:var(--border)">
        <div class="text-xs mb-1" style="color:var(--text-secondary)">{{ t('compatibility') }}</div>
        <div class="text-4xl font-bold mb-3" :style="{ color: scoreColor }">{{ score }}%</div>
        <div class="h-3 rounded-full overflow-hidden max-w-64 mx-auto" style="background:var(--bg);border:1px solid var(--border)">
          <div class="h-full" :style="{ width: score + '%', background: scoreColor }"></div>
        </div>
        <div class="mt-3 text-sm" style="color:var(--text-secondary)">{{ verdict }}</div>
        <div class="text-xs mt-2" style="color:var(--text-secondary)">{{ t('zodiac-match-note') }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { t } from '../../i18n'

const zodiacs = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
const a = ref('龙')
const b = ref('兔')

const base = {
  鼠: { 牛: 95, 龙: 90, 猴: 88, 蛇: 75, 兔: 70, 猪: 92, 虎: 60, 羊: 65, 马: 68, 鸡: 72, 狗: 80, 鼠: 55 },
  牛: { 鼠: 95, 蛇: 92, 鸡: 90, 兔: 78, 猴: 60, 牛: 50, 龙: 72, 马: 68, 羊: 82, 狗: 66, 猪: 85, 虎: 55 },
  虎: { 马: 90, 狗: 92, 猪: 80, 兔: 60, 龙: 62, 猴: 68, 牛: 55, 羊: 70, 蛇: 65, 鸡: 75, 鼠: 60, 虎: 45 },
  兔: { 狗: 88, 猪: 90, 羊: 92, 鼠: 70, 牛: 78, 龙: 58, 蛇: 82, 马: 55, 猴: 60, 鸡: 50, 虎: 60, 兔: 48 },
  龙: { 鼠: 90, 猴: 92, 鸡: 75, 牛: 72, 蛇: 95, 马: 80, 羊: 65, 猪: 60, 兔: 58, 狗: 55, 虎: 62, 龙: 40 },
  蛇: { 牛: 92, 龙: 95, 鸡: 90, 猴: 82, 马: 88, 羊: 60, 兔: 82, 狗: 55, 鼠: 75, 猪: 65, 虎: 65, 蛇: 42 },
  马: { 虎: 90, 羊: 92, 狗: 85, 蛇: 88, 兔: 55, 牛: 68, 龙: 80, 猴: 60, 猪: 58, 鸡: 70, 鼠: 68, 马: 45 },
  羊: { 兔: 92, 马: 92, 猪: 90, 牛: 82, 狗: 75, 猴: 65, 鸡: 70, 蛇: 60, 鼠: 65, 虎: 70, 龙: 65, 羊: 50 },
  猴: { 鼠: 88, 龙: 92, 蛇: 82, 兔: 60, 虎: 68, 牛: 60, 羊: 65, 鸡: 80, 马: 60, 狗: 72, 猪: 78, 猴: 48 },
  鸡: { 蛇: 90, 牛: 90, 龙: 75, 猴: 80, 猪: 55, 马: 70, 虎: 75, 兔: 50, 狗: 82, 羊: 70, 鼠: 72, 鸡: 40 },
  狗: { 虎: 92, 兔: 88, 马: 85, 羊: 75, 猪: 95, 蛇: 55, 牛: 66, 猴: 72, 龙: 55, 鸡: 82, 鼠: 80, 狗: 45 },
  猪: { 虎: 80, 兔: 90, 羊: 90, 狗: 95, 牛: 85, 马: 58, 龙: 60, 猴: 78, 鸡: 55, 鼠: 92, 蛇: 65, 猪: 50 },
}

const score = computed(() => base[a.value]?.[b.value] ?? 50)
const scoreColor = computed(() => score.value >= 85 ? '#22c55e' : score.value >= 70 ? '#eab308' : '#ef4444')
const verdict = computed(() => {
  if (score.value >= 85) return t('match-great')
  if (score.value >= 70) return t('match-good')
  if (score.value >= 50) return t('match-ok')
  return t('match-poor')
})
</script>