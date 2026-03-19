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
    const response = await page.goto('/gratis', { waitUntil: 'domcontentloaded' });

    // Verify route responded successfully
    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(400);
  });

  test('should load water page', async ({ page }) => {
    const response = await page.goto('/gratis/water', { waitUntil: 'domcontentloaded' });

    // Verify route responded successfully
    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(400);
  });

  test('should load impact TV page', async ({ page }) => {
    const response = await page.goto('/impact-tv', { waitUntil: 'domcontentloaded' });

    // Verify route responded successfully
    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(400);
  });

  test('should load events page', async ({ page }) => {
    const response = await page.goto('/events', { waitUntil: 'domcontentloaded' });

    // Verify route responded successfully
    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(400);
  });
});
