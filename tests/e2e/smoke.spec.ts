import { test, expect } from '@playwright/test'
import { TOOLS, CATEGORIES } from '../../src/data/tools.js'

const toolPaths = TOOLS.map(t => t.path)

test.describe('Tool pages', () => {
  for (const path of toolPaths) {
    test(`${path} loads without 404 or i18n key leakage`, async ({ page }) => {
      const consoleErrors: string[] = []
      page.on('pageerror', err => consoleErrors.push(err.message))
      page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()) })

      await page.goto(path, { waitUntil: 'networkidle' })

      await expect(page.locator('body')).not.toContainText('页面不存在', { timeout: 5000 })
      await expect(page.locator('body')).not.toContainText('Page not found', { timeout: 5000 })
      await expect(page.locator('body')).not.toContainText('not-found', { timeout: 5000 })

      const hasControl = await page.locator('textarea, input, select, button, canvas').count() > 0
      expect(hasControl, `${path} has no interactive controls`).toBeTruthy()

      const bodyText = await page.locator('body').textContent() || ''
      const rawKeyPatterns = [/-desc\b/, /-placeholder\b/, /-hint\b/, /-result\b/, /-usage\b/]
      for (const pattern of rawKeyPatterns) {
        expect(bodyText, `${path} leaks raw i18n key matching ${pattern}`).not.toMatch(pattern)
      }

      expect(consoleErrors, `${path} has console errors`).toEqual([])
    })
  }
})

test.describe('Category pages', () => {
  for (const cat of CATEGORIES) {
    test(`category ${cat.key} renders its tools`, async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' })
      await page.locator(`a[href="/category/${cat.key}"]`).first().click()
      await page.waitForLoadState('networkidle')
      await expect(page.locator('body')).not.toContainText('页面不存在', { timeout: 5000 })
      const count = TOOLS.filter(t => t.cat === cat.key).length
      expect(count).toBeGreaterThan(0)
      const links = await page.locator('a[href^="/"]').count()
      expect(links, `category ${cat.key} should show tool links`).toBeGreaterThan(0)
    })
  }
})

test('home page shows all categories', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  for (const cat of CATEGORIES) {
    await expect(page.locator('body')).not.toContainText('页面不存在')
  }
})
