<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">💳 {{ t('business-card') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('business-card-desc') }}</p>

    <div class="card p-6 space-y-4 max-w-2xl">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-sm font-medium" style="color:var(--text-secondary)">{{ t('name') }}</label>
          <input v-model.trim="name" class="tool-input w-full mt-1" placeholder="张三">
        </div>
        <div>
          <label class="text-sm font-medium" style="color:var(--text-secondary)">{{ t('job-title') }}</label>
          <input v-model.trim="title" class="tool-input w-full mt-1" placeholder="产品经理">
        </div>
        <div class="col-span-2">
          <label class="text-sm font-medium" style="color:var(--text-secondary)">{{ t('company') }}</label>
          <input v-model.trim="company" class="tool-input w-full mt-1" placeholder="某某科技有限公司">
        </div>
        <div class="col-span-2">
          <label class="text-sm font-medium" style="color:var(--text-secondary)">{{ t('phone') }}</label>
          <input v-model.trim="phone" class="tool-input w-full mt-1" placeholder="138 0000 0000">
        </div>
        <div class="col-span-2">
          <label class="text-sm font-medium" style="color:var(--text-secondary)">{{ t('email') }}</label>
          <input v-model.trim="email" class="tool-input w-full mt-1" placeholder="name@example.com">
        </div>
      </div>

      <div class="pt-3 border-t space-y-3" style="border-color:var(--border)">
        <canvas ref="canvas" width="900" height="540" class="w-full rounded-lg" style="border:1px solid var(--border)"></canvas>
        <button @click="download" class="btn-primary">⬇️ {{ t('export-png') }}</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue'
import { t } from '../../i18n'

const name = ref('张三')
const title = ref('产品经理')
const company = ref('某某科技有限公司')
const phone = ref('138 0000 0000')
const email = ref('name@example.com')
const canvas = ref(null)

function draw() {
  const cv = canvas.value
  if (!cv) return
  const ctx = cv.getContext('2d')
  const W = 900, H = 540
  const grad = ctx.createLinearGradient(0, 0, W, 0)
  grad.addColorStop(0, '#1e1b4b')
  grad.addColorStop(0.6, '#312e81')
  grad.addColorStop(1, '#1e40af')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = '#c7d2fe'
  ctx.fillRect(0, 0, 14, H)
  ctx.fillStyle = '#f8fafc'
  ctx.font = 'bold 40px sans-serif'
  ctx.fillText(company.value || 'COMPANY', 70, 90)
  ctx.font = 'bold 72px sans-serif'
  ctx.fillText(name.value || '—', 70, 220)
  ctx.fillStyle = '#a5b4fc'
  ctx.font = '34px sans-serif'
  ctx.fillText(title.value || '', 70, 275)
  ctx.font = '30px sans-serif'
  ctx.fillStyle = '#cbd5e1'
  let y = 380
  if (phone.value) { ctx.fillText('📞 ' + phone.value, 70, y); y += 46 }
  if (email.value) { ctx.fillText('✉️ ' + email.value, 70, y) }
}
function download() {
  const a = document.createElement('a')
  a.href = canvas.value.toDataURL('image/png')
  a.download = 'business-card.png'
  a.click()
}
watch([name, title, company, phone, email], draw)
onMounted(draw)
</script>