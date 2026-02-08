// e2e/fixtures/auth.ts
// Authentication fixtures for Playwright tests
/* eslint-disable react-hooks/rules-of-hooks */

import { test as base } from '@playwright/test';

interface AuthUser {
  email: string;
  password: string;
  displayName?: string;
}

interface TestFixtures {
  authenticatedUser: AuthUser;
  adminUser: AuthUser;
}

// Test users
export const testUsers = {
  regular: {
    email: 'test@gratis.ngo',
    password: 'TestPassword123!',
    displayName: 'Test User',
  },
  admin: {
    email: 'admin@gratis.ngo',
    password: 'AdminPassword123!',
    displayName: 'Admin User',
  },
  creator: {
    email: 'creator@gratis.ngo',
    password: 'CreatorPassword123!',
    displayName: 'Content Creator',
  },
};

export const test = base.extend<TestFixtures>({
  authenticatedUser: async ({ page }, use) => {
    // Navigate to login
    await page.goto('/login');

    // Fill in credentials
    await page.fill('input[type="email"]', testUsers.regular.email);
    await page.fill('input[type="password"]', testUsers.regular.password);

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for navigation to complete
    await page.waitForURL('**/dashboard');

    await use(testUsers.regular);
  },

  adminUser: async ({ page }, use) => {
    // Navigate to login
    await page.goto('/login');

    // Fill in admin credentials
    await page.fill('input[type="email"]', testUsers.admin.email);
    await page.fill('input[type="password"]', testUsers.admin.password);

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for navigation to admin dashboard
    await page.waitForURL('**/admin/**');

    await use(testUsers.admin);
  },
});

export { expect } from '@playwright/test';
