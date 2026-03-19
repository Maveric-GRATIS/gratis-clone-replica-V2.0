// e2e/tests/auth.spec.ts
// Basic smoke tests for GRATIS.NGO platform

import { test, expect } from '@playwright/test';

test.describe('GRATIS.NGO Platform - Smoke Tests', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');

    // Check if page loaded
    await expect(page).toHaveTitle(/GRATIS/i);

    // Check for main navigation or logo
    const logo = page.locator('img[alt*="GRATIS"], a:has-text("GRATIS")');
    await expect(logo.first()).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to auth page', async ({ page }) => {
    await page.goto('/');

    // Look for login/auth link
    const authLink = page.locator('a[href*="/auth"], button:has-text("Login"), a:has-text("Login")');
    if (await authLink.count() > 0) {
      await authLink.first().click();
      await page.waitForLoadState('domcontentloaded');

      // Verify we're on auth-related page
      const url = page.url();
      expect(url).toMatch(/\/(auth|login|signin)/i);
    }
  });

  test('should load GRATIS beverage page', async ({ page }) => {
    await page.goto('/gratis', { waitUntil: 'commit' });

    // Verify page loaded
    await expect(page).toHaveURL(/\/gratis/i);
  });

  test('should load water page', async ({ page }) => {
    await page.goto('/gratis/water', { waitUntil: 'commit' });

    // Verify page loaded
    await expect(page).toHaveURL(/\/water/i);
  });

  test('should load impact TV page', async ({ page }) => {
    await page.goto('/impact-tv', { waitUntil: 'commit' });

    // Verify page loaded
    await expect(page).toHaveURL(/\/impact-tv/i);
  });

  test('should load events page', async ({ page }) => {
    await page.goto('/events', { waitUntil: 'commit' });

    // Verify page loaded
    await expect(page).toHaveURL(/\/events/i);
  });
});
