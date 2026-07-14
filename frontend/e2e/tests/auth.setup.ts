import { test as setup, expect } from '@playwright/test'

const authFile = 'e2e/.auth.json'

setup('loguear como admin de prueba', async ({ page }) => {
  await page.goto('/login', { waitUntil: 'networkidle', timeout: 30_000 })
  await page.waitForSelector('#email', { timeout: 20_000 })
  await page.fill('#email', 'admin@test.com')
  await page.fill('#password', 'password123')
  await page.click('button[type="submit"]')
  await page.waitForURL('/', { timeout: 20_000 })
  await expect(page.locator('text=Panel')).toBeVisible()
  await page.context().storageState({ path: authFile })
})
