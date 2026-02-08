// e2e/tests/part15-features.spec.ts
// Part 15 Enterprise Features Tests

import { test, expect } from '@playwright/test';

test.describe('Part 15 - Enterprise Features', () => {
  test('should load developer API keys page', async ({ page }) => {
    await page.goto('/developer/api-keys');
    await page.waitForLoadState('networkidle');

    // Check if page loaded (will show login or API keys page)
    const url = page.url();
    expect(url).toMatch(/\/(developer\/api-keys|auth)/);
  });

  test('should load admin scheduler dashboard', async ({ page }) => {
    await page.goto('/admin/scheduler');
    await page.waitForLoadState('networkidle');

    // Check if page loaded (will redirect to login if not admin)
    const url = page.url();
    expect(url).toMatch(/\/(admin\/scheduler|auth)/);
  });

  test('should load platform settings page', async ({ page }) => {
    await page.goto('/admin/platform-settings');
    await page.waitForLoadState('networkidle');

    // Check if page loaded (will redirect to login if not admin)
    const url = page.url();
    expect(url).toMatch(/\/(admin\/platform-settings|auth)/);
  });

  test('should handle 404 for non-existent routes', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await page.waitForLoadState('networkidle');

    // Should show 404 page or redirect
    const pageText = await page.textContent('body');
    expect(pageText).toMatch(/404|not found/i);
  });

  test('should load homepage with proper structure', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for essential elements
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Verify page is interactive
    const interactive = await page.evaluate(() => document.readyState);
    expect(interactive).toBe('complete');
  });
});
