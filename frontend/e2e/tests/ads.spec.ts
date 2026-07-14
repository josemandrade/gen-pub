import { test, expect } from '@playwright/test'

test.describe('Anuncios', () => {

  test('debe mostrar página de historial vacía', async ({ page }) => {
    await page.goto('/ads')
    await expect(page.locator('h1')).toHaveText('Mis Anuncios')
    await expect(page.locator('text=No hay anuncios todavía')).toBeVisible()
  })

  test('debe crear una campaña primero y luego mostrar en el selector del wizard', async ({ page }) => {
    await page.goto('/campaigns')
    await page.click('text=Nueva Campaña')
    await page.fill('#campaign-name', 'Campaña para Anuncio')
    await page.click('text=Crear Campaña')
    await expect(page.locator('text=Campaña para Anuncio').first()).toBeVisible({ timeout: 10_000 })

    await page.goto('/ads/new')
    await expect(page.locator('h1')).toHaveText('Crear Anuncio')

    const campaignOption = page.locator('#campaign option', { hasText: 'Campaña para Anuncio' }).first()
    await expect(campaignOption).toBeAttached()
  })
})
