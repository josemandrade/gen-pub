import { test, expect } from '@playwright/test'

const CAMPANIA_NOMBRE = `Campaña E2E ${Date.now()}`
const CAMPANIA_DESC = 'Descripción generada por test automatizado'

test.describe('Campañas', () => {

  test('crear una campaña exitosamente', async ({ page }) => {
    await page.goto('/campaigns')
    await expect(page.locator('h1')).toHaveText('Campañas')
    await page.click('button:has-text("Nueva Campaña")')

    await page.fill('#campaign-name', CAMPANIA_NOMBRE)
    await page.fill('#campaign-desc', CAMPANIA_DESC)
    await page.click('button:has-text("Crear Campaña")')

    await expect(page.locator(`h3:has-text("${CAMPANIA_NOMBRE}")`).first()).toBeVisible({ timeout: 10_000 })
  })

  test('mostrar listado de campañas como cards', async ({ page }) => {
    await page.goto('/campaigns')
    await expect(page.locator('h1')).toHaveText('Campañas')
    await expect(page.locator('h3').first()).toBeVisible()
  })

  test('mostrar formulario de nueva campaña', async ({ page }) => {
    await page.goto('/campaigns')
    await expect(page.locator('h1')).toHaveText('Campañas')
    await page.click('button:has-text("Nueva Campaña")')
    await expect(page.locator('#campaign-name')).toBeVisible()
    await expect(page.locator('#campaign-desc')).toBeVisible()
    await expect(page.locator('button:has-text("Crear Campaña")')).toBeVisible()
  })
})
