<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('sql-builder') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('sql-builder-desc') }}</p>

    <div class="mb-4 flex gap-2 flex-wrap">
      <button v-for="p in presets" :key="p.k" @click="loadPreset(p.k)" class="btn-secondary">{{ p.label }}</button>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <div class="space-y-4">
        <div class="card p-4 space-y-3">
          <div class="flex items-center gap-3">
            <label class="text-sm font-medium whitespace-nowrap" style="color:var(--text-secondary)">SELECT</label>
            <select v-model="table" @change="loadFields" class="tool-input flex-1">
              <option v-for="t in presets" :key="t.k" :value="t.k">{{ t.k }}</option>
            </select>
          </div>

          <div>
            <div class="mb-2 text-sm font-medium" style="color:var(--text-secondary)">{{ t('fields') }}</div>
            <div class="flex flex-wrap gap-2">
              <label v-for="f in fields" :key="f.name" class="flex items-center gap-1.5 text-sm border rounded-lg px-2.5 py-1.5 cursor-pointer" style="border-color:var(--border)">
                <input type="checkbox" v-model="selectedFields" :value="f.name" class="w-3.5 h-3.5">
                {{ f.name }}
                <span class="text-xs opacity-50">{{ f.type }}</span>
              </label>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <label class="text-sm font-medium whitespace-nowrap" style="color:var(--text-secondary)">WHERE</label>
            <select v-model="whereField" class="tool-input flex-1">
              <option value="">{{ t('select-field') }}</option>
              <option v-for="f in fields" :key="f.name" :value="f.name">{{ f.name }}</option>
            </select>
            <select v-model="whereOp" class="tool-input" style="width:auto">
              <option v-for="op in ops" :key="op" :value="op">{{ op }}</option>
            </select>
            <input v-model="whereValue" class="tool-input" style="width:110px" :placeholder="t('value')">
          </div>

          <div class="flex items-center gap-2">
            <label class="text-sm font-medium whitespace-nowrap" style="color:var(--text-secondary)">ORDER BY</label>
            <select v-model="orderField" class="tool-input flex-1">
              <option value="">{{ t('select-field') }}</option>
              <option v-for="f in fields" :key="f.name" :value="f.name">{{ f.name }}</option>
            </select>
            <select v-model="orderDir" class="tool-input" style="width:auto">
              <option>ASC</option>
              <option>DESC</option>
            </select>
          </div>

          <div class="flex items-center gap-2">
            <label class="text-sm font-medium whitespace-nowrap" style="color:var(--text-secondary)">LIMIT</label>
            <input type="number" min="1" v-model.number="limit" class="tool-input" style="width:90px" placeholder="100">
            <span v-if="groupBy" class="text-xs opacity-60">GROUP BY {{ groupBy }}</span>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div>
          <div class="mb-2 text-sm font-medium" style="color:var(--text-secondary)">SQL</div>
          <textarea :value="sql" readonly class="tool-input h-64 font-mono text-sm" style="background:var(--card-bg)"></textarea>
        </div>
        <div v-if="table && groupBy" class="card p-3 text-sm" style="color:var(--text-secondary)">
          {{ t('sql-builder-hint') }}
        </div>
        <div class="flex gap-3">
          <button @click="copy" class="btn-secondary">📋 {{ t('copy') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import { t } from '../../i18n'

const presets = [
  { k: 'users', label: 'users / 用户表', fields: [
    { name: 'id', type: 'INT' }, { name: 'name', type: 'VARCHAR' }, { name: 'email', type: 'VARCHAR' },
    { name: 'age', type: 'INT' }, { name: 'role', type: 'VARCHAR' }, { name: 'created_at', type: 'DATETIME' },
  ]},
  { k: 'orders', label: 'orders / 订单表', fields: [
    { name: 'order_id', type: 'INT' }, { name: 'user_id', type: 'INT' }, { name: 'total', type: 'DECIMAL' },
    { name: 'status', type: 'VARCHAR' }, { name: 'created_at', type: 'DATETIME' },
  ]},
  { k: 'products', label: 'products / 商品表', fields: [
    { name: 'sku', type: 'VARCHAR' }, { name: 'name', type: 'VARCHAR' }, { name: 'price', type: 'DECIMAL' },
    { name: 'stock', type: 'INT' }, { name: 'category', type: 'VARCHAR' },
  ]},
]

const table = ref('users')
const fields = ref([])
const selectedFields = ref([])
const whereField = ref('')
const whereOp = ref('=')
const whereValue = ref('')
const orderField = ref('')
const orderDir = ref('ASC')
const limit = ref(100)
const ops = ['=', '!=', '>', '>=', '<', '<=', 'LIKE', 'IN']

function loadFields() {
  const p = presets.find(x => x.k === table.value)
  fields.value = p ? p.fields : []
  selectedFields.value = p ? p.fields.map(f => f.name) : []
  whereField.value = ''
  whereValue.value = ''
  orderField.value = ''
}
loadFields()

const groupBy = computed(() => fields.value.find(f => selectedFields.value.includes(f.name) && /group|cat|type|status|role|category/i.test(f.name))?.name || '')

const sql = computed(() => {
  const cols = selectedFields.value.length ? selectedFields.value.join(', ') : '*'
  let s = `SELECT ${cols}\nFROM ${table.value}`
  if (groupBy.value && selectedFields.value.length > 1) s += `\nGROUP BY ${groupBy.value}`
  if (whereField.value) {
    let v = whereValue.value
    if (whereOp.value === 'IN') v = `(${(whereValue.value || '').split(',').map(x => x.trim()).filter(Boolean).map(x => `'${x}'`).join(', ')})`
    else if (/^[0-9]+(\.[0-9]+)?$/.test(v) || v === '') v = v || 'value'
    else v = `'${v.replace(/'/g, "''")}'`
    s += `\nWHERE ${whereField.value} ${whereOp.value} ${v}`
  }
  if (orderField.value) s += `\nORDER BY ${orderField.value} ${orderDir.value}`
  if (limit.value > 0) s += `\nLIMIT ${limit.value}`
  s += ';'
  return s
})

function loadPreset(k) { table.value = k; loadFields() }
function copy() { navigator.clipboard.writeText(sql.value); window.showToast?.(t('copied')) }
watch(table, loadFields)
</script>