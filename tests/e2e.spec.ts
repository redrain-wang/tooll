import { test, expect } from '@playwright/test'

const tools = [
  { path: '/image-editor', selectors: ['canvas', 'input[type="file"]'] },
  { path: '/json-tree', selectors: ['textarea', 'button:has-text("可视化")'] },
  { path: '/code-formatter', selectors: ['textarea', 'select'] },
  { path: '/password-vault', selectors: ['input[type="password"]', 'button:has-text("解锁")'] },
  { path: '/text-compare', selectors: ['textarea', 'button:has-text("对比")'] },
  { path: '/translator', selectors: ['textarea', 'button:has-text("翻译")'] },
  { path: '/json-excel', selectors: ['textarea', 'button:has-text("下载"), button:has-text("生成")'] },
  { path: '/svg-editor', selectors: ['textarea', 'button:has-text("优化")'] },
  { path: '/json-schema-gen', selectors: ['textarea', 'button:has-text("生成")'] },
  { path: '/meta-tag-gen', selectors: ['input', 'button:has-text("生成")'] },
  { path: '/color-contrast', selectors: ['input[type="color"]'] },
  { path: '/favicon-gen', selectors: ['input[type="file"]', 'button:has-text("生成")'] },
  { path: '/image-compress', selectors: ['input[type="file"]', 'button:has-text("下载")'] },
  { path: '/qr-scanner', selectors: ['input[type="file"]'] },
  { path: '/device-info', selectors: ['text=浏览器'] },
  { path: '/speed-test', selectors: ['button:has-text("开始测速")'] },
  { path: '/regex-builder', selectors: ['button:has-text("字符")'] },
]

test.describe('Complex Tools E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8089')
    await page.waitForLoadState('networkidle')
  })

  for (const tool of tools) {
    test(`${tool.path} - loads and has expected elements`, async ({ page }) => {
      await page.goto(`http://localhost:8089${tool.path}`)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000)

      for (const selector of tool.selectors) {
        const el = page.locator(selector).first()
        if (await el.count() > 0) {
          // For file inputs, check existence instead of visibility
          if (selector.includes('input[type="file"]')) {
            await expect(el).toBeAttached({ timeout: 5000 })
          } else {
            await expect(el).toBeVisible({ timeout: 5000 })
          }
          console.log(`✅ ${tool.path}: found ${selector}`)
          return
        }
      }
      throw new Error(`No selector found for ${tool.path}`)
    })
  }
})