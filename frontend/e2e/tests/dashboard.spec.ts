import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {

  test('mostrar encabezado y stats', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=Buenos días')).toBeVisible()
    await expect(page.locator('text=Resumen de tu actividad publicitaria')).toBeVisible()

    await expect(page.locator('text=Campañas').first()).toBeVisible()
    await expect(page.locator('text=Anuncios').first()).toBeVisible()
    await expect(page.locator('text=Pendientes')).toBeVisible()
  })

  test('mostrar cards de acción', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h2:has-text("Crea un anuncio")')).toBeVisible()
    await expect(page.locator('h2:has-text("Gestiona campañas")')).toBeVisible()
  })

  test('navegar a nuevo anuncio desde dashboard', async ({ page }) => {
    await page.goto('/')
    await page.click('button:has-text("Nuevo Anuncio")')
    await page.waitForURL('/ads/new', { timeout: 10_000 })
    await expect(page.locator('h1')).toHaveText('Crear Anuncio')
  })

  test('navegar a campañas desde dashboard', async ({ page }) => {
    await page.goto('/')
    await page.click('button:has-text("Ir a Campañas")')
    await page.waitForURL('/campaigns', { timeout: 10_000 })
    await expect(page.locator('h1')).toHaveText('Campañas')
  })
})
