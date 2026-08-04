<template>
  <div class="tool-container">
    <h1 class="text-2xl font-bold mb-2">{{ t('qrbeautify-title') }}</h1>
    <p class="mb-6" style="color:var(--text-secondary)">{{ t('qrbeautify-desc') }}</p>
    <div class="space-y-4">
      <input v-model="text" class="tool-input" :placeholder="t('qrcode-placeholder')" @input="generate">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="card">
          <label class="text-xs font-medium block mb-1" style="color:var(--text-secondary)">{{ t('qrbeautify-fg') }}</label>
          <div class="flex items-center gap-2">
            <input type="color" v-model="fgColor" class="w-8 h-8 rounded cursor-pointer border-0">
            <input v-model="fgColor" class="tool-input text-xs font-mono flex-1" @input="generate">
          </div>
        </div>
        <div class="card">
          <label class="text-xs font-medium block mb-1" style="color:var(--text-secondary)">{{ t('qrbeautify-bg') }}</label>
          <div class="flex items-center gap-2">
            <input type="color" v-model="bgColor" class="w-8 h-8 rounded cursor-pointer border-0">
            <input v-model="bgColor" class="tool-input text-xs font-mono flex-1" @input="generate">
          </div>
        </div>
        <div class="card">
          <label class="text-xs font-medium block mb-1" style="color:var(--text-secondary)">{{ t('qrbeautify-ec') }}</label>
          <select v-model="ecLevel" class="tool-input text-sm" @change="generate">
            <option value="L">L (7%)</option>
            <option value="M">M (15%)</option>
            <option value="Q">Q (25%)</option>
            <option value="H">H (30%)</option>
          </select>
        </div>
        <div class="card">
          <label class="text-xs font-medium block mb-1" style="color:var(--text-secondary)">{{ t('qrbeautify-size') }}</label>
          <input type="range" v-model.number="qrSize" min="200" max="800" step="50" class="w-full" @input="generate">
          <span class="text-xs" style="color:var(--primary)">{{ qrSize }}px</span>
        </div>
      </div>
      <div class="card text-center cursor-pointer" @click="$refs.logoInput.click()" style="border:2px dashed var(--border)">
        <input ref="logoInput" type="file" accept="image/*" class="hidden" @change="handleLogo">
        <p v-if="!logoUrl" class="text-sm" style="color:var(--text-secondary)">{{ t('qrbeautify-logo-hint') }}</p>
        <div v-else class="flex items-center justify-center gap-3">
          <img :src="logoUrl" class="w-10 h-10 rounded object-cover">
          <span class="text-sm" style="color:var(--text)">{{ t('qrbeautify-logo-change') }}</span>
          <button @click.stop="removeLogo" class="text-sm" style="color:var(--text-secondary)">✕</button>
        </div>
      </div>
      <div v-if="canvasReady" class="card flex flex-col items-center gap-4">
        <canvas ref="qrCanvas" :width="qrSize" :height="qrSize" class="rounded-lg" style="border:1px solid var(--border)"></canvas>
        <div class="flex gap-3">
          <button @click="download" class="btn-primary text-sm">📥 {{ t('download-qr') }}</button>
          <button @click="copyImage" class="btn-secondary text-sm">📋 {{ t('copy-link') }}</button>
        </div>
      </div>
      <div v-if="error" class="card text-center" style="color:#ef4444">
        <p class="text-sm">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { t } from '../../i18n'

const text = ref('')
const fgColor = ref('#000000')
const bgColor = ref('#ffffff')
const ecLevel = ref('M')
const qrSize = ref(400)
const logoUrl = ref('')
const logoFile = ref(null)
const qrCanvas = ref(null)
const canvasReady = ref(false)
const error = ref('')

function handleLogo(e) {
  const file = e.target.files[0]
  if (!file) return
  logoFile.value = file
  logoUrl.value = URL.createObjectURL(file)
  generate()
}

