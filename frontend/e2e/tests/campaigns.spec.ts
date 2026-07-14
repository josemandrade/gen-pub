import { test, expect } from '@playwright/test'

test.describe('Campañas', () => {

  test('debe crear una campaña exitosamente', async ({ page }) => {
    await page.goto('/campaigns')
    await page.click('text=Nueva Campaña')
    await page.fill('#campaign-name', 'Campaña E2E Test')
    await page.fill('#campaign-desc', 'Descripción de prueba')
    await page.click('text=Crear Campaña')

    await expect(page.locator('text=Campaña E2E Test').first()).toBeVisible({ timeout: 10_000 })
  })

  test('debe mostrar el listado de campañas', async ({ page }) => {
    await page.goto('/campaigns')
    await expect(page.locator('h1')).toHaveText('Campañas')
  })
})
