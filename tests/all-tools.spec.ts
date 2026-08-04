import { test, expect } from '@playwright/test'

// All 77 tool paths from the router, verified programmatically
const toolPaths = [
  '/aes-encrypt', '/barcode', '/base64', '/case-converter', '/char-info', '/clipboard',
  '/code-formatter', '/color-blind', '/color-contrast', '/color-converter', '/color-extract',
  '/color-palette', '/countdown', '/cron-generator', '/css-minify', '/date-calc', '/device-info',
  '/favicon-gen', '/gradient-generator', '/hash-generator', '/hex-rgb', '/html-escape', '/html-formatter',
  '/image-base64', '/image-compress', '/image-editor', '/image-info', '/js-minify', '/json-formatter',
  '/json-schema-gen', '/json-to-csv', '/json-tree', '/jwt-decoder', '/lorem-ipsum', '/markdown',
  '/md-to-html', '/meta-tag-gen', '/morse-code', '/notepad', '/number-base', '/number-chinese',
  '/password-generator', '/password-strength', '/password-vault', '/pomodoro', '/qr-code', '/qr-scanner',
  '/random-number', '/regex-builder', '/regex-cheatsheet', '/regex-lib', '/regex-tester', '/regex-visual',
  '/rmb-uppercase', '/rsa-generator', '/speed-test', '/stopwatch', '/svg-editor', '/table-generator',
  '/text-ascii', '/text-compare', '/text-dedup', '/text-diff', '/text-replace', '/text-reverse',
  '/text-sort', '/text-stats', '/text-to-slug', '/timestamp', '/translator', '/unit-converter',
  '/url-encoder', '/url-parser', '/user-agent', '/uuid-generator', '/word-counter', '/xml-formatter'
]

// Shared page-load test for all tools
for (const path of toolPaths) {
  test(`loads ${path} without 404 or i18n key leakage`, async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('pageerror', err => consoleErrors.push(err.message))
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()) })

    await page.goto(path, { waitUntil: 'networkidle' })

    // Should not show 404 / not-found page
    await expect(page.locator('body')).not.toContainText('页面不存在', { timeout: 5000 })
    await expect(page.locator('body')).not.toContainText('Page not found', { timeout: 5000 })
    await expect(page.locator('body')).not.toContainText('not-found', { timeout: 5000 })

    // Should contain at least one interactive element
    const hasControl = await page.locator('textarea, input, select, button, canvas').count() > 0
    expect(hasControl, `${path} has no interactive controls`).toBeTruthy()

    // No i18n key leakage (raw keys like xxx-desc, xxx-placeholder, etc.)
    const bodyText = await page.locator('body').textContent() || ''
    const rawKeyPatterns = [/-desc\b/, /-placeholder\b/, /-hint\b/, /-result\b/, /-gen-desc\b/]
    for (const pattern of rawKeyPatterns) {
      expect(bodyText).not.toMatch(pattern)
    }

    expect(consoleErrors).toEqual([])
  })
}

// Functional smoke tests for a representative subset of simple tools
const functionalTests = [
  {
    path: '/json-formatter',
    input: 'textarea',
    value: '{"a":1,"b":2}',
    action: 'button:has-text("格式化")',
    check: async (page) => page.locator('textarea').nth(1).inputValue()
  },
  {
    path: '/base64',
    input: 'textarea',
    value: 'hello',
    action: 'button:has-text("编码")',
    check: async (page) => page.locator('textarea').nth(1).inputValue()
  },
  {
    path: '/url-encoder',
    input: 'textarea',
    value: 'hello world',
    action: 'button:has-text("encodeURI")',
    check: async (page) => page.locator('textarea').nth(1).inputValue()
  },
  {
    path: '/uuid-generator',
    action: 'button:has-text("生成 UUID")',
    check: async (page) => page.locator('code').first().textContent()
  },
  {
    path: '/qr-code',
    input: 'input',
    value: 'hello',
    check: async (page) => page.locator('img[alt="QR Code"]').getAttribute('src')
  }
]

for (const tc of functionalTests) {
  test(`${tc.path} functional smoke`, async ({ page }) => {
    await page.goto(tc.path, { waitUntil: 'networkidle' })
    if (tc.input && tc.value) {
      await page.locator(tc.input).first().fill(tc.value)
    }
    if (tc.action) {
      await page.locator(tc.action).first().click()
    }
    await page.waitForTimeout(500)
    const value = await tc.check(page)
    expect(value).toBeTruthy()
    if (tc.path === '/base64') expect(value).toContain('aGVsbG8=')
    if (tc.path === '/url-encoder') expect(value).toContain('hello%20world')
    if (tc.path === '/json-formatter') expect(value).toContain('"a": 1')
    if (tc.path === '/uuid-generator') expect(value).toMatch(/[0-9a-f-]{36}/i)
  })
}

// API smoke tests for backend-dependent tools

test('translation API works', async ({ request }) => {
  const res = await request.post('http://localhost:8089/api/translate', {
    data: { q: 'hello', source: 'en', target: 'zh' }
  })
  expect(res.status()).toBe(200)
  const json = await res.json()
  expect(json.translatedText).toContain('你好')
})

test('RSA generation API works', async ({ request }) => {
  const res = await request.post('http://localhost:8089/api/rsa/generate', {
    data: { keySize: 512 }
  })
  expect(res.status()).toBe(200)
  const json = await res.json()
  expect(json.public).toContain('BEGIN PUBLIC KEY')
})
