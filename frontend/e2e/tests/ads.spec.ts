import { test, expect } from '@playwright/test'

test.describe('Anuncios', () => {

  test('mostrar página de historial con anuncio de ejemplo', async ({ page }) => {
    await page.goto('/ads')
    await expect(page.locator('h1')).toHaveText('Mis Anuncios')
    await expect(page.locator('h3:has-text("Anuncio de ejemplo")')).toBeVisible()
  })

  test('wizard: formulario de creación visible en paso detalles', async ({ page }) => {
    await page.goto('/ads/new')
    await expect(page.locator('h1')).toHaveText('Crear Anuncio')
    await expect(page.locator('text=Detalles del anuncio')).toBeVisible()

    const campaignSelect = page.locator('select#campaign')
    await expect(campaignSelect).toBeVisible()

    await expect(page.locator('button:has-text("Continuar a archivos")')).toBeVisible()
  })

  test('wizard: botón Generar con IA abre formulario de prompt', async ({ page }) => {
    await page.goto('/ads/new')
    await expect(page.locator('h1')).toHaveText('Crear Anuncio')

    const generateIaBtn = page.locator('button:has-text("Generar con IA")')
    await expect(generateIaBtn).toBeVisible()
    await generateIaBtn.click()

    await expect(page.locator('#prompt')).toBeVisible({ timeout: 5_000 })
  })

  test('navegar a detalle y ver botón de editar', async ({ page }) => {
    await page.goto('/ads')

    const adCard = page.locator('h3').first()
    await expect(adCard).toBeVisible({ timeout: 10_000 })
    await adCard.click()

    await page.waitForURL(/\/ads\/\d+$/, { timeout: 10_000 })
    await expect(page.locator('button:has-text("Editar")')).toBeVisible()
  })

  test('navegar a edición desde detalle', async ({ page }) => {
    await page.goto('/ads')

    const adCard = page.locator('h3').first()
    await expect(adCard).toBeVisible({ timeout: 10_000 })
    await adCard.click()
    await page.waitForURL(/\/ads\/\d+$/, { timeout: 10_000 })

    await page.click('button:has-text("Editar")')
    await page.waitForURL(/\/ads\/\d+\/edit/, { timeout: 10_000 })
    await expect(page.locator('text=Editar Anuncio')).toBeVisible()
  })
})
