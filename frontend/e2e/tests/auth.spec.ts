import { test, expect } from '@playwright/test'

test.describe('Autenticación', () => {

  test('registrar un nuevo usuario', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.goto('/register')
    await expect(page.locator('h1')).toHaveText('Generador de Publicidad')
    await expect(page.locator('text=Crea tu cuenta gratuita')).toBeVisible()

    const email = `e2e-${Date.now()}@test.com`
    await page.fill('#name', 'E2E User')
    await page.fill('#email', email)
    await page.fill('#password', 'Password123!')
    await page.click('button:has-text("Crear Cuenta")')

    await page.waitForURL('/', { timeout: 15_000 })
    await expect(page.locator('text=Dashboard')).toBeVisible()
  })

  test('mostrar error con credenciales inválidas', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.goto('/login')
    await expect(page.locator('h1')).toHaveText('Generador de Publicidad')
    await page.fill('#email', 'invalido@test.com')
    await page.fill('#password', 'wrong')
    await page.click('button[type="submit"]')

    await expect(page.locator('text=Iniciar Sesión')).toBeVisible({ timeout: 10_000 })
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 })
  })

  test('cerrar sesión desde el sidebar', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('button[title="Cerrar sesión"]', { timeout: 10_000 })
    await page.click('button[title="Cerrar sesión"]')

    await page.waitForURL('/login', { timeout: 10_000 })
    await expect(page.locator('text=Inicia sesión')).toBeVisible()
  })
})
