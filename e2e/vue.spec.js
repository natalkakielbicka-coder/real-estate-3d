import { test, expect } from '@playwright/test'

test('renders the 3D scene canvas', async ({ page }) => {
  await page.goto('/')

  const scene = page.locator('.three-scene')
  const canvas = scene.locator('canvas')

  await expect(scene).toBeVisible()
  await expect(canvas).toBeVisible()
  await expect(canvas).toHaveCount(1)
})

test('hides the floor tooltip when the pointer leaves the canvas', async ({ page }) => {
  await page.goto('/')

  const scene = page.locator('.three-scene')
  const canvas = scene.locator('canvas')
  const tooltip = scene.locator('.scene-tooltip')

  await expect(canvas).toBeVisible()

  const bounds = await canvas.boundingBox()
  if (!bounds) throw new Error('The scene canvas has no bounding box')

  // Sprawdź kilka punktów na środku sceny, aż kursor trafi na piętro.
  for (const y of [0.5, 0.4, 0.6, 0.3, 0.7]) {
    await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height * y)

    if (await tooltip.isVisible()) {
      break
    }
  }

  await expect(tooltip).toContainText('dostępnych')

  await canvas.dispatchEvent('pointerleave')
  await expect(tooltip).toBeHidden()
})
