import { defineConfig, devices } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const BACKEND_DIR = path.resolve(__dirname, '../../backend')
const WEB_APP_PORT = 5173
const BACKEND_PORT = 8080
const isWin = process.platform === 'win32'
const mvnw = path.resolve(BACKEND_DIR, isWin ? 'mvnw.cmd' : 'mvnw')
const authFile = path.resolve(__dirname, '.auth.json')

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 60_000,
  expect: {
    timeout: 15_000,
  },
  reporter: process.env.CI
    ? [['html', { outputFolder: 'e2e-report' }], ['list']]
    : 'list',

  use: {
    baseURL: `http://localhost:${WEB_APP_PORT}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    launchOptions: {
      slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO, 10) : 0,
    },
  },

  projects: [
    {
      name: 'setup',
      testMatch: '**/*.setup.ts',
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: authFile,
      },
      dependencies: ['setup'],
    },
  ],

  webServer: [
    {
      command: `"${mvnw}" spring-boot:run -Dspring-boot.run.profiles=e2e -Dspring-boot.run.arguments=--server.port=${BACKEND_PORT}`,
      cwd: BACKEND_DIR,
      port: BACKEND_PORT,
      timeout: 120_000,
      reuseExistingServer: false,
      stdout: 'pipe',
      stderr: 'pipe',
      env: {
        JAVA_HOME: process.env.JAVA_HOME || '',
        SPRING_DATASOURCE_URL: process.env.CI
          ? 'jdbc:postgresql://localhost:5433/generador_publicidad_e2e'
          : undefined,
        SPRING_DATASOURCE_USERNAME: process.env.CI ? 'postgres' : undefined,
        SPRING_DATASOURCE_PASSWORD: process.env.CI ? 'postgres' : undefined,
        SPRING_DATASOURCE_DRIVER_CLASS_NAME: process.env.CI ? 'org.postgresql.Driver' : undefined,
        JWT_SECRET: process.env.CI ? 'ci-e2e-secret-key-for-testing-only' : undefined,
      },
    },
    {
      command: `npx vite --port ${WEB_APP_PORT} --host`,
      cwd: path.resolve(__dirname, '..'),
      url: `http://localhost:${WEB_APP_PORT}/`,
      timeout: 60_000,
      reuseExistingServer: false,
      stdout: 'pipe',
      stderr: 'pipe',
    },
  ],
})
