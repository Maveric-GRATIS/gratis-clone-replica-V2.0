// e2e/tests/auth.spec.ts
// Basic smoke tests for GRATIS.NGO platform

import { test, expect } from '@playwright/test';

test.describe('GRATIS.NGO Platform - Smoke Tests', () => {
  test('should load homepage successfully', async ({ request }) => {
    const response = await request.get('/');
    expect(response.status()).toBeLessThan(400);
  });

  test('should load auth page', async ({ request }) => {
    const response = await request.get('/auth');
    expect(response.status()).toBeLessThan(400);
  });

  test('should load GRATIS beverage page', async ({ request }) => {
    const response = await request.get('/gratis');

    // Verify route responded successfully
    expect(response.status()).toBeLessThan(400);
  });

  test('should load water page', async ({ request }) => {
    const response = await request.get('/gratis/water');

    // Verify route responded successfully
    expect(response.status()).toBeLessThan(400);
  });

  test('should load impact TV page', async ({ request }) => {
    const response = await request.get('/impact-tv');

    // Verify route responded successfully
    expect(response.status()).toBeLessThan(400);
  });

  test('should load events page', async ({ request }) => {
    const response = await request.get('/events');

    // Verify route responded successfully
    expect(response.status()).toBeLessThan(400);
  });
});