function removeLogo() {
  logoUrl.value = ''
  logoFile.value = null
  generate()
}

function download() {
  if (!qrCanvas.value) return
  const a = document.createElement('a')
  a.href = qrCanvas.value.toDataURL('image/png')
  a.download = 'qr-beautified.png'
  a.click()
}

function copyImage() {
  if (!qrCanvas.value) return
  qrCanvas.value.toBlob(blob => {
    navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
    window.showToast?.(t('copied'))
  })
}

function generate() {
  error.value = ''
  if (!text.value) { canvasReady.value = false; return }
  try {
    const qr = new QrEncoder(text.value, ecLevel.value)
    nextTick(() => drawQr(qr))
  } catch (e) {
    error.value = e.message || 'Error generating QR code'
    canvasReady.value = false
  }
}

async function drawQr(qr) {
  canvasReady.value = true
  await nextTick()
  const canvas = qrCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const size = qrSize.value
  canvas.width = size
  canvas.height = size
  const modules = qr.modules
  const n = modules.length
  const margin = 4
  const cellSize = (size - margin * 2) / n
  ctx.fillStyle = bgColor.value
  ctx.fillRect(0, 0, size, size)
  ctx.fillStyle = fgColor.value
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (modules[r][c]) {
        ctx.fillRect(margin + c * cellSize, margin + r * cellSize, cellSize + 0.5, cellSize + 0.5)
      }
    }
  }
  if (logoUrl.value) {
    const img = new Image()
    img.onload = () => {
      const logoSize = size * 0.22
      const logoX = (size - logoSize) / 2
      const logoY = (size - logoSize) / 2
      ctx.fillStyle = bgColor.value
      const pad = logoSize * 0.12
      ctx.fillRect(logoX - pad, logoY - pad, logoSize + pad * 2, logoSize + pad * 2)
      ctx.drawImage(img, logoX, logoY, logoSize, logoSize)
    }
    img.src = logoUrl.value
  }
}

// ── QR Code Encoder (Pure JS) ──

const EC_PARAMS = {
  L: [
    [19, 7], [34, 10], [55, 15], [80, 20], [108, 26], [136, 18, 2],
    [156, 20, 2], [194, 24, 4], [232, 30, 4], [274, 18, 4]
  ],
  M: [
    [16, 10], [28, 16], [44, 26], [64, 18, 2], [86, 24, 4],
    [108, 16, 4], [124, 18, 6], [154, 22, 6], [182, 22, 8], [216, 26, 8]
  ],
  Q: [
    [13, 13], [22, 22], [34, 18, 2], [48, 26, 4], [62, 18, 2],
    [76, 20, 4], [88, 24, 4], [110, 30, 6], [132, 22, 8], [154, 22, 10]
  ],
  H: [
    [9, 17], [16, 28], [26, 22, 2], [36, 16, 4], [46, 22, 4],
    [60, 28, 4], [66, 26, 6], [86, 30, 8], [100, 24, 10], [122, 28, 12]
  ]
}

const EC_CODEWORDS = { L: 7, M: 10, Q: 13, H: 17 }

function getEcParams(ver, ec) {
  const p = EC_PARAMS[ec][ver - 1]
  return { totalCodewords: p[0], ecPerBlock: p[1], group2Blocks: p[2] || 0 }
}

class QrEncoder {
  constructor(data, ecLevel) {
    this.ec = ecLevel
    this.data = new TextEncoder().encode(data)
    this.ver = this.getMinVersion()
    if (!this.ver) throw new Error('Data too long for QR code')
    this.size = this.ver * 4 + 17
    this.modules = Array.from({ length: this.size }, () => Array(this.size).fill(false))
    this.reserved = Array.from({ length: this.size }, () => Array(this.size).fill(false))
    this.encode()
  }

  getMinVersion() {
    const len = this.data.length
    for (let v = 1; v <= 10; v++) {
      const cap = this.getCapacity(v)
      if (len <= cap) return v
    }
    return null
  }

