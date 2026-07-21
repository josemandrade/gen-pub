import { test, expect } from '@playwright/test'

test.describe('Manejo de errores', () => {

  test('redirigir a login al acceder sin autenticación', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.goto('/campaigns')
    await page.waitForURL(/\/login/, { timeout: 10_000 })
    await expect(page.locator('text=Inicia sesión')).toBeVisible()
  })
})
