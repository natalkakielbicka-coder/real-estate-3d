import { test, expect } from '@playwright/test'

test('renders the 3D scene canvas', async ({ page }) => {
  await page.goto('/')

  const scene = page.locator('.three-scene')
  const canvas = scene.locator('canvas')

  await expect(scene).toBeVisible()
  await expect(canvas).toBeVisible()
  await expect(canvas).toHaveCount(1)
})