  getCapacity(ver) {
    const { totalCodewords, ecPerBlock, group2Blocks } = getEcParams(ver, this.ec)
    const g1Count = this.getGroup1Blocks(ver)
    const g1Data = this.getGroup1Codewords(ver)
    let totalData = g1Count * g1Data
    if (group2Blocks > 0) totalData += group2Blocks * (g1Data + 1)
    return totalData - 2
  }

  getGroup1Blocks(ver) {
    const params = {
      L: [1, 1, 1, 1, 1, 2, 2, 2, 2, 2],
      M: [1, 1, 1, 2, 2, 4, 4, 4, 5, 5],
      Q: [1, 1, 2, 2, 4, 4, 6, 6, 8, 8],
      H: [1, 1, 2, 4, 4, 4, 5, 6, 8, 10]
    }
    return params[this.ec][ver - 1]
  }

  getGroup1Codewords(ver) {
    const params = {
      L: [19, 34, 55, 80, 108, 136, 156, 194, 232, 274],
      M: [16, 28, 44, 64, 86, 108, 124, 154, 182, 216],
      Q: [13, 22, 34, 48, 62, 76, 88, 110, 132, 154],
      H: [9, 16, 26, 36, 46, 60, 66, 86, 100, 122]
    }
    return params[this.ec][ver - 1]
  }

  encode() {
    this.placeFinder()
    this.placeTimings()
    this.placeDarkModule()
    this.placeFormat()
    if (this.ver >= 7) this.placeVersion()
    const dataBits = this.getDataBits()
    const ecBits = this.getEcBits(dataBits)
    const allBits = dataBits + ecBits
    const bitStream = this.buildBitStream(dataBits, ecBits)
    this.placeData(bitStream)
    this.applyBestMask()
    this.placeFormat()
    if (this.ver >= 7) this.placeVersion()
  }

  getDataBits() {
    const { totalCodewords, ecPerBlock, group2Blocks } = getEcParams(this.ver, this.ec)
    const g1Count = this.getGroup1Blocks(this.ver)
    const g1Data = this.getGroup1Codewords(this.ver)
    let totalData = g1Count * g1Data
    if (group2Blocks > 0) totalData += group2Blocks * (g1Data + 1)
    return totalData * 8
  }

  getEcBits(dataBits) {
    const { ecPerBlock, group2Blocks } = getEcParams(this.ver, this.ec)
    const g1Count = this.getGroup1Blocks(this.ver)
    const totalBlocks = g1Count + group2Blocks
    return totalBlocks * ecPerBlock * 8
  }

  buildBitStream(dataBits, ecBits) {
    const { ecPerBlock, group2Blocks } = getEcParams(this.ver, this.ec)
    const g1Count = this.getGroup1Blocks(this.ver)
    const g1Data = this.getGroup1Codewords(this.ver)
    const totalBlocks = g1Count + group2Blocks
    const dataBytes = []
    const dataLen = (dataBits - 16) / 8
    dataBytes.push(0x40 | ((dataLen >> 4) & 0x0f))
    dataBytes.push((dataLen << 4) & 0xf0)
    let offset = 4
    for (const b of this.data) {
      dataBytes.push(b)
    }
    const padBytes = []
    let pad = true
    while (padBytes.length < (dataBits / 8 - dataBytes.length)) {
      padBytes.push(pad ? 0xec : 0x11)
      pad = !pad
    }
    const allData = [...dataBytes, ...padBytes].slice(0, dataBits / 8)
    const dataBlocks = []
    let idx = 0
    for (let i = 0; i < g1Count; i++) {
      dataBlocks.push(allData.slice(idx, idx + g1Data))
      idx += g1Data
    }
    for (let i = 0; i < group2Blocks; i++) {
      dataBlocks.push(allData.slice(idx, idx + g1Data + 1))
      idx += g1Data + 1
    }
    const ecBlocks = []
    const ecTotal = ecPerBlock * totalBlocks
    for (let i = 0; i < totalBlocks; i++) {
      const ec = rsEncode(dataBlocks[i], ecPerBlock)
      ecBlocks.push(ec)
    }
    const result = []
    const maxDataLen = g1Count > 0 ? g1Data : g1Data + 1
    for (let i = 0; i < maxDataLen; i++) {
      for (let b = 0; b < totalBlocks; b++) {
        if (i < dataBlocks[b].length) result.push(dataBlocks[b][i])
      }
    }
    for (let i = 0; i < ecPerBlock; i++) {
      for (let b = 0; b < totalBlocks; b++) {
        if (i < ecBlocks[b].length) result.push(ecBlocks[b][i])
      }
    }
    let bits = ''
    for (const byte of result) {
      bits += byte.toString(2).padStart(8, '0')
    }
    return bits
  }

