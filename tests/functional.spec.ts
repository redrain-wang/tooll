import { test, expect } from '@playwright/test'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const testFile = join(__dirname, 'test-data.txt')
fs.writeFileSync(testFile, 'line1\nline2\nline1\nline3\n')

// Text tools: input -> output smoke tests
const textToolTests = [
  {
    path: '/text-dedup',
    input: 'a\r\na\nb\na',
    action: 'button:has-text("去重")',
    outputLocator: 'textarea:nth-of-type(2)',
    expected: 'a\nb'
  },
  {
    path: '/text-sort',
    input: 'banana\napple\ncherry',
    action: 'button:has-text("Asc")',
    outputLocator: 'textarea:nth-of-type(2)',
    expected: 'apple\nbanana\ncherry'
  },
  {
    path: '/text-reverse',
    input: 'hello',
    action: 'button:has-text("反转")',
    outputLocator: 'textarea:nth-of-type(2)',
    expected: 'olleh'
  },
  {
    path: '/case-converter',
    input: 'Hello World',
    action: 'button:has-text("Uppercase")',
    outputLocator: 'textarea:nth-of-type(2)',
    expected: 'HELLO WORLD'
  },
  {
    path: '/text-replace',
    input: 'foo bar foo',
    extra: async (page) => {
      await page.locator('input').nth(0).fill('foo')
      await page.locator('input').nth(1).fill('baz')
    },
    action: 'button:has-text("替换")',
    outputLocator: 'textarea:nth-of-type(2)',
    expected: 'baz bar baz'
  },
  {
    path: '/text-ascii',
    input: 'A',
    action: 'button:has-text("ASCII")',
    outputLocator: 'textarea:nth-of-type(2)',
    expected: '65'
  },
  {
    path: '/word-counter',
    input: 'hello world',
    action: 'button:has-text("统计")',
    assertion: async (page) => {
      await expect(page.locator('text=2 词')).toBeVisible()
    }
  },
  {
    path: '/text-stats',
    input: 'abc',
    action: 'button:has-text("统计")',
    assertion: async (page) => {
      await expect(page.locator('text=总字符')).toBeVisible()
    }
  },
  {
    path: '/markdown',
    input: '# Hello',
    action: 'button:has-text("预览")',
    assertion: async (page) => {
      await expect(page.locator('h1:has-text("Hello")')).toBeVisible()
    }
  },
  {
    path: '/md-to-html',
    input: '# Hello',
    action: 'button:has-text("转换")',
    outputLocator: 'textarea:nth-of-type(2)',
    expected: '<h1'
  },
  {
    path: '/json-formatter',
    input: '{"a":1,"b":2}',
    action: 'button:has-text("格式化")',
    outputLocator: 'textarea:nth-of-type(2)',
    expected: '"a": 1'
  },
  {
    path: '/text-diff',
    input: 'a\nb\nc',
    extra: async (page) => {
      await page.locator('textarea').nth(1).fill('a\nb\nd')
    },
    action: 'button:has-text("对比")',
    assertion: async (page) => {
      await expect(page.locator('text=diff')).toBeVisible()
    }
  },
  {
    path: '/text-compare',
    input: 'a\nb\nc',
    extra: async (page) => {
      await page.locator('textarea').nth(1).fill('a\nb\nd')
    },
    action: 'button:has-text("对比")',
    assertion: async (page) => {
      await expect(page.locator('text=差异')).toBeVisible()
    }
  },
  {
    path: '/base64',
    input: 'hello',
    action: 'button:has-text("编码")',
    outputLocator: 'textarea:nth-of-type(2)',
    expected: 'aGVsbG8='
  },
  {
    path: '/url-encoder',
    input: 'hello world',
    action: 'button:has-text("encodeURI")',
    outputLocator: 'textarea:nth-of-type(2)',
    expected: 'hello%20world'
  },
  {
    path: '/html-escape',
    input: '<div>',
    action: 'button:has-text("转义")',
    outputLocator: 'textarea:nth-of-type(2)',
    expected: '&lt;div&gt;'
  },
  {
    path: '/jwt-decoder',
    input: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    action: 'button:has-text("解析")',
    assertion: async (page) => {
      await expect(page.locator('text=John Doe')).toBeVisible()
    }
  },
  {
    path: '/xml-formatter',
    input: '<root><a>1</a></root>',
    action: 'button:has-text("格式化")',
    outputLocator: 'textarea:nth-of-type(2)',
    expected: '<root>'
  },
  {
    path: '/css-minify',
    input: 'body { color: red; }',
    action: 'button:has-text("压缩")',
    outputLocator: 'textarea:nth-of-type(2)',
    expected: 'body'
  },
  {
    path: '/js-minify',
    input: 'function a() { return 1; }',
    action: 'button:has-text("压缩")',
    outputLocator: 'textarea:nth-of-type(2)',
    expected: 'function'
  },
  {
    path: '/html-formatter',
    input: '<div><span>1</span></div>',
    action: 'button:has-text("格式化")',
    outputLocator: 'textarea:nth-of-type(2)',
    expected: '<div>'
  },
  {
    path: '/regex-tester',
    input: 'hello123',
    extra: async (page) => {
      await page.locator('input').first().fill('\\d+')
    },
    action: 'button:has-text("测试")',
    assertion: async (page) => {
      await expect(page.locator('text=123')).toBeVisible()
    }
  },
  {
    path: '/hash-generator',
    input: 'hello',
    action: 'button:has-text("生成")',
    assertion: async (page) => {
      await expect(page.locator('text=5d41402abc4b2a76b9719d911017c592')).toBeVisible()
    }
  },
  {
    path: '/number-base',
    input: '255',
    extra: async (page) => {
      await page.locator('select').first().selectOption('decimal')
      await page.locator('select').nth(1).selectOption('hex')
    },
    action: 'button:has-text("转换")',
    outputLocator: 'input[type="text"]',
    expected: 'ff'
  },
  {
    path: '/uuid-generator',
    action: 'button:has-text("生成 UUID")',
    assertion: async (page) => {
      await expect(page.locator('code')).toHaveCount(5)
    }
  },
  {
    path: '/password-generator',
    action: 'button:has-text("生成密码")',
    assertion: async (page) => {
      await expect(page.locator('text=密码长度')).toBeVisible()
    }
  },
  {
    path: '/random-number',
    input: '1',
    extra: async (page) => {
      await page.locator('input').nth(1).fill('100')
    },
    action: 'button:has-text("生成")',
    assertion: async (page) => {
      const text = await page.locator('.card, [class*="result"]').first().textContent()
      expect(Number(text)).toBeGreaterThanOrEqual(1)
    }
  },
  {
    path: '/lorem-ipsum',
    action: 'button:has-text("生成")',
    assertion: async (page) => {
      await expect(page.locator('text=Lorem ipsum')).toBeVisible()
    }
  },
  {
    path: '/text-to-slug',
    input: 'Hello World 测试',
    action: 'button:has-text("生成")',
    outputLocator: 'input',
    expected: 'hello-world'
  },
  {
    path: '/timestamp',
    action: 'button:has-text("当前时间戳")',
    assertion: async (page) => {
      await expect(page.locator('text=秒')).toBeVisible()
    }
  },
  {
    path: '/morse-code',
    input: 'SOS',
    action: 'button:has-text("编码")',
    outputLocator: 'textarea:nth-of-type(2)',
    expected: '...'
  },
  {
    path: '/unit-converter',
    input: '1',
    action: 'button:has-text("转换")',
    assertion: async (page) => {
      await expect(page.locator('text=米')).toBeVisible()
    }
  },
  {
    path: '/number-chinese',
    input: '123',
    action: 'button:has-text("转换")',
    outputLocator: 'input',
    expected: '一百二十三'
  },
  {
    path: '/rmb-uppercase',
    input: '100.5',
    action: 'button:has-text("转换")',
    outputLocator: 'input',
    expected: '壹佰元伍角'
  },
  {
    path: '/user-agent',
    assertion: async (page) => {
      await expect(page.locator('text=浏览器')).toBeVisible()
    }
  },
  {
    path: '/url-parser',
    input: 'https://example.com/path?q=1',
    action: 'button:has-text("解析")',
    assertion: async (page) => {
      await expect(page.locator('text=example.com')).toBeVisible()
    }
  },
  {
    path: '/date-calc',
    input: '2024-01-01',
    extra: async (page) => {
      await page.locator('input').nth(1).fill('2024-01-10')
    },
    action: 'button:has-text("计算")',
    assertion: async (page) => {
      await expect(page.locator('text=9')).toBeVisible()
    }
  },
  {
    path: '/color-converter',
    input: '#ff0000',
    action: 'button:has-text("转换")',
    assertion: async (page) => {
      await expect(page.locator('text=255')).toBeVisible()
    }
  },
  {
    path: '/color-palette',
    input: '#ff0000',
    action: 'button:has-text("生成")',
    assertion: async (page) => {
      await expect(page.locator('.swatch, [class*="color"]')).toHaveCount.greaterThan(0)
    }
  },
  {
    path: '/hex-rgb',
    input: '#ff0000',
    action: 'button:has-text("转换")',
    assertion: async (page) => {
      await expect(page.locator('text=255')).toBeVisible()
    }
  },
  {
    path: '/color-contrast',
    assertion: async (page) => {
      await expect(page.locator('text=对比度')).toBeVisible()
    }
  },
  {
    path: '/color-blind',
    assertion: async (page) => {
      await expect(page.locator('text=色盲')).toBeVisible()
    }
  },
  {
    path: '/device-info',
    assertion: async (page) => {
      await expect(page.locator('text=User Agent')).toBeVisible()
    }
  },
  {
    path: '/clipboard',
    input: 'test',
    action: 'button:has-text("保存")',
    assertion: async (page) => {
      await expect(page.locator('text=test')).toBeVisible()
    }
  },
  {
    path: '/char-info',
    input: 'A',
    assertion: async (page) => {
      await expect(page.locator('text=65')).toBeVisible()
    }
  },
  {
    path: '/speed-test',
    assertion: async (page) => {
      await expect(page.locator('button:has-text("开始测速")')).toBeVisible()
    }
  },
  {
    path: '/meta-tag-gen',
    input: 'Test Title',
    extra: async (page) => {
      await page.locator('textarea').nth(0).fill('Test Description')
    },
    action: 'button:has-text("生成")',
    assertion: async (page) => {
      await expect(page.locator('text=<title>')).toBeVisible()
    }
  },
  {
    path: '/qr-code',
    input: 'hello',
    assertion: async (page) => {
      await expect(page.locator('img[alt="QR Code"]')).toBeVisible()
    }
  },
  {
    path: '/barcode',
    input: '123456',
    action: 'button:has-text("生成")',
    assertion: async (page) => {
      await expect(page.locator('svg, canvas, img')).toBeVisible()
    }
  },
  {
    path: '/cron-generator',
    assertion: async (page) => {
      await expect(page.locator('text=* * * * *')).toBeVisible()
    }
  },
  {
    path: '/aes-encrypt',
    input: 'secret',
    action: 'button:has-text("加密")',
    assertion: async (page) => {
      await expect(page.locator('textarea').nth(1)).not.toBeEmpty()
    }
  },
  {
    path: '/json-to-csv',
    input: '[{"a":1},{"a":2}]',
    action: 'button:has-text("转换")',
    assertion: async (page) => {
      await expect(page.locator('text=a')).toBeVisible()
    }
  },
  {
    path: '/json-tree',
    input: '{"a":1}',
    action: 'button:has-text("解析")',
    assertion: async (page) => {
      await expect(page.locator('text=a')).toBeVisible()
    }
  },
  {
    path: '/table-generator',
    input: 'a,b\n1,2',
    action: 'button:has-text("生成")',
    assertion: async (page) => {
      await expect(page.locator('table')).toBeVisible()
    }
  },
  {
    path: '/code-formatter',
    input: 'function a(){return 1}',
    action: 'button:has-text("格式化")',
    outputLocator: 'textarea:nth-of-type(2)',
    expected: 'function'
  },
  {
    path: '/svg-editor',
    input: '<svg></svg>',
    action: 'button:has-text("预览")',
    assertion: async (page) => {
      await expect(page.locator('svg')).toHaveCount.greaterThan(0)
    }
  },
  {
    path: '/json-schema-gen',
    input: '{"a":1,"b":"hello"}',
    action: 'button:has-text("生成")',
    outputLocator: 'textarea:nth-of-type(2)',
    expected: 'object'
  },
  {
    path: '/password-strength',
    input: 'Password123!',
    assertion: async (page) => {
      await expect(page.locator('text=强')).toBeVisible()
    }
  },
  {
    path: '/rsa-generator',
    action: 'button:has-text("生成")',
    assertion: async (page) => {
      await expect(page.locator('text=BEGIN PUBLIC KEY')).toBeVisible()
    }
  },
  {
    path: '/password-vault',
    input: 'mypassword',
    action: 'button:has-text("解锁")',
    assertion: async (page) => {
      await expect(page.locator('text=已锁定')).toBeVisible()
    }
  },
  {
    path: '/translator',
    input: 'hello',
    action: 'button:has-text("翻译")',
    assertion: async (page) => {
      await expect(page.locator('text=你好')).toBeVisible()
    }
  },
  {
    path: '/gradient-generator',
    assertion: async (page) => {
      await expect(page.locator('text=CSS')).toBeVisible()
    }
  },
  {
    path: '/countdown',
    assertion: async (page) => {
      await expect(page.locator('button:has-text("开始")')).toBeVisible()
    }
  },
  {
    path: '/stopwatch',
    assertion: async (page) => {
      await expect(page.locator('button:has-text("开始")')).toBeVisible()
    }
  },
  {
    path: '/pomodoro',
    assertion: async (page) => {
      await expect(page.locator('button:has-text("开始")')).toBeVisible()
    }
  },
  {
    path: '/regex-builder',
    assertion: async (page) => {
      await expect(page.locator('button:has-text("字符")')).toBeVisible()
    }
  },
  {
    path: '/regex-cheatsheet',
    assertion: async (page) => {
      await expect(page.locator('table')).toBeVisible()
    }
  },
  {
    path: '/regex-lib',
    assertion: async (page) => {
      await expect(page.locator('text=邮箱')).toBeVisible()
    }
  },
  {
    path: '/regex-visual',
    input: '\\d+',
    action: 'button:has-text("可视化")',
    assertion: async (page) => {
      await expect(page.locator('text=数字')).toBeVisible()
    }
  },
  {
    path: '/favicon-gen',
    assertion: async (page) => {
      await expect(page.locator('input[type="file"]')).toBeVisible()
    }
  },
  {
    path: '/image-compress',
    assertion: async (page) => {
      await expect(page.locator('input[type="file"]')).toBeVisible()
    }
  },
  {
    path: '/image-base64',
    assertion: async (page) => {
      await expect(page.locator('input[type="file"]')).toBeVisible()
    }
  },
  {
    path: '/image-info',
    assertion: async (page) => {
      await expect(page.locator('input[type="file"]')).toBeVisible()
    }
  },
  {
    path: '/qr-scanner',
    assertion: async (page) => {
      await expect(page.locator('input[type="file"]')).toBeVisible()
    }
  },
  {
    path: '/color-extract',
    assertion: async (page) => {
      await expect(page.locator('input[type="file"]')).toBeVisible()
    }
  },
  {
    path: '/image-editor',
    assertion: async (page) => {
      await expect(page.locator('input[type="file"]')).toBeVisible()
    }
  }
]

for (const tc of textToolTests) {
  test(`${tc.path} functional check`, async ({ page }) => {
    await page.goto(tc.path, { waitUntil: 'networkidle' })
    
    if (tc.input) {
      await page.locator('textarea').first().fill(tc.input)
    }
    if (tc.extra) {
      await tc.extra(page)
    }
    if (tc.action) {
      await page.locator(tc.action).first().click()
      await page.waitForTimeout(300)
    }
    
    if (tc.outputLocator) {
      const output = await page.locator(tc.outputLocator).first().inputValue()
      expect(output).toContain(tc.expected)
    }
    if (tc.assertion) {
      await tc.assertion(page)
    }
  })
}

// API tests
import { request } from '@playwright/test'

test('translation API', async ({ request }) => {
  const res = await request.post('/api/translate', { data: { q: 'hello', source: 'en', target: 'zh' } })
  expect(res.status()).toBe(200)
  const json = await res.json()
  expect(json.translatedText).toContain('你好')
})

test('RSA API', async ({ request }) => {
  const res = await request.post('/api/rsa/generate', { data: { keySize: 512 } })
  expect(res.status()).toBe(200)
  const json = await res.json()
  expect(json.public).toContain('BEGIN PUBLIC KEY')
})
