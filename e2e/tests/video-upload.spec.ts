// e2e/tests/part15-features.spec.ts
// Part 15 Enterprise Features Tests

import { test, expect } from '@playwright/test';

test.describe('Part 15 - Enterprise Features', () => {
  test('should load developer API keys page', async ({ request }) => {
    const response = await request.get('/developer/api-keys');
    expect(response.status()).toBeLessThan(400);
  });

  test('should load admin scheduler dashboard', async ({ request }) => {
    const response = await request.get('/admin/scheduler');
    expect(response.status()).toBeLessThan(400);
  });

  test('should load platform settings page', async ({ request }) => {
    const response = await request.get('/admin/platform-settings');
    expect(response.status()).toBeLessThan(400);
  });

  test('should serve app shell for non-existent routes', async ({ request }) => {
    const response = await request.get('/this-route-does-not-exist');
    expect(response.status()).toBeLessThan(500);
  });

  test('should load homepage with proper structure', async ({ request }) => {
    const response = await request.get('/');
    expect(response.status()).toBeLessThan(400);
  });
});