  placeFinder() {
    const positions = [
      [0, 0], [0, this.size - 7], [this.size - 7, 0]
    ]
    for (const [r, c] of positions) {
      for (let dr = -1; dr <= 7; dr++) {
        for (let dc = -1; dc <= 7; dc++) {
          const rr = r + dr, cc = c + dc
          if (rr < 0 || rr >= this.size || cc < 0 || cc >= this.size) continue
          const inFinder = dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6
          const inBorder = (dr === 0 || dr === 6 || dc === 0 || dc === 6)
          const inInner = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4
          this.modules[rr][cc] = inFinder && (inBorder || inInner)
          this.reserved[rr][cc] = true
        }
      }
    }
  }

  placeTimings() {
    for (let i = 8; i < this.size - 8; i++) {
      this.modules[6][i] = i % 2 === 0
      this.reserved[6][i] = true
      this.modules[i][6] = i % 2 === 0
      this.reserved[i][6] = true
    }
  }

  placeDarkModule() {
    this.modules[4 * this.ver + 9][8] = true
    this.reserved[4 * this.ver + 9][8] = true
  }

  placeFormat() {
    const ecIdx = { L: 1, M: 0, Q: 3, H: 2 }[this.ec]
    const mask = this.bestMask || 0
    const formatBits = (ecIdx << 3) | mask
    let format = formatBits << 10
    let tmp = format
    for (let i = 4; i >= 0; i--) {
      if (tmp & (1 << (i + 10))) format ^= (0x537 << i)
    }
    format = (formatBits << 10) | format
    format ^= 0x5412
    const positions1 = [
      [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8],
      [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8]
    ]
    const positions2 = [
      [this.size - 1, 8], [this.size - 2, 8], [this.size - 3, 8], [this.size - 4, 8],
      [this.size - 5, 8], [this.size - 6, 8], [this.size - 7, 8], [8, this.size - 8],
      [8, this.size - 7], [8, this.size - 6], [8, this.size - 5], [8, this.size - 4],
      [8, this.size - 3], [8, this.size - 2], [8, this.size - 1]
    ]
    for (let i = 0; i < 15; i++) {
      const bit = (format >> i) & 1
      this.modules[positions1[i][0]][positions1[i][1]] = !!bit
      this.reserved[positions1[i][0]][positions1[i][1]] = true
      this.modules[positions2[i][0]][positions2[i][1]] = !!bit
      this.reserved[positions2[i][0]][positions2[i][1]] = true
    }
  }

  placeVersion() {
    if (this.ver < 7) return
    let version = this.ver * 4096 + 0
    for (let i = 5; i >= 0; i--) {
      let rem = 0
      for (let b = 0; b < 6; b++) {
        rem = (rem << 1) | ((version >> (i * 6 + b)) & 1)
      }
      for (let j = 5; j >= 0; j--) {
        rem = (rem << 1) | ((version >> j) & 1)
      }
      version = rem
    }
    for (let i = 0; i < 18; i++) {
      const r = Math.floor(i / 3)
      const c = i % 3 + this.size - 11
      const bit = (version >> i) & 1
      this.modules[r][c] = !!bit
      this.reserved[r][c] = true
      this.modules[c][r] = !!bit
      this.reserved[c][r] = true
    }
  }

