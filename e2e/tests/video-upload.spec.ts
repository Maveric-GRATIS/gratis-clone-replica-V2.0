// e2e/tests/part15-features.spec.ts
// Part 15 Enterprise Features Tests

import { test, expect } from '@playwright/test';

test.describe('Part 15 - Enterprise Features', () => {
  test('should load developer API keys page', async ({ page }) => {
    const response = await page.goto('/developer/api-keys', { waitUntil: 'domcontentloaded' });

    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(400);

    // Check if page loaded (will show login or API keys page)
    const url = page.url();
    expect(url).toMatch(/\/(developer\/api-keys|auth)/);
  });

  test('should load admin scheduler dashboard', async ({ page }) => {
    const response = await page.goto('/admin/scheduler', { waitUntil: 'domcontentloaded' });

    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(400);

    // Check if page loaded (will redirect to login if not admin)
    const url = page.url();
    expect(url).toMatch(/\/(admin\/scheduler|auth)/);
  });

  test('should load platform settings page', async ({ page }) => {
    const response = await page.goto('/admin/platform-settings', { waitUntil: 'domcontentloaded' });

    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(400);

    // Check if page loaded (will redirect to login if not admin)
    const url = page.url();
    expect(url).toMatch(/\/(admin\/platform-settings|auth)/);
  });

  test('should handle 404 for non-existent routes', async ({ page }) => {
    const response = await page.goto('/this-route-does-not-exist', { waitUntil: 'domcontentloaded' });

    expect(response).not.toBeNull();

    // Should show 404 page or redirect
    const pageText = await page.textContent('body');
    expect(pageText).toMatch(/404|not found/i);
  });

  test('should load homepage with proper structure', async ({ page }) => {
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' });

    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(400);

    // Check for essential elements
    // Verify page is interactive
    const interactive = await page.evaluate(() => document.readyState);
    expect(interactive).toBe('complete');
  });
});