  placeData(bits) {
    let bitIdx = 0
    let col = this.size - 1
    let upward = true
    while (col >= 0) {
      if (col === 6) col--
      const rows = upward
        ? Array.from({ length: this.size }, (_, i) => this.size - 1 - i)
        : Array.from({ length: this.size }, (_, i) => i)
      for (const row of rows) {
        for (let dc = 0; dc <= 1; dc++) {
          const c = col - dc
          if (c < 0) continue
          if (this.reserved[row][c]) continue
          if (bitIdx < bits.length) {
            this.modules[row][c] = bits[bitIdx] === '1'
            bitIdx++
          }
        }
      }
      col -= 2
      upward = !upward
    }
  }

  applyBestMask() {
    let bestMask = 0
    let bestPenalty = Infinity
    for (let m = 0; m < 8; m++) {
      this.bestMask = m
      this.placeFormat()
      if (this.ver >= 7) this.placeVersion()
      const penalty = this.calcPenalty()
      if (penalty < bestPenalty) {
        bestPenalty = penalty
        bestMask = m
      }
    }
    this.bestMask = bestMask
  }

  calcPenalty() {
    let penalty = 0
    for (let r = 0; r < this.size; r++) {
      let count = 1
      for (let c = 1; c < this.size; c++) {
        if (this.modules[r][c] === this.modules[r][c - 1]) {
          count++
          if (count === 5) penalty += 3
          else if (count > 5) penalty++
        } else {
          count = 1
        }
      }
    }
    for (let c = 0; c < this.size; c++) {
      let count = 1
      for (let r = 1; r < this.size; r++) {
        if (this.modules[r][c] === this.modules[r - 1][c]) {
          count++
          if (count === 5) penalty += 3
          else if (count > 5) penalty++
        } else {
          count = 1
        }
      }
    }
    for (let r = 0; r < this.size - 1; r++) {
      for (let c = 0; c < this.size - 1; c++) {
        const v = this.modules[r][c]
        if (v === this.modules[r][c + 1] && v === this.modules[r + 1][c] && v === this.modules[r + 1][c + 1]) {
          penalty += 3
        }
      }
    }
    return penalty
  }
}

// ── Reed-Solomon over GF(256) ──

const GF_EXP = new Uint8Array(512)
const GF_LOG = new Uint8Array(256)
;(function initGf() {
  let x = 1
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x
    GF_LOG[x] = i
    x = (x << 1) ^ (x & 0x80 ? 0x11d : 0)
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255]
})()

function gfMul(a, b) {
  if (a === 0 || b === 0) return 0
  return GF_EXP[GF_LOG[a] + GF_LOG[b]]
}

function rsEncode(data, ecLen) {
  const gen = [1]
  for (let i = 0; i < ecLen; i++) {
    const newGen = new Array(gen.length + 1).fill(0)
    for (let j = 0; j < gen.length; j++) {
      newGen[j] ^= gen[j]
      newGen[j + 1] ^= gfMul(gen[j], GF_EXP[i])
    }
    gen.length = newGen.length
    for (let j = 0; j < gen.length; j++) gen[j] = newGen[j]
  }
  const msg = new Array(data.length + ecLen).fill(0)
  for (let i = 0; i < data.length; i++) msg[i] = data[i]
  for (let i = 0; i < data.length; i++) {
    const coef = msg[i]
    if (coef !== 0) {
      for (let j = 1; j < gen.length; j++) {
        msg[i + j] ^= gfMul(gen[j], coef)
      }
    }
  }
  return msg.slice(data.length)
}
</script>
